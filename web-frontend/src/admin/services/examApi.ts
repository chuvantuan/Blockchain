// Admin Exam API Service
// Re-export main API + admin-specific functions

import examApiMain, {
	type Exam,
	type ExamCreationRequest,
	type ExamConfigRequest,
	type ExamScheduleRequest,
	type Question,
	type QuestionCreationRequest,
	type QuestionSearchRequest,
	type GenerateQuestionsRequest,
	type GeneratedQuestionsResponse,
	type ExamStatus,
	type QuestionType,
	createExam,
	getExamById,
	updateExamConfig,
	deleteExam,
	scheduleExam,
	generateExamQuestions,
	getExamSchedules,
	createQuestion,
	deleteQuestion,
	searchQuestions,
	generateRandomQuestions,
	examAxios, // ✨ Import examAxios for new enum endpoints
} from '../../services/api/examApi';

// Re-export types
export type {
	Exam,
	ExamCreationRequest,
	ExamConfigRequest,
	ExamScheduleRequest,
	Question,
	QuestionCreationRequest,
	QuestionSearchRequest,
	GenerateQuestionsRequest,
	GeneratedQuestionsResponse,
	ExamStatus,
	QuestionType,
};

// Re-export functions
export {
	createExam,
	getExamById,
	updateExamConfig,
	deleteExam,
	scheduleExam,
	generateExamQuestions,
	getExamSchedules,
	createQuestion,
	deleteQuestion,
	searchQuestions,
	generateRandomQuestions,
};

// ==================== Question Import API ====================

export interface QuestionImportResponse {
	imported: number;
	skipped: number;
	errors: number;
	errorDetails: string[];
	subject: string;
	tags: string[];
}

export interface QuestionImportStatsResponse {
	totalQuestions: number;
	totalTags: number;
	questionsByTag: Record<string, number>;
}

export interface DeleteQuestionsByTagResponse {
	deletedCount: number;
	tag: string;
	message: string;
}

export async function importQuestionsFromExcel(
	file: File,
	subject: string,
	tags: string
): Promise<QuestionImportResponse> {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('subject', subject);
	// If tags is empty, only use subject. Otherwise use provided tags
	formData.append('tags', tags || subject);

	const response = await examAxios.post<QuestionImportResponse>(
		'/api/questions/import-excel',
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	);

	return response.data;
}

/**
 * Get import statistics
 */
export async function getImportStatistics(): Promise<QuestionImportStatsResponse> {
	const response = await examAxios.get<QuestionImportStatsResponse>('/api/questions/import-stats');
	return response.data;
}

/**
 * Delete all questions by tag
 * @param tag Tag name to delete
 */
export async function deleteQuestionsByTag(tag: string): Promise<DeleteQuestionsByTagResponse> {
	const response = await examAxios.delete<DeleteQuestionsByTagResponse>(
		`/api/questions/by-tag/${encodeURIComponent(tag)}`
	);
	return response.data;
}

// ==================== Admin-Specific Functions ====================

/**
 * Get all exams (admin view) - fetch scheduled exams without date filter
 */
export async function getAllExams(): Promise<Exam[]> {
	try {
		// Get all scheduled exams without time filter
		return await getExamSchedules();
	} catch (error) {
		console.error('Error getting all exams:', error);
		throw error;
	}
}

/**
 * Get exam statistics (admin dashboard)
 */
export async function getExamStatistics() {
	try {
		const exams = await getAllExams();
		
		const totalExams = exams.length;
		const draftExams = exams.filter(e => e.status === 'DRAFT').length;
		const scheduledExams = exams.filter(e => e.status === 'SCHEDULED').length;
		const activeExams = exams.filter(e => e.status === 'ACTIVE').length;
		const completedExams = exams.filter(e => e.status === 'COMPLETED').length;
		const cancelledExams = exams.filter(e => e.status === 'CANCELLED').length;
		
		return {
			totalExams,
			draftExams,
			scheduledExams,
			activeExams,
			completedExams,
			cancelledExams,
		};
	} catch (error) {
		console.error('Error getting exam statistics:', error);
		return {
			totalExams: 0,
			draftExams: 0,
			scheduledExams: 0,
			activeExams: 0,
			completedExams: 0,
			cancelledExams: 0,
		};
	}
}

