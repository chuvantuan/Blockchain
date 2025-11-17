// Token Reward API Service
import axios from 'axios';

// Use API Gateway for all requests
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/tokens`;
const DEFAULT_COURSE_COMPLETION_REWARD = Number(
  import.meta.env.VITE_COURSE_COMPLETION_REWARD ?? 100
);

const toNumber = (value: unknown, fallback = 0): number => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === 'bigint') {
    try {
      return Number(value);
    } catch {
      return fallback;
    }
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  return fallback;
};

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
  tokenBalance?: number;
  availableBalance?: number;
  lifetimeEarned?: number;
  lifetimeSpent?: number;
  netEarned?: number;
  lastTransactionAt?: string | null;
}

export interface Transaction {
  id?: number | string;
  studentId?: number | string;
  amount?: number;
  tokensAwarded?: number;
  reasonCode?: string;
  relatedId?: number | string;
  transactionType?: 'EARN' | 'SPEND' | 'WITHDRAW';
  transaction_type?: 'EARN' | 'SPEND' | 'WITHDRAW';
  type?: 'grant' | 'spend' | 'withdraw';
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  awardedAt?: string;
  [key: string]: any;
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

export interface LinkedWalletResponse {
  id: string;
  userId: number | string;
  address: string;
  status: string;
  linkedAt: string;
  lastSeenAt?: string;
  signature?: string | null;
}

// ==================== Token Operations ====================

/**
 * Grant tokens to a user
 */
export const grantTokens = async (request: GrantTokenRequest): Promise<Transaction> => {
  try {
    const response = await tokenRewardAxios.post(`/grant`, request);
    const reward = response.data ?? {};
    const amount = Number(reward.amount ?? reward.tokensAwarded ?? request.amount ?? 0);
    const integerAmount = Number.isFinite(amount) ? amount : Number(request.amount ?? 0) || 0;
    const transactionTypeRaw = reward.transaction_type ?? reward.transactionType ?? reward.type ?? 'EARN';
    const normalizedType = typeof transactionTypeRaw === 'string' ? transactionTypeRaw.toLowerCase() : 'earn';

    return {
      ...reward,
      amount: integerAmount,
      tokensAwarded: reward.tokensAwarded ?? integerAmount,
      reasonCode: reward.reasonCode ?? request.reasonCode,
      relatedId: reward.relatedId ?? request.relatedId,
      transaction_type: typeof transactionTypeRaw === 'string' ? transactionTypeRaw.toUpperCase() : 'EARN',
      transactionType: typeof transactionTypeRaw === 'string' ? transactionTypeRaw.toUpperCase() : 'EARN',
      type:
        normalizedType === 'spend'
          ? 'spend'
          : normalizedType === 'withdraw'
          ? 'withdraw'
          : 'grant',
    };
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
    const reward = response.data ?? {};
    const amount = Number(reward.amount ?? reward.tokensAwarded ?? request.amount ?? 0);
    const integerAmount = Number.isFinite(amount) ? amount : Number(request.amount ?? 0) || 0;
    const transactionTypeRaw = reward.transaction_type ?? reward.transactionType ?? reward.type ?? 'SPEND';
    const normalizedType = typeof transactionTypeRaw === 'string' ? transactionTypeRaw.toLowerCase() : 'spend';

    return {
      ...reward,
      amount: integerAmount,
      tokensAwarded: reward.tokensAwarded ?? integerAmount,
      reasonCode: reward.reasonCode ?? request.reasonCode,
      relatedId: reward.relatedId ?? request.relatedId,
      transaction_type: typeof transactionTypeRaw === 'string' ? transactionTypeRaw.toUpperCase() : 'SPEND',
      transactionType: typeof transactionTypeRaw === 'string' ? transactionTypeRaw.toUpperCase() : 'SPEND',
      type:
        normalizedType === 'withdraw'
          ? 'withdraw'
          : 'spend',
    };
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

/**
 * Get linked wallet for current user
 */
export const getLinkedWallet = async (): Promise<LinkedWalletResponse | null> => {
  try {
    const response = await tokenRewardAxios.get(`/wallets/me`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch linked wallet');
  }
};

/**
 * Link wallet address to current user
 */
export const linkWallet = async (address: string, signature?: string): Promise<LinkedWalletResponse> => {
  try {
    const response = await tokenRewardAxios.post(`/wallets/link`, { address, signature });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to link wallet');
  }
};

/**
 * Unlink current wallet
 */
export const unlinkWallet = async (): Promise<void> => {
  try {
    await tokenRewardAxios.delete(`/wallets/me`);
  } catch (error: any) {
    if (error.response?.status === 404) {
      return;
    }
    throw new Error(error.response?.data?.message || 'Failed to unlink wallet');
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
    const balanceValue = toNumber(data.balance ?? data.tokenBalance, 0);
    const totalEarned = toNumber(
      data.totalEarned ?? data.lifetimeEarned ?? data?.metrics?.totalEarned,
      balanceValue
    );
    const totalSpent = toNumber(
      data.totalSpent ?? data.lifetimeSpent ?? data?.metrics?.totalSpent,
      0
    );
    const netEarned = toNumber(
      data.netEarned ?? data?.metrics?.netEarned ?? totalEarned - totalSpent,
      totalEarned - totalSpent
    );
    const availableBalance = toNumber(data.availableBalance ?? balanceValue, balanceValue);

    return {
      balance: balanceValue,
      tokenBalance: balanceValue,
      availableBalance,
      totalEarned,
      lifetimeEarned: totalEarned,
      totalSpent,
      lifetimeSpent: totalSpent,
      netEarned,
      lastTransactionAt: data.lastTransactionAt ?? data.updatedAt ?? null
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

export interface CourseCompletionRewardRequest {
  studentId: number | string;
  courseId: string | number;
  amount?: number;
  reasonCode?: string;
}

export const grantCourseCompletionTokens = async ({
  studentId,
  courseId,
  amount,
  reasonCode = 'COMPLETE_COURSE'
}: CourseCompletionRewardRequest): Promise<Transaction> => {
  const rewardAmount = Number.isFinite(Number(amount))
    ? Number(amount)
    : DEFAULT_COURSE_COMPLETION_REWARD;

  if (!(rewardAmount > 0)) {
    throw new Error('Reward amount must be a positive number.');
  }

  return grantTokens({
    studentId,
    amount: rewardAmount,
    reasonCode,
    relatedId: String(courseId)
  });
};

// ==================== Gift Operations ====================

export interface GiftItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  tokenPrice: number;
  stockQuantity: number;
  category?: string;
}

/**
 * Get all available gifts
 */
export const getGifts = async (category?: string): Promise<GiftItem[]> => {
  try {
    const params = category && category !== 'all' ? { category } : {};
    const response = await tokenRewardAxios.get(`/gifts`, { params });
    return Array.isArray(response.data) ? response.data : (response.data?.gifts ?? []);
  } catch (error: any) {
    console.error('Error getting gifts:', error);
    throw new Error(error.response?.data?.message || 'Failed to get gifts');
  }
};

/**
 * Get gift details by ID
 */
export const getGiftById = async (giftId: string): Promise<GiftItem> => {
  try {
    const response = await tokenRewardAxios.get(`/gifts/${giftId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting gift:', error);
    if (error.response?.status === 404) {
      throw new Error('Gift not found');
    }
    throw new Error(error.response?.data?.message || 'Failed to get gift');
  }
};

