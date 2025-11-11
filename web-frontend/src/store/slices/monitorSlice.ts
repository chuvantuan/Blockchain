import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MonitorState {
	isActive: boolean
	userCount: number
	alerts: string[]
	status: 'idle' | 'monitoring' | 'error'
	error: string | null
}

const initialState: MonitorState = {
	isActive: false,
	userCount: 0,
	alerts: [],
	status: 'idle',
	error: null
}

const monitorSlice = createSlice({
	name: 'monitor',
	initialState,
	reducers: {
		startMonitoring: (state) => {
			state.isActive = true
			state.status = 'monitoring'
		},
		stopMonitoring: (state) => {
			state.isActive = false
			state.status = 'idle'
		},
		setUserCount: (state, action: PayloadAction<number>) => {
			state.userCount = action.payload
		},
		addAlert: (state, action: PayloadAction<string>) => {
			state.alerts.push(action.payload)
		},
		clearAlerts: (state) => {
			state.alerts = []
		},
		setError: (state, action: PayloadAction<string | null>) => {
			state.error = action.payload
		}
	}
})

export const {
	startMonitoring,
	stopMonitoring,
	setUserCount,
	addAlert,
	clearAlerts,
	setError
} = monitorSlice.actions

export default monitorSlice.reducer