/**
 * Get upcoming exams (next 7 days)
 */
export async function getUpcomingExams(days: number = 7): Promise<Exam[]> {
	try {
		const now = new Date();
		const endDate = new Date();
		endDate.setDate(endDate.getDate() + days);
		
		const exams = await getExamSchedules(
			now.toISOString(),
			endDate.toISOString()
		);
		
		return exams.filter(e => e.status === 'SCHEDULED' || e.status === 'ACTIVE');
	} catch (error) {
		console.error('Error getting upcoming exams:', error);
		return [];
	}
}

/**
 * Get recent exams (last 30 days)
 */
export async function getRecentExams(days: number = 30): Promise<Exam[]> {
	try {
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);
		
		const exams = await getExamSchedules(
			startDate.toISOString(),
			endDate.toISOString()
		);
		
		return exams.sort((a, b) => {
			const dateA = new Date(a.createdAt).getTime();
			const dateB = new Date(b.createdAt).getTime();
			return dateB - dateA;
		});
	} catch (error) {
		console.error('Error getting recent exams:', error);
		return [];
	}
}

/**
 * Get all questions (admin view)
 */
export async function getAllQuestions(): Promise<Question[]> {
	try {
		return await searchQuestions();
	} catch (error) {
		console.error('Error getting all questions:', error);
		return [];
	}
}

/**
 * Get all unique tags/subjects from questions using dedicated endpoint
 */
export async function getAllSubjects(): Promise<string[]> {
	try {
		// Use the new optimized backend endpoint
		const response = await examAxios.get<string[]>('/exams/subjects');
		return response.data || [];
	} catch (error) {
		console.error('Error getting subjects from API:', error);
		// Fallback: extract from questions if endpoint fails
		try {
			const questions = await searchQuestions();
			const allTags = new Set<string>();
			
			questions.forEach(question => {
				if (question.tags && Array.isArray(question.tags)) {
					question.tags.forEach(tag => allTags.add(tag));
				}
			});
			
			return Array.from(allTags).sort();
		} catch (fallbackError) {
			console.error('Fallback also failed:', fallbackError);
			return [];
		}
	}
}

/**
 * Get question statistics (admin dashboard)
 */
export async function getQuestionStatistics() {
	try {
		const questions = await getAllQuestions();
		
		const totalQuestions = questions.length;
		const easyQuestions = questions.filter(q => (q.difficulty || 0) <= 3).length;
		const mediumQuestions = questions.filter(q => (q.difficulty || 0) > 3 && (q.difficulty || 0) <= 7).length;
		const hardQuestions = questions.filter(q => (q.difficulty || 0) > 7).length;
		
		// Count by type
		const singleChoiceCount = questions.filter(q => q.type === 'SINGLE_CHOICE').length;
		const multipleChoiceCount = questions.filter(q => q.type === 'MULTIPLE_CHOICE').length;
		const trueFalseCount = questions.filter(q => q.type === 'TRUE_FALSE').length;
		const shortAnswerCount = questions.filter(q => q.type === 'SHORT_ANSWER').length;
		const essayCount = questions.filter(q => q.type === 'ESSAY').length;
		
		return {
			totalQuestions,
			easyQuestions,
			mediumQuestions,
			hardQuestions,
			byType: {
				singleChoice: singleChoiceCount,
				multipleChoice: multipleChoiceCount,
				trueFalse: trueFalseCount,
				shortAnswer: shortAnswerCount,
				essay: essayCount,
			}
		};
	} catch (error) {
		console.error('Error getting question statistics:', error);
		return {
			totalQuestions: 0,
			easyQuestions: 0,
			mediumQuestions: 0,
			hardQuestions: 0,
			byType: {
				singleChoice: 0,
				multipleChoice: 0,
				trueFalse: 0,
				shortAnswer: 0,
				essay: 0,
			}
		};
	}
}

/**
 * Search exams by title or description
 */
export async function searchExams(query: string): Promise<Exam[]> {
	try {
		const allExams = await getAllExams();
		const lowerQuery = query.toLowerCase();
		
		return allExams.filter(exam =>
			exam.title.toLowerCase().includes(lowerQuery) ||
			(exam.description || '').toLowerCase().includes(lowerQuery)
		);
	} catch (error) {
		console.error('Error searching exams:', error);
		return [];
	}
}

