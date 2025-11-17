// Exam API Service
import axios from 'axios';

// Use API Gateway for all requests
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/exam`;

// Create axios instance with interceptors
const examAxios = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add auth token
examAxios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for error handling
examAxios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			console.error('Unauthorized access - redirecting to login');
			// Optionally redirect to login page
			// window.location.href = '/auth';
		}
		return Promise.reject(error);
	}
);

// ==================== Types ====================

export type ExamStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY';

export interface Exam {
	id: string;
	orgId: string;
	title: string;
	description?: string;
	startAt?: string; // ISO datetime
	endAt?: string; // ISO datetime
	durationMinutes?: number;
	passScore?: number;
	maxAttempts?: number;
	totalQuestions?: number; // ✨ NEW: Total number of questions
    assignedQuestionCount?: number; // ✨ NEW: Number of questions currently attached to exam
	createdBy: string;
	status: ExamStatus;
	createdAt: string;
	tags?: string[];
}

// ✨ NEW: Enum/Lookup option from backend
export interface EnumOption {
	code: string;          // e.g., "practice", "easy", "draft"
	label: string;         // English label
	labelVi: string;       // Vietnamese label  
	description?: string;  // Optional description
	displayOrder?: number; // Display order in UI
}

export interface ExamCreationRequest {
	orgId: string;
	title: string;
	description?: string;
	startAt?: string; // ISO datetime
	endAt?: string; // ISO datetime
	durationMinutes?: number;
	passScore?: number;
	maxAttempts?: number;
	totalQuestions?: number; // ✨ NEW: Total number of questions
	createdBy: string;
	tags?: string[]; // ✨ NEW: Tags/subjects for exam
}

export interface ExamConfigRequest {
	durationMinutes?: number;
	passScore?: number;
	maxAttempts?: number;
}

export interface ExamUpdateRequest {
	title?: string;
	description?: string;
	startAt?: string;
	endAt?: string;
	durationMinutes?: number;
	passScore?: number;
	maxAttempts?: number;
	totalQuestions?: number;
	tags?: string[];
}

export interface ExamScheduleRequest {
	startAt: string; // ISO datetime
	endAt: string; // ISO datetime
	studentIds: string[]; // UUIDs
}

export interface Question {
	id: string;
	type: QuestionType;
	content: string; // JSON string
	difficulty?: number;
	explanation?: string;
	score?: number;
	text?: string;
	tags?: string[];
	createdAt: string;
	updatedAt?: string;
}

export interface QuestionCreationRequest {
	type: QuestionType;
	content: string; // JSON string
	difficulty?: number;
	explanation?: string;
	score?: number;
	text?: string;
	tags?: string[];
}

export interface QuestionSearchRequest {
	tags?: string[];
	minDifficulty?: number;
	maxDifficulty?: number;
}

export interface GenerateQuestionsRequest {
	count: number;
	tags?: string[];
	minDifficulty?: number;
	maxDifficulty?: number;
}

export interface GeneratedQuestionsResponse {
	questionIds: string[];
}

export interface ExamRegistration {
	id: string;
	examId: string;
	studentId: string;
	status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
	registeredAt: string;
}

// ==================== Exam Operations ====================

/**
 * Create new exam
 */
export const createExam = async (request: ExamCreationRequest): Promise<Exam> => {
	try {
		const response = await examAxios.post('/exams', request);
		return response.data;
	} catch (error: any) {
		console.error('Error creating exam:', error);
		throw new Error(error.response?.data?.message || 'Failed to create exam');
	}
};

/**
 * Get exam by ID
 */
export const getExamById = async (examId: string): Promise<Exam> => {
	try {
		const response = await examAxios.get(`/exams/${examId}`);
		return response.data;
	} catch (error: any) {
		console.error('Error getting exam:', error);
		throw new Error(error.response?.data?.message || 'Failed to get exam');
	}
};

/**
 * Update exam config
 */
export const updateExamConfig = async (
	examId: string,
	config: ExamConfigRequest
): Promise<Exam> => {
	try {
		const response = await examAxios.put(`/exams/${examId}/config`, config);
		return response.data;
	} catch (error: any) {
		console.error('Error updating exam config:', error);
		throw new Error(error.response?.data?.message || 'Failed to update exam config');
	}
};

export const updateExam = async (
	examId: string,
	request: ExamUpdateRequest
): Promise<Exam> => {
	try {
		const response = await examAxios.put(`/exams/${examId}`, request);
		return response.data;
	} catch (error: any) {
		console.error('Error updating exam:', error);
		throw new Error(error.response?.data?.message || 'Failed to update exam');
	}
};

/**
 * Delete exam
 */
export const deleteExam = async (examId: string): Promise<void> => {
	try {
		await examAxios.delete(`/exams/${examId}`);
	} catch (error: any) {
		const status = error?.response?.status;
		const serverMessage = error?.response?.data?.message || error?.response?.data?.error || error?.response?.data;
		const msg = serverMessage ? `Failed to delete exam (${status}): ${serverMessage}` : `Failed to delete exam (${status || 'unknown'})`;
		console.error('Error deleting exam:', { status, serverMessage, url: `/exams/${examId}` });
		throw new Error(msg);
	}
};

/**
 * Schedule exam and register students
 */
export const scheduleExam = async (
	examId: string,
	scheduleRequest: ExamScheduleRequest
): Promise<Exam> => {
	try {
		const response = await examAxios.post(`/exams/${examId}/schedule`, scheduleRequest);
		return response.data;
	} catch (error: any) {
		console.error('Error scheduling exam:', error);
		throw new Error(error.response?.data?.message || 'Failed to schedule exam');
	}
};

/**
 * Generate random questions for exam
 */
export const generateExamQuestions = async (
	examId: string,
	request: GenerateQuestionsRequest
): Promise<GeneratedQuestionsResponse> => {
	try {
		const response = await examAxios.post(`/exams/${examId}/generate-questions`, request);
		return response.data;
	} catch (error: any) {
		console.error('Error generating questions:', error);
		throw new Error(error.response?.data?.message || 'Failed to generate questions');
	}
};

/**
 * Get exam schedules (list exams in time window)
 */
export const getExamSchedules = async (
	startDate?: string,
	endDate?: string
): Promise<Exam[]> => {
	try {
		const params: any = {};
		if (startDate) params.start = startDate;
		if (endDate) params.end = endDate;
		
		const response = await examAxios.get('/exams/schedules', { params });
		return response.data;
	} catch (error: any) {
		console.error('Error getting exam schedules:', error);
		throw new Error(error.response?.data?.message || 'Failed to get exam schedules');
	}
};

// ==================== Question Operations ====================

/**
 * Create new question
 */
export const createQuestion = async (request: QuestionCreationRequest): Promise<Question> => {
	try {
		const response = await examAxios.post('/questions', request);
		return response.data;
	} catch (error: any) {
		console.error('Error creating question:', error);
		throw new Error(error.response?.data?.message || 'Failed to create question');
	}
};

/**
 * Delete question
 */
export const deleteQuestion = async (questionId: string): Promise<void> => {
	try {
		await examAxios.delete(`/questions/${questionId}`);
	} catch (error: any) {
		console.error('Error deleting question:', error);
		throw new Error(error.response?.data?.message || 'Failed to delete question');
	}
};

/**
 * Search questions by tags and difficulty
 */
export const searchQuestions = async (request?: QuestionSearchRequest): Promise<Question[]> => {
	try {
		const params: any = {};
		if (request?.tags && request.tags.length > 0) {
			params.tags = request.tags;
		}
		if (request?.minDifficulty !== undefined) {
			params.minDifficulty = request.minDifficulty;
		}
		if (request?.maxDifficulty !== undefined) {
			params.maxDifficulty = request.maxDifficulty;
		}
		
		const response = await examAxios.get('/questions', { params });
		return response.data;
	} catch (error: any) {
		console.error('Error searching questions:', error);
		throw new Error(error.response?.data?.message || 'Failed to search questions');
	}
};

/**
 * Generate random questions (helper endpoint for testing)
 */
export const generateRandomQuestions = async (
	count: number = 10,
	filter?: QuestionSearchRequest
): Promise<GeneratedQuestionsResponse> => {
	try {
		const response = await examAxios.post('/questions/generate', filter, {
			params: { count }
		});
		return response.data;
	} catch (error: any) {
		console.error('Error generating random questions:', error);
		throw new Error(error.response?.data?.message || 'Failed to generate random questions');
	}
};

// ==================== Default Export ====================

const examApi = {
	// Exam operations
	createExam,
	getExamById,
	updateExamConfig,
	updateExam,
	deleteExam,
	scheduleExam,
	generateExamQuestions,
	getExamSchedules,
	
	// Question operations
	createQuestion,
	deleteQuestion,
	searchQuestions,
	generateRandomQuestions,
};

// ✨ Export examAxios instance for direct API calls (used by admin enum endpoints)
export { examAxios };

export default examApi;
