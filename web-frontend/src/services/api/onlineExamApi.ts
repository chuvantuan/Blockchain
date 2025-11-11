import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_ONLINE_EXAM_API_URL || 'http://localhost:3000';

// Create axios instance with JWT interceptors
const onlineExamAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add JWT token
onlineExamAxios.interceptors.request.use(
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

// Response interceptor to handle errors
onlineExamAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface QuizOption {
  id: string;
  questionId: string;
  content?: string; // Backend uses 'content'
  optionText?: string; // Legacy field name
  isCorrect: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  content: string;
  type: 'multiple-choice' | 'true-false' | 'essay' | 'short-answer';
  displayOrder: number;
  explanation?: string; // NEW: Explanation for the correct answer
  points?: number; // NEW: Points for this question
  options?: QuizOption[];
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  createdAt: string;
  // NEW metadata fields
  difficulty?: 'easy' | 'medium' | 'hard';
  subject?: string;
  isProctored?: boolean;
  instructions?: string[]; // JSON array
  questions?: Question[];
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  studentId: number;
  score: number | null;
  submittedAt: string | null;
  answers: string | null; // JSON string
  status?: 'in-progress' | 'submitted';
  // NEW tracking fields
  startedAt?: string | null;
  timeSpentSeconds?: number | null;
  correctAnswers?: number | null;
  wrongAnswers?: number | null;
  totalQuestions?: number | null;
}

export interface SubmitAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface SubmitQuizRequest {
  answers: SubmitAnswer[];
}

export interface StartQuizResponse {
  success: boolean;
  message: string;
  data: {
    submissionId: string;
    quizDetails: Quiz;
  };
}

export interface SubmitQuizResponse {
  success: boolean;
  message: string;
  data: {
    submissionId: string;
    score: number;
    message: string;
  };
}

// ============================================================================
// STUDENT QUIZ API
// ============================================================================

/**
 * Start a quiz session for a student
 * POST /api/quizzes/:quizId/start
 */
export const startQuiz = async (quizId: string): Promise<StartQuizResponse> => {
  const response = await onlineExamAxios.post<StartQuizResponse>(
    `/api/quizzes/${quizId}/start`
  );
  return response.data;
};

/**
 * Submit quiz answers
 * POST /api/submissions/:submissionId/submit
 */
export const submitQuiz = async (
  submissionId: string,
  request: SubmitQuizRequest
): Promise<SubmitQuizResponse> => {
  const response = await onlineExamAxios.post<SubmitQuizResponse>(
    `/api/submissions/${submissionId}/submit`,
    request
  );
  return response.data;
};

/**
 * Get quiz details (without starting session)
 * GET /api/quizzes/:quizId
 */
export const getQuizDetails = async (quizId: string): Promise<Quiz> => {
  const response = await onlineExamAxios.get<{ success: boolean; data: Quiz }>(
    `/api/quizzes/${quizId}`
  );
  return response.data.data;
};

/**
 * Get student's quiz submission status
 * GET /api/submissions/:submissionId
 */
export const getSubmissionStatus = async (
  submissionId: string
): Promise<QuizSubmission> => {
  const response = await onlineExamAxios.get<{ success: boolean; data: QuizSubmission }>(
    `/api/submissions/${submissionId}`
  );
  return response.data.data;
};

/**
 * Get student's quiz results
 * GET /api/submissions/:submissionId/result
 */
export const getQuizResult = async (
  submissionId: string
): Promise<{
  submissionId: string;
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  passed: boolean;
  submittedAt: string;
  timeSpentSeconds?: number | null;
  // NEW ranking fields
  percentile?: number | null;
  rank?: number | null;
  totalSubmissions?: number | null;
  questionResults?: any[]; // Detailed question results
}> => {
  const response = await onlineExamAxios.get(
    `/api/submissions/${submissionId}/result`
  );
  return response.data.data;
};

// ============================================================================
// COURSE QUIZ API (List quizzes in a course)
// ============================================================================

/**
 * Get all quizzes in a course
 * GET /api/courses/:courseId/quizzes
 */
export const getCourseQuizzes = async (courseId: string): Promise<Quiz[]> => {
  const response = await onlineExamAxios.get<{ success: boolean; data: Quiz[] }>(
    `/api/courses/${courseId}/quizzes`
  );
  return response.data.data;
};

/**
 * Get student's quiz submissions for a course
 * GET /api/courses/:courseId/my-submissions
 */
export const getMyCourseSubmissions = async (
  courseId: string
): Promise<QuizSubmission[]> => {
  const response = await onlineExamAxios.get<{ success: boolean; data: QuizSubmission[] }>(
    `/api/courses/${courseId}/my-submissions`
  );
  return response.data.data;
};

// ============================================================================
// ALL QUIZZES API (For user exam list page)
// ============================================================================

/**
 * Get all available quizzes (for exam list page)
 * Note: Backend might need to implement this endpoint
 * For now, we can get quizzes from all courses or a specific endpoint
 */
export const getAllQuizzes = async (): Promise<Quiz[]> => {
  // This might need backend implementation
  // For now, return empty array or implement based on backend structure
  try {
    const response = await onlineExamAxios.get<{ success: boolean; data: Quiz[] }>(
      `/api/quizzes`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching all quizzes:', error);
    return [];
  }
};

/**
 * Get student's all quiz submissions
 * GET /api/my-submissions
 */
export const getMyAllSubmissions = async (): Promise<QuizSubmission[]> => {
  try {
    const response = await onlineExamAxios.get<{ success: boolean; data: QuizSubmission[] }>(
      `/api/my-submissions`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching my submissions:', error);
    return [];
  }
};

// ============================================================================
// EXAM SERVICE OBJECT (similar to examApi)
// ============================================================================

const onlineExamApi = {
  // Student quiz operations
  startQuiz,
  submitQuiz,
  getQuizDetails,
  getSubmissionStatus,
  getQuizResult,
  
  // Course quiz operations
  getCourseQuizzes,
  getMyCourseSubmissions,
  
  // All quizzes operations (for exam list page)
  getAllQuizzes,
  getMyAllSubmissions,
};

export default onlineExamApi;

