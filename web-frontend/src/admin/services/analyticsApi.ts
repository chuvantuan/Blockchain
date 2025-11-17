// Analytics API Service
import axios from 'axios';

// Use API Gateway for all requests
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/analytics`;

// Create axios instance with interceptors
const analyticsAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
analyticsAxios.interceptors.request.use(
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
analyticsAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - redirecting to login');
    }
    return Promise.reject(error);
  }
);

// ==================== Types ====================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AnalyticsOverviewResponse {
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalExams: number;
  totalExamSubmissions: number;
  averageScore: number;
}

export interface KpiMetricResponse {
  id: string;
  title: string;
  value: number;
  unit: string;
  changePercentage: number;
  trend: string;
}

export interface ScoreTrendPoint {
  date: string;
  averageScore: number;
  submissionCount: number;
}

export interface TopPerformerResponse {
  userId: string;
  fullName: string;
  averageScore: number;
  attempts: number;
}

export interface TopCourseResponse {
  courseId: string;
  title: string;
  enrollmentCount: number;
  averageScore: number;
}

export interface ExamResultResponse {
  id: number;
  examId: string;
  submissionId: string;
  userId: string;
  score: number;
  createdAt: string;
}

export interface CheatingStatsResponse {
  examId: string;
  totalSubmissions: number;
  suspiciousEventsCount: number;
  eventTypeDistribution: Record<string, number>;
  cheatingRiskScore: number;
}

export interface RecommendationResponse {
  courseId: number;
  courseTitle: string;
  reason: string;
  confidenceScore: number;
}

export interface DashboardResponse {
  userId: string;
  userRole: string;
  generalStats: Record<string, any>;
  recentExamResults: ExamResultResponse[];
  recommendations: RecommendationResponse[];
}

// ==================== API Functions ====================

/**
 * Get analytics overview
 */
export async function getAnalyticsOverview(): Promise<ApiResponse<AnalyticsOverviewResponse>> {
  try {
    const response = await analyticsAxios.get<ApiResponse<AnalyticsOverviewResponse>>('/overview');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching analytics overview:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch analytics overview');
  }
}

/**
 * Get KPI metrics
 */
export async function getKpiMetrics(): Promise<ApiResponse<KpiMetricResponse[]>> {
  try {
    const response = await analyticsAxios.get<ApiResponse<KpiMetricResponse[]>>('/kpis');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching KPI metrics:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch KPI metrics');
  }
}

/**
 * Get score trend data
 */
export async function getScoreTrend(): Promise<ApiResponse<ScoreTrendPoint[]>> {
  try {
    const response = await analyticsAxios.get<ApiResponse<ScoreTrendPoint[]>>('/score-trend');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching score trend:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch score trend');
  }
}

/**
 * Get top performers
 */
export async function getTopPerformers(limit: number = 5): Promise<ApiResponse<TopPerformerResponse[]>> {
  try {
    const response = await analyticsAxios.get<ApiResponse<TopPerformerResponse[]>>('/top-performers', {
      params: { limit },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching top performers:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch top performers');
  }
}

/**
 * Get top courses
 */
export async function getTopCourses(limit: number = 5): Promise<ApiResponse<TopCourseResponse[]>> {
  try {
    const response = await analyticsAxios.get<ApiResponse<TopCourseResponse[]>>('/top-courses', {
      params: { limit },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching top courses:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch top courses');
  }
}

/**
 * Get exam results
 */
export async function getExamResults(
  examId?: string,
  userId?: string
): Promise<ApiResponse<ExamResultResponse[]>> {
  try {
    const params: Record<string, string> = {};
    if (examId) params.examId = examId;
    if (userId) params.userId = userId;

    const response = await analyticsAxios.get<ApiResponse<ExamResultResponse[]>>('/exam-results', {
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching exam results:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch exam results');
  }
}

/**
 * Get cheating statistics
 */
export async function getCheatingStats(examId: string): Promise<ApiResponse<CheatingStatsResponse>> {
  try {
    const response = await analyticsAxios.get<ApiResponse<CheatingStatsResponse>>('/cheating-stats', {
      params: { examId },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching cheating stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch cheating stats');
  }
}

/**
 * Get dashboard data for a user
 */
export async function getDashboardData(userId: string): Promise<ApiResponse<DashboardResponse>> {
  try {
    const response = await analyticsAxios.get<ApiResponse<DashboardResponse>>('/dashboards', {
      params: { userId },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
  }
}

/**
 * Get recommendations for a user
 */
export async function getRecommendations(userId: string): Promise<ApiResponse<RecommendationResponse[]>> {
  try {
    const response = await analyticsAxios.get<ApiResponse<RecommendationResponse[]>>('/recommendations', {
      params: { userId },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch recommendations');
  }
}

// ==================== Admin Analytics API Object ====================

export const adminAnalyticsApi = {
  getAnalyticsOverview,
  getKpiMetrics,
  getScoreTrend,
  getTopPerformers,
  getTopCourses,
  getExamResults,
  getCheatingStats,
  getDashboardData,
  getRecommendations,
};

export default adminAnalyticsApi;

