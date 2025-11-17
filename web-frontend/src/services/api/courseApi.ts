// Course API Service
import axios from 'axios';

// Use API Gateway for all requests
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1`;

// Create axios instance with interceptors
const courseAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
courseAxios.interceptors.request.use(
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
courseAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
      // Optionally redirect to login page
      // window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// ==================== Types ====================

export interface CourseCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Instructor {
  id: string;
  name: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  videoUrl?: string;
  contentUrl?: string;
}

export type CourseVisibility = 'draft' | 'published' | 'archived' | 'suspended' | 'private';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string;
  visibility: CourseVisibility;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface CreateCourseRequest {
  id: string;
  title: string;
  organizationId: string;
  description: string;
  thumbnailUrl?: string;
  visibility: CourseVisibility;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  visibility?: CourseVisibility;
}

export interface Material {
  id: string;
  title: string;
  type: string;
  storageKey?: string;
  content?: string;
  displayOrder?: number;
  order?: number;
  createdAt?: string;
  videoUrl?: string;
  contentUrl?: string;
  description?: string;
  duration?: number;
}

export interface CreateMaterialRequest {
  title: string;
  type: string;
  storageKey?: string;
  content?: string;
  displayOrder?: number;
}

export interface UpdateMaterialRequest {
  title?: string;
  type?: string;
  storageKey?: string;
  content?: string;
  displayOrder?: number;
}

export interface QuizOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  content: string;
  type: string;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  createdAt?: string;
  questions: QuizQuestion[];
}

export interface SubmitQuizRequest {
  studentId: number;
  answers: Record<string, string[]>;
}

export interface CreateQuizOption {
  content: string;
  isCorrect?: boolean;
}

export interface CreateQuizQuestion {
  content: string;
  type: string;
  options?: CreateQuizOption[];
  displayOrder?: number;
}

export interface CreateQuizRequest {
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  questions: CreateQuizQuestion[];
}

export interface UpdateQuizRequest extends Partial<CreateQuizRequest> {}

export interface QuizResult {
  id: string;
  studentId: number;
  quizId: string;
  score: number;
  submittedAt: string;
  answers?: unknown;
}

export interface Progress {
  id: number;
  studentId: number;
  courseId: string;
  percentComplete: number;
  lastMaterialId?: string;
  updatedAt: string;
  progressPercentage?: number;
  completedMaterials?: string[];
  lastAccessedAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: unknown;
}

export interface Reward {
  id: number | string;
  studentId: number | string;
  tokensAwarded: number;
  reasonCode: string;
  relatedId?: string | number;
  awardedAt: string;
}

export interface GrantRewardRequest {
  studentId: number;
  tokens: number;
  reason: string;
  relatedId?: string;
}

// ==================== Course Operations ====================

/**
 * Get all courses with pagination
 */
export const getAllCourses = async (page = 0, size = 10): Promise<ApiResponse<PageResponse<Course>>> => {
  try {
    const response = await courseAxios.get('/courses', {
      params: { page, size }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting all courses:', error);
    throw new Error(error.response?.data?.message || 'Failed to get courses');
  }
};

/**
 * Get course by ID
 */
export const getCourseById = async (courseId: string): Promise<ApiResponse<Course>> => {
  try {
    const response = await courseAxios.get(`/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting course:', error);
    throw new Error(error.response?.data?.message || 'Failed to get course');
  }
};

/**
 * Create new course
 */
export const createCourse = async (courseData: CreateCourseRequest): Promise<ApiResponse<Course>> => {
  try {
    const response = await courseAxios.post('/courses', courseData);
    return response.data;
  } catch (error: any) {
    const server = error?.response?.data;
    let details: string | undefined;
    const errorsArray = (server?.errors || server?.error || server) as any;
    if (Array.isArray(errorsArray)) {
      details = errorsArray.map((e: any) => e?.defaultMessage || e?.message || String(e)).join('; ');
    } else if (typeof errorsArray === 'object' && errorsArray) {
      details = errorsArray.message || errorsArray.error || errorsArray.detail;
    }
    const msg = server?.message || details || 'Failed to create course';
    console.error('Error creating course:', { server, msg });
    throw new Error(msg);
  }
};

/**
 * Update course
 */
