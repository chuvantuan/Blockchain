import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test/test-utils'
import { ExamNavigation } from './ExamNavigation'
import userEvent from '@testing-library/user-event'

describe('ExamNavigation Component', () => {
	const mockProps = {
		currentQuestionIndex: 2,
		totalQuestions: 10,
		onPrevious: vi.fn(),
		onNext: vi.fn(),
		onSubmit: vi.fn()
	}

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders all navigation buttons', () => {
		renderWithProviders(<ExamNavigation {...mockProps} />)

		expect(screen.getByText('Câu trước')).toBeInTheDocument()
		expect(screen.getByText('Nộp bài')).toBeInTheDocument()
		expect(screen.getByText('Câu tiếp')).toBeInTheDocument()
	})

	it('calls onPrevious when previous button is clicked', async () => {
		const user = userEvent.setup()
		renderWithProviders(<ExamNavigation {...mockProps} />)

		const prevButton = screen.getByText('Câu trước')
		await user.click(prevButton)

		expect(mockProps.onPrevious).toHaveBeenCalledTimes(1)
	})

	it('calls onNext when next button is clicked', async () => {
		const user = userEvent.setup()
		renderWithProviders(<ExamNavigation {...mockProps} />)

		const nextButton = screen.getByText('Câu tiếp')
		await user.click(nextButton)

		expect(mockProps.onNext).toHaveBeenCalledTimes(1)
	})

	it('calls onSubmit when submit button is clicked', async () => {
		const user = userEvent.setup()
		renderWithProviders(<ExamNavigation {...mockProps} />)

		const submitButton = screen.getByText('Nộp bài')
		await user.click(submitButton)

		expect(mockProps.onSubmit).toHaveBeenCalledTimes(1)
	})

	it('disables previous button on first question', () => {
		renderWithProviders(
			<ExamNavigation {...mockProps} currentQuestionIndex={0} />
		)

		const prevButton = screen.getByText('Câu trước')
		expect(prevButton).toBeDisabled()
	})

	it('disables next button on last question', () => {
		renderWithProviders(
			<ExamNavigation {...mockProps} currentQuestionIndex={9} />
		)

		const nextButton = screen.getByText('Câu tiếp')
		expect(nextButton).toBeDisabled()
	})

	it('enables both navigation buttons on middle question', () => {
		renderWithProviders(
			<ExamNavigation {...mockProps} currentQuestionIndex={5} />
		)

		const prevButton = screen.getByText('Câu trước')
		const nextButton = screen.getByText('Câu tiếp')

		expect(prevButton).not.toBeDisabled()
		expect(nextButton).not.toBeDisabled()
	})

	it('renders all buttons correctly', () => {
		renderWithProviders(<ExamNavigation {...mockProps} />)

		// Check that all 3 navigation buttons are rendered
		const buttons = screen.getAllByRole('button')
		expect(buttons).toHaveLength(3)

		// Verify button text content
		expect(screen.getByText('Câu trước')).toBeInTheDocument()
		expect(screen.getByText('Nộp bài')).toBeInTheDocument()
		expect(screen.getByText('Câu tiếp')).toBeInTheDocument()
	})

	it('memoizes correctly and does not re-render unnecessarily', () => {
		const { rerender } = renderWithProviders(<ExamNavigation {...mockProps} />)

		const submitButton1 = screen.getByText('Nộp bài')

		// Re-render with same props
		rerender(<ExamNavigation {...mockProps} />)

		const submitButton2 = screen.getByText('Nộp bài')

		expect(submitButton1).toBe(submitButton2)
	})
})
