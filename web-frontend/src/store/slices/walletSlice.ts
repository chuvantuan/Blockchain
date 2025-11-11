import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WalletState {
	balance: number
	totalEarned: number
	totalSpent: number
	transactions: Array<{
		id: string
		type: 'earn' | 'spend' | 'reward'
		amount: number
		description: string
		date: string
	}>
	isConnected: boolean
	address: string | null
	loading: boolean
	error: string | null
}

const initialState: WalletState = {
	balance: 0,
	totalEarned: 0,
	totalSpent: 0,
	transactions: [],
	isConnected: false,
	address: null,
	loading: false,
	error: null
}

const walletSlice = createSlice({
	name: 'wallet',
	initialState,
	reducers: {
		setBalance: (state, action: PayloadAction<number>) => {
			state.balance = action.payload
		},
		setTotalEarned: (state, action: PayloadAction<number>) => {
			state.totalEarned = action.payload
		},
		setTotalSpent: (state, action: PayloadAction<number>) => {
			state.totalSpent = action.payload
		},
		addTransaction: (state, action: PayloadAction<WalletState['transactions'][0]>) => {
			state.transactions.unshift(action.payload)
		},
		setTransactions: (state, action: PayloadAction<WalletState['transactions']>) => {
			state.transactions = action.payload
		},
		setConnected: (state, action: PayloadAction<boolean>) => {
			state.isConnected = action.payload
		},
		setAddress: (state, action: PayloadAction<string | null>) => {
			state.address = action.payload
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload
		},
		clearError: (state) => {
			state.error = null
		}
	}
})

export const {
	setBalance,
	setTotalEarned,
	setTotalSpent,
	addTransaction,
	setTransactions,
	setConnected,
	setAddress,
	setLoading,
	setError,
	clearError
} = walletSlice.actions

export default walletSlice.reducer
