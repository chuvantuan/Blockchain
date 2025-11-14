import axios from 'axios';
import { IDENTITY_API } from '../../config/api';

// Identity auth base (supports gateway or direct service)
const API_BASE_URL = `${IDENTITY_API}/auth`;

// Interface cho credentials (backend expects usernameOrEmail và password)
interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

interface RegisterCredentials {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
}

export type { RegisterCredentials }

// Function login
export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      usernameOrEmail: credentials.usernameOrEmail,
      password: credentials.password
    });
    return response.data; // Giả sử response có { success: true, user: {...} } hoặc token
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Function register
export const register = async (credentials: RegisterCredentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, credentials);
    return response.data; // Giả sử response có { success: true, message: 'Registered' }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};