export const updateCourse = async (courseId: string, courseData: UpdateCourseRequest): Promise<ApiResponse<Course>> => {
  try {
    const response = await courseAxios.put(`/courses/${courseId}`, courseData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating course:', error);
    throw new Error(error.response?.data?.message || 'Failed to update course');
  }
};

/**
 * Delete course
 */
export const deleteCourse = async (
  courseId: string,
  options?: { force?: boolean }
): Promise<ApiResponse<void>> => {
  try {
    const response = await courseAxios.delete(`/courses/${courseId}`),
      // If backend supports force flag via query param, use this instead:
      // await courseAxios.delete(`/courses/${courseId}`,{ params: options?.force ? { force: true } : undefined });
      data = response.data
    return data
  } catch (error: any) {
    const status = error?.response?.status
    const serverMessage = error?.response?.data?.message || error?.response?.data?.error || error?.response?.data
    const msg = serverMessage ? `Failed to delete course (${status}): ${serverMessage}` : `Failed to delete course (${status || 'unknown'})`
    console.error('Error deleting course:', { status, serverMessage, url: `/courses/${courseId}` })
    throw new Error(msg)
  }
};

/**
 * Publish course (sets course to published state)
 */
export const publishCourse = async (courseId: string): Promise<ApiResponse<Course>> => {
  try {
    const response = await courseAxios.put(`/courses/${courseId}/publish`);
    return response.data;
  } catch (error: any) {
    console.error('Error publishing course:', error);
    throw new Error(error.response?.data?.message || 'Failed to publish course');
  }
};

/**
 * Get course roster (members)
 */
export const getCourseRoster = async (
  courseId: string
): Promise<ApiResponse<Array<{ userId: number; role: string }>>> => {
  try {
    const response = await courseAxios.get(`/courses/${courseId}/roster`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting course roster:', error);
    throw new Error(error.response?.data?.message || 'Failed to get course roster');
  }
};

/**
 * Upload course image (thumbnail or gallery)
 */
export const uploadCourseImage = async (
  courseId: string,
  file: File
): Promise<ApiResponse<{ id?: string; url?: string; imageUrl?: string }>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await courseAxios.post(`/courses/${courseId}/images/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error uploading course image:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload course image');
  }
};

// ==================== Material Operations ====================

/**
 * Get all materials for a course
 */
export const getCourseMaterials = async (courseId: string): Promise<ApiResponse<Material[]>> => {
  try {
    const response = await courseAxios.get(`/courses/${courseId}/materials`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting materials:', error);
    throw new Error(error.response?.data?.message || 'Failed to get materials');
  }
};

/**
 * Add material to course
 */
export const addMaterialToCourse = async (courseId: string, materialData: CreateMaterialRequest): Promise<ApiResponse<Material>> => {
  try {
    const response = await courseAxios.post(`/courses/${courseId}/materials`, materialData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding material:', error);
    throw new Error(error.response?.data?.message || 'Failed to add material');
  }
};

/**
 * Update material
 */
export const updateMaterial = async (materialId: string, materialData: UpdateMaterialRequest): Promise<ApiResponse<Material>> => {
  try {
    // Note: Backend may not have this endpoint yet
    const response = await courseAxios.put(`/materials/${materialId}`, materialData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating material:', error);
    throw new Error(error.response?.data?.message || 'Failed to update material');
  }
};

/**
 * Delete material
 */
export const deleteMaterial = async (materialId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await courseAxios.delete(`/materials/${materialId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting material:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete material');
  }
};

/**
 * Upload material file and return a storageKey/url
 */
export const uploadMaterialFile = async (
  courseId: string,
  file: File
): Promise<ApiResponse<{ storageKey: string; url?: string; filename?: string }>> => {
  try {
    const form = new FormData();
    form.append('file', file);
    const response = await courseAxios.post(`/courses/${courseId}/materials/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error uploading material:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload material');
  }
};

// ==================== Quiz Operations ====================

/**
 * Get quiz details
 */
export const getQuizDetails = async (quizId: string): Promise<ApiResponse<Quiz>> => {
  try {
    const response = await courseAxios.get(`/quizzes/${quizId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting quiz:', error);
    throw new Error(error.response?.data?.message || 'Failed to get quiz');
  }
};

/**
 * Admin: Create quiz for a course
 */
export const createQuiz = async (courseId: string, data: CreateQuizRequest): Promise<ApiResponse<any>> => {
  try {
    const response = await courseAxios.post(`/courses/${courseId}/quizzes`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating quiz:', error);
    throw new Error(error.response?.data?.message || 'Failed to create quiz');
  }
};

/**
 * Admin: Get quizzes of a course
 */
export const getCourseQuizzes = async (courseId: string): Promise<ApiResponse<any[]>> => {
  try {
    const response = await courseAxios.get(`/courses/${courseId}/quizzes`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching quizzes:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch quizzes');
  }
};

/**
 * Admin: Update quiz
 */
export const updateQuiz = async (quizId: string, data: UpdateQuizRequest): Promise<ApiResponse<any>> => {
  try {
    const response = await courseAxios.put(`/quizzes/${quizId}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating quiz:', error);
    throw new Error(error.response?.data?.message || 'Failed to update quiz');
  }
};

/**
 * Admin: Delete quiz
 */
export const deleteQuiz = async (quizId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await courseAxios.delete(`/quizzes/${quizId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting quiz:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete quiz');
  }
};

/**
 * Submit quiz
 */
export const submitQuiz = async (quizId: string, submission: SubmitQuizRequest): Promise<ApiResponse<QuizResult>> => {
  try {
    const response = await courseAxios.post(`/quizzes/${quizId}/submit`, submission);
    return response.data;
  } catch (error: any) {
    console.error('Error submitting quiz:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit quiz');
  }
};

// ==================== Progress Operations ====================

/**
 * Update student progress
 */
export const updateProgress = async (
  studentId: number,
  courseId: string,
  materialId: string
): Promise<ApiResponse<Progress>> => {
  try {
    const response = await courseAxios.post(
      `/progress/student/${studentId}/course/${courseId}/material/${materialId}`
    );
    return response.data;
  } catch (error: any) {
    console.error('Error updating progress:', error);
    throw new Error(error.response?.data?.message || 'Failed to update progress');
  }
};

/**
 * Get student progress in course
 */
export const getStudentProgress = async (studentId: number, courseId: string): Promise<ApiResponse<Progress>> => {
  try {
    const response = await courseAxios.get(
      `/progress/student/${studentId}/course/${courseId}`
    );
    return response.data;
  } catch (error: any) {
    // Trả về tiến độ mặc định khi backend chưa có bản ghi hoặc tạm thời lỗi
    const status = error?.response?.status;
    if (status === 404 || status === 500) {
      return {
        success: true,
        message: 'No progress yet',
        data: {
          id: 0,
          studentId,
          courseId,
          percentComplete: 0,
          lastMaterialId: undefined,
          updatedAt: new Date().toISOString(),
        },
      };
    }
    console.error('Error getting progress:', error);
    throw new Error(error.response?.data?.message || 'Failed to get progress');
  }
};

/**
 * Get course progress dashboard (for instructors/admin)
 */
export const getCourseProgressDashboard = async (courseId: string): Promise<ApiResponse<Progress[]>> => {
  try {
    const response = await courseAxios.get(`/courses/${courseId}/progress`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting progress dashboard:', error);
    throw new Error(error.response?.data?.message || 'Failed to get progress dashboard');
  }
};

// ==================== Reward Operations ====================

/**
 * Get student rewards
 */
export const getStudentRewards = async (studentId: number): Promise<ApiResponse<Reward[]>> => {
  try {
    const response = await courseAxios.get(`/rewards/student/${studentId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting student rewards:', error);
    throw new Error(error.response?.data?.message || 'Failed to get student rewards');
  }
};

/**
 * Grant reward to student
 * Note: This may not be available as a public API endpoint.
 * Rewards are typically granted internally by the system.
 */
export const grantReward = async (rewardData: GrantRewardRequest): Promise<ApiResponse<Reward>> => {
  try {
    // Note: Backend may not have this endpoint yet - rewards are typically granted internally
    const response = await courseAxios.post('/rewards/grant', rewardData);
    return response.data;
  } catch (error: any) {
    console.error('Error granting reward:', error);
    throw new Error(error.response?.data?.message || 'Failed to grant reward');
  }
};

// ==================== Default Export ====================

const courseApi = {
  // Course operations
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  getCourseRoster,
  uploadCourseImage,
  
  // Material operations
  getCourseMaterials,
  addMaterialToCourse,
  updateMaterial,
  deleteMaterial,
  
  // Quiz operations
  getQuizDetails,
  createQuiz,
  getCourseQuizzes,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  
  // Progress operations
  updateProgress,
  getStudentProgress,
  getCourseProgressDashboard,
  
  // Reward operations
  getStudentRewards,
  grantReward,
  
  // Material file
  uploadMaterialFile,
};

export default courseApi;

