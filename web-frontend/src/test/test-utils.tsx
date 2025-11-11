import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../store/slices/authSlice'
import examReducer from '../store/slices/examSlice'
import walletReducer from '../store/slices/walletSlice'
import monitorReducer from '../store/slices/monitorSlice'
import { RootState } from '../store'
import React, { ReactElement } from 'react'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
	preloadedState?: Partial<RootState>
	store?: ReturnType<typeof configureStore>
}

/**
 * Custom render function with Redux store and Router
 */
export function renderWithProviders(
	ui: ReactElement,
	{
		preloadedState = {},
		store = configureStore({
			reducer: {
				auth: authReducer,
				exam: examReducer,
				wallet: walletReducer,
				monitor: monitorReducer
			} as any,
			preloadedState: preloadedState as any
		}),
		...renderOptions
	}: ExtendedRenderOptions = {}
) {
	function Wrapper({ children }: { children: React.ReactNode }) {
		return (
			<Provider store={store}>
				<BrowserRouter>{children}</BrowserRouter>
			</Provider>
		)
	}

	return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

/**
 * Create mock exam data for tests
 */
export const createMockExam = (overrides = {}) => ({
	id: 'test-exam-1',
	title: 'Test Exam',
	duration: 60,
	totalQuestions: 5,
	isProctored: true,
	instructions: ['Read carefully', 'No cheating'],
	questions: [
		{
			id: 1,
			type: 'multiple-choice' as const,
			question: 'What is 2+2?',
			options: ['3', '4', '5', '6'],
			correctAnswer: 1,
			points: 10
		}
	],
	...overrides
})

/**
 * Create mock question
 */
export const createMockQuestion = (overrides = {}) => ({
	id: 1,
	type: 'multiple-choice' as const,
	question: 'Sample question?',
	options: ['Option A', 'Option B', 'Option C', 'Option D'],
	points: 10,
	...overrides
})

// Re-export everything from testing library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