/**
 * Get exams by status
 */
export async function getExamsByStatus(status: ExamStatus): Promise<Exam[]> {
	try {
		const allExams = await getAllExams();
		return allExams.filter(exam => exam.status === status);
	} catch (error) {
		console.error('Error getting exams by status:', error);
		return [];
	}
}

/**
 * Update exam status (publish/unpublish)
 * ✨ NEW: Allow admin to publish/unpublish exams
 */
export async function updateExamStatus(examId: string, status: ExamStatus): Promise<Exam> {
	try {
		const response = await examAxios.put<Exam>(`/exams/${examId}/status`, {
			status
		});
		return response.data;
	} catch (error) {
		console.error('Error updating exam status:', error);
		throw error;
	}
}

// ==================== Enum/Lookup APIs ====================

/**
 * Get all exam types from backend (practice, quiz, midterm, final, assignment)
 * ✨ NEW: Replaces hardcoded options
 */
export async function getAllExamTypes(): Promise<import('../types/exam').EnumOption[]> {
	try {
		const response = await examAxios.get<import('../types/exam').EnumOption[]>('/exams/types');
		return response.data || [];
	} catch (error) {
		console.error('Error getting exam types:', error);
		// Fallback to default types if API fails
		return [
			{ code: 'practice', label: 'Practice', labelVi: 'Luyện tập', displayOrder: 1 },
			{ code: 'quiz', label: 'Quiz', labelVi: 'Kiểm tra', displayOrder: 2 },
			{ code: 'midterm', label: 'Midterm', labelVi: 'Giữa kỳ', displayOrder: 3 },
			{ code: 'final', label: 'Final', labelVi: 'Cuối kỳ', displayOrder: 4 },
			{ code: 'assignment', label: 'Assignment', labelVi: 'Bài tập', displayOrder: 5 },
		];
	}
}

/**
 * Get all exam difficulties from backend (easy, medium, hard)
 * ✨ NEW: Replaces hardcoded options
 */
export async function getAllExamDifficulties(): Promise<import('../types/exam').EnumOption[]> {
	try {
		const response = await examAxios.get<import('../types/exam').EnumOption[]>('/exams/difficulties');
		return response.data || [];
	} catch (error) {
		console.error('Error getting exam difficulties:', error);
		// Fallback to default difficulties if API fails
		return [
			{ code: 'easy', label: 'Easy', labelVi: 'Dễ', displayOrder: 1 },
			{ code: 'medium', label: 'Medium', labelVi: 'Trung bình', displayOrder: 2 },
			{ code: 'hard', label: 'Hard', labelVi: 'Khó', displayOrder: 3 },
		];
	}
}

/**
 * Get all exam statuses from backend (draft, published, ongoing, ended, archived)
 * ✨ NEW: Replaces hardcoded options
 */
export async function getAllExamStatuses(): Promise<import('../types/exam').EnumOption[]> {
	try {
		const response = await examAxios.get<import('../types/exam').EnumOption[]>('/exams/statuses');
		return response.data || [];
	} catch (error) {
		console.error('Error getting exam statuses:', error);
		// Fallback to default statuses if API fails
		return [
			{ code: 'draft', label: 'Draft', labelVi: 'Nháp', displayOrder: 1 },
			{ code: 'published', label: 'Published', labelVi: 'Đã xuất bản', displayOrder: 2 },
			{ code: 'ongoing', label: 'Ongoing', labelVi: 'Đang diễn ra', displayOrder: 3 },
			{ code: 'ended', label: 'Ended', labelVi: 'Đã kết thúc', displayOrder: 4 },
			{ code: 'archived', label: 'Archived', labelVi: 'Lưu trữ', displayOrder: 5 },
		];
	}
}

// ==================== Default Export ====================

const adminExamApi = {
	// Re-exported from main API
	...examApiMain,
	
	// Admin-specific functions
	getAllExams,
	getExamStatistics,
	getUpcomingExams,
	getRecentExams,
	getAllQuestions,
	getAllSubjects,
	getQuestionStatistics,
	searchExams,
	getExamsByStatus,
	updateExamStatus, // ✨ NEW
	
	// ✨ NEW: Enum/lookup functions
	getAllExamTypes,
	getAllExamDifficulties,
	getAllExamStatuses,
};

export default adminExamApi;

