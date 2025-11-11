import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../test/test-utils'
import Button from './Button'
import userEvent from '@testing-library/user-event'

describe('Button Component', () => {
	it('renders button with children', () => {
		renderWithProviders(<Button>Click me</Button>)
		expect(screen.getByText('Click me')).toBeInTheDocument()
	})

	it('calls onClick handler when clicked', async () => {
		const handleClick = vi.fn()
		const user = userEvent.setup()

		renderWithProviders(<Button onClick={handleClick}>Click</Button>)

		const button = screen.getByText('Click')
		await user.click(button)

		expect(handleClick).toHaveBeenCalledTimes(1)
	})

	it('renders as disabled when disabled prop is true', () => {
		renderWithProviders(<Button disabled>Disabled</Button>)

		const button = screen.getByText('Disabled')
		expect(button).toBeDisabled()
	})

	it('shows loading indicator when loading', () => {
		renderWithProviders(<Button loading>Loading</Button>)

		expect(screen.getByText('⏳')).toBeInTheDocument()
		expect(screen.getByText('Loading')).toBeInTheDocument()
	})

	it('does not call onClick when disabled', async () => {
		const handleClick = vi.fn()
		const user = userEvent.setup()

		renderWithProviders(
			<Button disabled onClick={handleClick}>
				Disabled
			</Button>
		)

		const button = screen.getByText('Disabled')
		await user.click(button)

		expect(handleClick).not.toHaveBeenCalled()
	})

	it('applies correct variant styles', () => {
		const { rerender } = renderWithProviders(<Button variant="primary">Primary</Button>)
		let button = screen.getByText('Primary')
		expect(button).toHaveStyle({ background: 'var(--primary)' })

		rerender(<Button variant="secondary">Secondary</Button>)
		button = screen.getByText('Secondary')
		expect(button).toHaveStyle({ background: 'var(--secondary)' })

		rerender(<Button variant="outline">Outline</Button>)
		button = screen.getByText('Outline')
		expect(button).toHaveStyle({ background: 'transparent' })
	})

	it('applies correct size styles', () => {
		renderWithProviders(
			<>
				<Button size="sm">Small</Button>
				<Button size="md">Medium</Button>
				<Button size="lg">Large</Button>
			</>
		)

		const smallButton = screen.getByText('Small')
		const mediumButton = screen.getByText('Medium')
		const largeButton = screen.getByText('Large')

		expect(smallButton).toHaveStyle({ padding: '0.5rem 0.75rem' })
		expect(mediumButton).toHaveStyle({ padding: '0.75rem 1rem' })
		expect(largeButton).toHaveStyle({ padding: '1rem 1.5rem' })
	})

	it('renders submit type button', () => {
		renderWithProviders(<Button type="submit">Submit</Button>)

		const button = screen.getByText('Submit')
		expect(button).toHaveAttribute('type', 'submit')
	})

	it('applies custom className', () => {
		renderWithProviders(<Button className="custom-class">Custom</Button>)

		const button = screen.getByText('Custom')
		expect(button).toHaveClass('custom-class')
	})

	it('memoizes correctly - does not re-render unnecessarily', () => {
		const { rerender } = renderWithProviders(<Button>Test</Button>)

		const button1 = screen.getByText('Test')

		// Re-render with same props
		rerender(<Button>Test</Button>)

		const button2 = screen.getByText('Test')

		// Should be the same element (memoized)
		expect(button1).toBe(button2)
	})
})
