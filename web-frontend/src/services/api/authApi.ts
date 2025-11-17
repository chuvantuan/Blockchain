import axios from 'axios';

// Base URL cho API - use relative path for Vite proxy
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/identity/api/v1/auth`;
const IDENTITY_API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/identity/api/v1`;

// Interface cho login
interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

// Interface cho register
interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export type { RegisterCredentials };

// -----------------------------
// LOGIN
// -----------------------------
export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      usernameOrEmail: credentials.usernameOrEmail,
      password: credentials.password
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// -----------------------------
// REGISTER
// -----------------------------
export const register = async (credentials: RegisterCredentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// -----------------------------
// CHANGE PASSWORD
// -----------------------------
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async (request: ChangePasswordRequest) => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await axios.post(
      `${IDENTITY_API_BASE_URL}/users/change-password`,
      {
        currentPassword: request.currentPassword,
        newPassword: request.newPassword
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Failed to change password'
    );
  }
};

// -----------------------------
// GET USER PROFILE
// -----------------------------
export const getUserProfile = async (token: string) => {
  try {
    const response = await axios.get(
      `${IDENTITY_API_BASE_URL}/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data && response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch user profile');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};

// -----------------------------
// GOOGLE OAUTH LOGIN
// -----------------------------
export const initiateGoogleLogin = () => {
  // Redirect to backend OAuth endpoint
  const googleAuthUrl = `${import.meta.env.VITE_API_BASE_URL || ''}/identity/oauth2/authorization/google`;
  window.location.href = googleAuthUrl;
};

// Handle OAuth callback
export const handleOAuthCallback = async (code: string, state?: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/oauth2/callback`,
      {
        params: {
          code,
          ...(state && { state })
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'OAuth authentication failed');
  }
};
