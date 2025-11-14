// Token Reward API Service
import axios from 'axios';

// Call directly to token-reward-service 
// Port 3000 for local development (npm run dev)
// Port 9009 for Docker deployment
import { TOKEN_REWARD_API } from '../../config/api';

const API_BASE_URL = import.meta.env.VITE_TOKEN_REWARD_API_URL ? `${import.meta.env.VITE_TOKEN_REWARD_API_URL}/api/tokens` : TOKEN_REWARD_API || 'http://localhost:9009/api/tokens';

// Create axios instance with JWT interceptors
const tokenRewardAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add JWT token
tokenRewardAxios.interceptors.request.use(
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
tokenRewardAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const errorMessage = error.response?.data?.message || 'Unauthorized: No token provided';
      console.error('Token error:', errorMessage);
      // Don't redirect automatically, let the component handle it
    }
    if (error.response?.status === 403) {
      // Forbidden - usually means invalid token or missing permissions
      const errorMessage = error.response?.data?.message || 'Forbidden: Invalid token';
      console.error('Forbidden error:', errorMessage);
    }
    return Promise.reject(error);
  }
);

// ==================== Types ====================

export interface GrantTokenRequest {
  studentId: number | string;
  amount: number;
  reasonCode?: string;
  relatedId?: number | string;
}

export interface SpendTokenRequest {
  studentId: number | string;
  amount: number;
  reasonCode?: string;
  relatedId?: number | string;
}

export interface WithdrawTokenRequest {
  studentId: number | string;
  amount: number;
  toAddress: string;
}

export interface BalanceResponse {
  balance: number;
  totalEarned?: number;
  totalSpent?: number;
}

export interface Transaction {
  id: number | string;
  studentId: number | string;
  amount: number;
  type: 'grant' | 'spend' | 'withdraw';
  reasonCode?: string;
  relatedId?: number | string;
  createdAt: string;
  updatedAt?: string;
}

export interface HistoryResponse {
  transactions: Transaction[];
  total: number;
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  page: number;
  limit: number;
  rewards?: any[];
}

export interface WithdrawResponse {
  transactionHash?: string;
  message: string;
  success: boolean;
}

// ==================== Token Operations ====================

/**
 * Grant tokens to a user
 */
export const grantTokens = async (request: GrantTokenRequest): Promise<Transaction> => {
  try {
    const response = await tokenRewardAxios.post(`/grant`, request);
    return response.data;
  } catch (error: any) {
    console.error('Error granting tokens:', error);
    throw new Error(error.response?.data?.message || 'Failed to grant tokens');
  }
};

/**
 * Spend tokens from user balance
 */
export const spendTokens = async (request: SpendTokenRequest): Promise<Transaction> => {
  try {
    const response = await tokenRewardAxios.post(`/spend`, request);
    return response.data;
  } catch (error: any) {
    console.error('Error spending tokens:', error);
    if (error.response?.status === 400 && error.response?.data?.message === 'Insufficient funds.') {
      throw new Error('Insufficient funds.');
    }
    throw new Error(error.response?.data?.message || 'Failed to spend tokens');
  }
};

/**
 * Withdraw tokens to blockchain address
 */
export const withdrawTokens = async (request: WithdrawTokenRequest): Promise<WithdrawResponse> => {
  try {
    const response = await tokenRewardAxios.post(`/withdraw`, request);
    return response.data;
  } catch (error: any) {
    console.error('Error withdrawing tokens:', error);
    const message = error.response?.data?.message || 'Failed to withdraw tokens';
    if (message.includes('Insufficient funds')) {
      throw new Error('Insufficient funds.');
    }
    throw new Error(message);
  }
};

// ==================== Balance & History ====================

/**
 * Get user token balance
 */
export const getBalance = async (studentId: number | string): Promise<BalanceResponse> => {
  try {
    const response = await tokenRewardAxios.get(`/balance/${studentId}`);
    // Backend may return { tokenBalance } instead of { balance }
    const data = response.data || {};
    return {
      balance: data.balance ?? data.tokenBalance ?? 0,
      totalEarned: data.totalEarned,
      totalSpent: data.totalSpent,
    };
  } catch (error: any) {
    console.error('Error getting balance:', error);
    if (error.response?.status === 404) {
      throw new Error('User not found.');
    }
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: No token provided');
    }
    if (error.response?.status === 403) {
      throw new Error('Forbidden: Invalid token. Please log in again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to get balance');
  }
};

/**
 * Get user transaction history
 */
export const getHistory = async (
  studentId: number | string,
  page: number = 1,
  limit: number = 10
): Promise<HistoryResponse> => {
  try {
    const response = await tokenRewardAxios.get(`/history/${studentId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting history:', error);
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: No token provided');
    }
    if (error.response?.status === 403) {
      throw new Error('Forbidden: Invalid token. Please log in again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to get history');
  }
};

// ==================== Default Export ====================

const tokenRewardApi = {
  // Token Operations
  grantTokens,
  spendTokens,
  withdrawTokens,
  
  // Balance & History
  getBalance,
  getHistory,
};

export default tokenRewardApi;

