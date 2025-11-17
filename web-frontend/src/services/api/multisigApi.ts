import axios from 'axios'

// Use API Gateway for all requests
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/multisig`

const multisigAxios = axios.create({
	baseURL: API_BASE_URL,
	headers: { 'Content-Type': 'application/json' },
})

multisigAxios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => Promise.reject(error),
)

multisigAxios.interceptors.response.use(
	(response) => response,
	(error) => {
		const message =
			error.response?.data?.message ||
			error.response?.data?.error ||
			error.message ||
			'Multisig service request failed'
		return Promise.reject(new Error(message))
	},
)

export interface Identity {
	id: string
	fullName?: string
	firstName?: string
	lastName?: string
	username?: string
	email?: string
	phone?: string
}

export interface OwnerDetail {
	userId: number
	identity?: Identity
	address: string
	privateKeyMasked?: string
}

export interface OwnerCredentialResponse {
	userId: number
	address: string
	privateKey: string
	identity?: Identity
}

export interface MultisigWallet {
	id: string
	contractAddress: string
	name: string
	description?: string | null
	creatorId?: string | null
	owners: string[]
	ownerUserIds?: (number | string)[]
	ownerDetails?: OwnerDetail[]
	threshold: number
	onChainBalance?: string
	onChainError?: string
	onChainWarning?: string
	createdAt?: string
	updatedAt?: string
}

export type MultisigTransactionStatus = 'submitted' | 'confirmed' | 'executed' | 'failed'

export interface MultisigTransaction {
	id: string
	walletId: string
	txIndexOnChain: number
	txHash?: string | null
	destination: string
	value: string
	data: string
	status: MultisigTransactionStatus
	confirmations: string[]
	createdAt?: string
	updatedAt?: string
	wallet?: MultisigWallet
}

export interface CreateWalletRequest {
	name: string
	description?: string
	ownerUserIds: number[]
	threshold: number
}

export interface LinkWalletRequest {
	name: string
	description?: string
	contractAddress: string
	ownerUserIds?: number[]
}

export interface SubmitTransactionRequest {
	destination: string
	value: number | string
	data?: string
	description?: string
}

export interface ConfirmTransactionRequest {
	privateKey?: string
}

export const createWallet = async (payload: CreateWalletRequest): Promise<MultisigWallet> => {
	const { data } = await multisigAxios.post<MultisigWallet>('/', payload)
	return data
}

export const linkWallet = async (payload: LinkWalletRequest): Promise<MultisigWallet> => {
	const { data } = await multisigAxios.post<MultisigWallet>('/link', payload)
	return data
}

export const getWalletById = async (walletId: string): Promise<MultisigWallet> => {
	const { data } = await multisigAxios.get<MultisigWallet>(`/${walletId}`)
	return data
}

export const getTransactionsByWallet = async (walletId: string): Promise<MultisigTransaction[]> => {
	console.log('[multisigApi] getTransactionsByWallet: Calling API for walletId:', walletId)
	console.log('[multisigApi] getTransactionsByWallet: Full URL:', `${API_BASE_URL}/${walletId}/transactions`)
	const response = await multisigAxios.get<MultisigTransaction[]>(`/${walletId}/transactions`)
	console.log('[multisigApi] getTransactionsByWallet: Response:', response)
	console.log('[multisigApi] getTransactionsByWallet: Response data:', response.data)
	console.log('[multisigApi] getTransactionsByWallet: Response data type:', Array.isArray(response.data) ? 'array' : typeof response.data)
	if (Array.isArray(response.data)) {
		console.log('[multisigApi] getTransactionsByWallet: Returning', response.data.length, 'transactions')
	} else {
		console.warn('[multisigApi] getTransactionsByWallet: Response is not an array!', response.data)
	}
	return response.data
}

export const submitTransaction = async (
	walletId: string,
	payload: SubmitTransactionRequest,
): Promise<MultisigTransaction> => {
	const { data } = await multisigAxios.post<MultisigTransaction>(`/${walletId}/transactions`, payload)
	return data
}

export const getTransactionById = async (transactionId: string): Promise<MultisigTransaction> => {
	const { data } = await multisigAxios.get<MultisigTransaction>(`/transactions/${transactionId}`)
	return data
}

export const confirmTransaction = async (
	transactionId: string,
	payload: ConfirmTransactionRequest = {},
): Promise<MultisigTransaction> => {
	const { data } = await multisigAxios.post<MultisigTransaction>(
		`/transactions/${transactionId}/confirm`,
		payload,
	)
	return data
}

export const executeTransaction = async (transactionId: string): Promise<MultisigTransaction> => {
	const { data } = await multisigAxios.post<MultisigTransaction>(
		`/transactions/${transactionId}/execute`,
		{},
	)
	return data
}

export const getAvailableUsers = async (): Promise<any[]> => {
	const { data } = await multisigAxios.get<any[]>('/users/available')
	return data
}

export const getAllWallets = async (): Promise<MultisigWallet[]> => {
	const { data } = await multisigAxios.get<MultisigWallet[]>('')
	return data
}

export const getOwnerCredential = async (walletId: string): Promise<OwnerCredentialResponse> => {
	const { data } = await multisigAxios.get<OwnerCredentialResponse>(`/${walletId}/owners/me`)
	return data
}

const multisigApi = {
	createWallet,
	linkWallet,
	getWalletById,
	getAllWallets,
	getAvailableUsers,
	getTransactionsByWallet,
	submitTransaction,
	getTransactionById,
	confirmTransaction,
	executeTransaction,
	getOwnerCredential,
}

export default multisigApi

