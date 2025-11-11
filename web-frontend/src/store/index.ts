import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import examReducer from './slices/examSlice'
import monitorReducer from './slices/monitorSlice'
import walletReducer from './slices/walletSlice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		exam: examReducer,
		monitor: monitorReducer,
		wallet: walletReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
