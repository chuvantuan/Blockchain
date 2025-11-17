// Admin User API Service - Re-export from main API
import userApiMain, {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateCurrentUser,
  deleteUser,
  type UserResponse,
  type CreateUserRequest,
  type UpdateUserRequest,
  type PageResponse,
  type ApiResponse,
} from '../../services/api/userApi';

// Re-export functions for admin use
export {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateCurrentUser,
  deleteUser,
};

// Re-export types for admin use
export type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  PageResponse,
  ApiResponse,
};

// Admin User API object
export const adminUserApi = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateCurrentUser,
  deleteUser,
};

export default adminUserApi;

