import axios from 'axios'
import tokenRewardApi, {
  grantTokens as grantTokensReward,
  spendTokens as spendTokensReward,
  getBalance as getBalanceReward,
  getHistory as getHistoryReward,
  grantCourseCompletionTokens,
  type GrantTokenRequest,
  type SpendTokenRequest,
  type BalanceResponse,
  type HistoryResponse,
  type CourseCompletionRewardRequest,
  type Transaction,
} from './tokenRewardApi'

// Use API Gateway - This API_BASE_URL is not actually used because we're using tokenRewardApi
// Keeping it for backward compatibility if needed
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/tokens`
const DEFAULT_COURSE_COMPLETION_REWARD = Number(
	import.meta.env.VITE_COURSE_COMPLETION_REWARD ?? 100
)

// Create axios instance with interceptors
const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Response interceptor for error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			console.error('Unauthorized access - redirecting to login')
		}
		return Promise.reject(error)
	}
)

// Re-export token reward API types
export type {
  GrantTokenRequest,
  SpendTokenRequest,
  BalanceResponse,
  HistoryResponse,
  CourseCompletionRewardRequest,
  Transaction,
} from './tokenRewardApi'

export interface RewardRequest {
	userId: string
	walletAddress: string
	amount?: number
	reason?: string
}


export interface GiftItem {
	id: string
	name: string
	description: string
	imageUrl: string
	tokenPrice: number
	stockQuantity: number
	category: 'electronics' | 'voucher' | 'course' | 'physical' | 'other'
}

export interface RedeemGiftRequest {
	userId: string
	walletAddress: string
	giftId: string
	quantity: number
	deliveryAddress?: string
}

export interface CourseUnlockRequest {
	userId: string
	walletAddress: string
	courseId: string
	tokenPrice: number
}

export interface TokenTransaction {
	id: string
	userId: string
	walletAddress: string
	type: 'earn' | 'spend' | 'reward'
	amount: number
	description: string
	transactionHash?: string
	status: 'pending' | 'processing' | 'completed' | 'failed'
	createdAt: string
	updatedAt: string
}

/**
 * Award tokens for completing a lesson
 */
export async function awardLessonCompletion(request: RewardRequest): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/reward/lesson', request)
	return res.data
}

/**
 * Award tokens for passing an exam
 */
export async function awardExamPass(request: RewardRequest & { score: number }): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/reward/exam', request)
	return res.data
}

/**
 * Award tokens for daily streak
 */
export async function awardDailyStreak(request: RewardRequest & { streakDays: number }): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/reward/streak', request)
	return res.data
}

/**
 * Award tokens for earning certification
 */
export async function awardCertification(request: RewardRequest): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/reward/certification', request)
	return res.data
}

/**
 * Award tokens for winning contest
 */
export async function awardContestWin(request: RewardRequest & { rank: number }): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/reward/contest', request)
	return res.data
}

export interface CourseCompletionAwardParams {
	userId: string | number
	courseId: string | number
	amount?: number
	reasonCode?: string
}

export async function awardCourseCompletion({
	userId,
	courseId,
	amount,
	reasonCode
}: CourseCompletionAwardParams): Promise<Transaction> {
	if (userId === undefined || userId === null) {
		throw new Error('User id is required to award course completion tokens.')
	}
	if (courseId === undefined || courseId === null) {
		throw new Error('Course id is required to award course completion tokens.')
	}

	const normalizedUserId =
		typeof userId === 'string'
			? (() => {
					const trimmed = userId.trim()
					if (trimmed.length === 0) {
						throw new Error('User id is required to award course completion tokens.')
					}
					return Number.isFinite(Number(trimmed)) ? Number(trimmed) : trimmed
			  })()
			: userId

	const rewardAmount = Number.isFinite(Number(amount))
		? Number(amount)
		: DEFAULT_COURSE_COMPLETION_REWARD

	if (!(rewardAmount > 0)) {
		throw new Error('Reward amount must be a positive number.')
	}

	return grantCourseCompletionTokens({
		studentId: normalizedUserId,
		courseId,
		amount: rewardAmount,
		reasonCode,
	})
}

/**
 * Get available gifts for redemption
 * Uses token-reward-service backend
 */
export async function getAvailableGifts(category?: string): Promise<GiftItem[]> {
	const API_GATEWAY_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/tokens`
	const params = category && category !== 'all' ? `?category=${category}` : ''
	const res = await fetch(`${API_GATEWAY_URL}/gifts${params}`)
	if (!res.ok) {
		throw new Error('Failed to fetch gifts')
	}
	return await res.json()
}

/**
 * Get gift details by ID
 */
export async function getGiftDetails(giftId: string): Promise<GiftItem> {
	const res = await api.get<GiftItem>(`/tokens/gifts/${giftId}`)
	return res.data
}

/**
 * Redeem a gift using tokens
 */
export async function redeemGift(request: RedeemGiftRequest): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/redeem/gift', request)
	return res.data
}

/**
 * Unlock a course using tokens
 */
export async function unlockCourse(request: CourseUnlockRequest): Promise<TokenTransaction> {
	const res = await api.post<TokenTransaction>('/tokens/redeem/course', request)
	return res.data
}


/**
 * Get user's token transaction history
 */
export async function getUserTransactionHistory(
	userId: string,
	limit?: number,
	offset?: number
): Promise<{ transactions: TokenTransaction[], total: number }> {
	const params = { limit, offset }
	const res = await api.get<{ transactions: TokenTransaction[], total: number }>(
		`/tokens/transactions/${userId}`,
		{ params }
	)
	return res.data
}

/**
 * Get user's token balance from backend
 * Uses token-reward-service
 */
export async function getUserTokenBalance(userId: string | number): Promise<{
	balance: number
	totalEarned: number
	totalSpent: number
}> {
	const data = await getBalanceReward(userId)
	return {
		balance: data.balance || 0,
		totalEarned: data.totalEarned || 0,
		totalSpent: data.totalSpent || 0,
	}
}

/**
 * Grant tokens using token-reward-service
 */
export async function grantTokens(request: GrantTokenRequest): Promise<any> {
	return grantTokensReward(request)
}

/**
 * Spend tokens using token-reward-service
 */
export async function spendTokens(request: SpendTokenRequest): Promise<any> {
	return spendTokensReward(request)
}


/**
 * Get transaction history using token-reward-service
 */
export async function getTransactionHistory(
	userId: string | number,
	page: number = 1,
	limit: number = 10
): Promise<HistoryResponse> {
	return getHistoryReward(userId, page, limit)
}

/**
 * Verify token transaction on blockchain
 */
export async function verifyTransaction(transactionHash: string): Promise<{
	verified: boolean
	status: string
	details?: any
}> {
	const res = await api.post<{
		verified: boolean
		status: string
		details?: any
	}>('/tokens/verify', { transactionHash })
	return res.data
}

/**
 * Get token statistics
 */
export async function getTokenStats(): Promise<{
	totalSupply: number
	totalUsers: number
	totalTransactions: number
	totalRewardsIssued: number
	totalRedeemed: number
}> {
	const res = await api.get<{
		totalSupply: number
		totalUsers: number
		totalTransactions: number
		totalRewardsIssued: number
		totalRedeemed: number
	}>('/tokens/stats')
	return res.data
}
