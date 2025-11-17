// User API Service
import axios from 'axios';

// Use API Gateway for all requests
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/identity/api/v1`;

// Create axios instance with interceptors
const userAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
userAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('[userApi] Request interceptor - Token exists:', !!token);
    console.log('[userApi] Request URL:', config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[userApi] Authorization header set');
    } else {
      console.warn('[userApi] No access token found in localStorage');
      console.warn('[userApi] Available localStorage keys:', Object.keys(localStorage));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
userAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('[userApi] Unauthorized access (401)');
      console.error('[userApi] Request URL:', error.config?.url);
      console.error('[userApi] Request headers:', error.config?.headers);
      console.error('[userApi] Token in localStorage:', !!localStorage.getItem('accessToken'));
      console.error('[userApi] Error response:', error.response?.data);
      
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Redirect to login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/auth') {
        console.log('[userApi] Redirecting to login page');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== Types ====================

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  roles: string[];
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  enabled?: boolean;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  roleNames?: string[];
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  enabled?: boolean;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  roleNames?: string[];
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

// ==================== User Operations ====================

/**
 * Get all users with pagination
 */
export const getUsers = async (
  page = 0,
  size = 10,
  sort?: string
): Promise<ApiResponse<PageResponse<UserResponse>>> => {
  try {
    const params: any = { page, size };
    if (sort) {
      params.sort = sort;
    }
    const response = await userAxios.get('/users', { params });
    return response.data;
  } catch (error: any) {
    console.error('Error getting users:', error);
    throw new Error(error.response?.data?.message || 'Failed to get users');
  }
};

/**
 * Get all users without pagination (for dropdowns, etc.)
 * Fetches with a large page size to get all users
 */
export const getAllUsers = async (): Promise<UserResponse[]> => {
  try {
    // Fetch with a large page size to get all users
    const response = await userAxios.get('/users', { 
      params: { 
        page: 0, 
        size: 1000 // Large size to get all users
      } 
    });
    const apiResponse: ApiResponse<PageResponse<UserResponse>> = response.data;
    
    // Extract users from the paginated response
    if (apiResponse.data?.content) {
      return apiResponse.data.content;
    }
    
    // Fallback: if response structure is different
    if (Array.isArray(apiResponse.data)) {
      return apiResponse.data;
    }
    
    return [];
  } catch (error: any) {
    console.error('Error getting all users:', error);
    throw new Error(error.response?.data?.message || 'Failed to get all users');
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (id: number): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await userAxios.get(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting user:', error);
    throw new Error(error.response?.data?.message || 'Failed to get user');
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await userAxios.get('/users/me');
    return response.data;
  } catch (error: any) {
    console.error('Error getting current user:', error);
    throw new Error(error.response?.data?.message || 'Failed to get current user');
  }
};

/**
 * Convert camelCase object to snake_case for backend compatibility
 * Backend Jackson is configured with SNAKE_CASE strategy which may affect deserialization
 */
function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (typeof obj !== 'object') return obj;
  
  const snakeObj: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      snakeObj[snakeKey] = toSnakeCase(obj[key]);
    }
  }
  return snakeObj;
}

/**
 * Create new user
 */
export const createUser = async (userData: CreateUserRequest): Promise<ApiResponse<UserResponse>> => {
  try {
    // Log request payload for debugging
    console.log('Creating user with payload (camelCase):', JSON.stringify(userData, null, 2));
    console.log('firstName:', userData.firstName, 'type:', typeof userData.firstName);
    console.log('lastName:', userData.lastName, 'type:', typeof userData.lastName);
    
    // Convert to snake_case for backend (Jackson is configured with SNAKE_CASE strategy)
    // The SNAKE_CASE strategy may affect deserialization, so we send snake_case
    const snakeCaseData = toSnakeCase(userData);
    console.log('Creating user with payload (snake_case):', JSON.stringify(snakeCaseData, null, 2));
    console.log('first_name:', snakeCaseData.first_name, 'last_name:', snakeCaseData.last_name);
    
    const response = await userAxios.post('/users', snakeCaseData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating user:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error response data (stringified):', JSON.stringify(error.response?.data, null, 2));
    console.error('Error response status:', error.response?.status);
    console.error('Error response headers:', error.response?.headers);
    console.error('Request config:', error.config);
    
    // Extract validation error message
    let errorMessage = 'Failed to create user';
    const errorDetails: string[] = [];
    
    if (error.response?.data) {
      const data = error.response.data;
      
      // Handle format: { success: false, message: "...", error: { field: "message" } }
      if (data.error && typeof data.error === 'object' && !Array.isArray(data.error)) {
        Object.keys(data.error).forEach(field => {
          if (typeof data.error[field] === 'string') {
            errorDetails.push(`${field}: ${data.error[field]}`);
          }
        });
      }
      // Handle ApiResponse format with data.fieldErrors
      else if (data.data?.fieldErrors) {
        const fieldErrors = data.data.fieldErrors;
        Object.keys(fieldErrors).forEach(field => {
          errorDetails.push(`${field}: ${fieldErrors[field]}`);
        });
      }
      // Handle ApiResponse format with data as object (direct field errors)
      else if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
        Object.keys(data.data).forEach(field => {
          if (typeof data.data[field] === 'string') {
            errorDetails.push(`${field}: ${data.data[field]}`);
          }
        });
      }
      // Handle errors array format
      else if (data.errors && Array.isArray(data.errors)) {
        errorDetails.push(...data.errors.map((e: any) => e.defaultMessage || e.message || String(e)));
      }
      // Handle violations format
      else if (data.data?.violations) {
        const violations = data.data.violations;
        Object.keys(violations).forEach(field => {
          errorDetails.push(`${field}: ${violations[field]}`);
        });
      }
      
      // Get main message
      if (data.message) {
        errorMessage = data.message;
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
      
      // Combine message with details
      if (errorDetails.length > 0) {
        errorMessage = `${errorMessage}: ${errorDetails.join('; ')}`;
      }
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Update user by ID
 */
export const updateUser = async (
  id: number,
  userData: UpdateUserRequest
): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await userAxios.put(`/users/${id}`, userData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

/**
 * Update current user profile
 */
export const updateCurrentUser = async (
  userData: UpdateUserRequest
): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await userAxios.put('/users/me', userData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating current user:', error);
    throw new Error(error.response?.data?.message || 'Failed to update current user');
  }
};

/**
 * Delete user by ID
 */
export const deleteUser = async (id: number): Promise<ApiResponse<void>> => {
  try {
    const response = await userAxios.delete(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

// Export default API object
const userApi = {
  getUsers,
  getAllUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateCurrentUser,
  deleteUser,
};

export default userApi;