// ==================== Admin Operations ====================

export interface AdminStatsResponse {
  totalTokensIssued: number;
  totalTokensSpent: number;
  currentBalance: number;
  totalUsers: number;
  totalTransactions: number;
  totalEarnTransactions: number;
  totalSpendTransactions: number;
  todayTransactions: number;
  todayTokensDistributed: number;
}

export interface TopUser {
  studentId: string;
  totalEarned: number;
  totalSpent: number;
  balance: number;
  transactionCount: number;
}

export interface RulePerformance {
  ruleId: string;
  ruleName: string;
  usageCount: number;
  totalTokensDistributed: number;
  successRate: number;
  averageReward: number;
}

/**
 * Get admin statistics (requires admin role)
 */
export const getAdminStats = async (): Promise<AdminStatsResponse> => {
  try {
    const response = await tokenRewardAxios.get(`/admin/stats`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting admin stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to get admin stats');
  }
};

/**
 * Get top users by token balance (requires admin role)
 */
export const getTopUsers = async (limit: number = 10): Promise<TopUser[]> => {
  try {
    const response = await tokenRewardAxios.get(`/admin/top-users`, {
      params: { limit }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting top users:', error);
    throw new Error(error.response?.data?.message || 'Failed to get top users');
  }
};

/**
 * Get reward rule performance (requires admin role)
 */
export const getRulePerformance = async (): Promise<RulePerformance[]> => {
  try {
    const response = await tokenRewardAxios.get(`/admin/rule-performance`);
    return response.data;
  } catch (error: any) {
    console.error('Error getting rule performance:', error);
    throw new Error(error.response?.data?.message || 'Failed to get rule performance');
  }
};

/**
 * Get all transactions (requires admin role)
 */
export const getAllTransactions = async (page: number = 1, limit: number = 50): Promise<HistoryResponse> => {
  try {
    const response = await tokenRewardAxios.get(`/admin/transactions`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting all transactions:', error);
    throw new Error(error.response?.data?.message || 'Failed to get all transactions');
  }
};

// ==================== Default Export ====================

const tokenRewardApi = {
  // Token Operations
  grantTokens,
  spendTokens,
  withdrawTokens,
  getLinkedWallet,
  linkWallet,
  unlinkWallet,
  
  // Balance & History
  getBalance,
  getHistory,
  grantCourseCompletionTokens,
  
  // Gift Operations
  getGifts,
  getGiftById,
  
  // Admin Operations
  getAdminStats,
  getTopUsers,
  getRulePerformance,
  getAllTransactions,
};

export default tokenRewardApi;

