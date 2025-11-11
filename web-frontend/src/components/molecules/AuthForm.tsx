import React from 'react'
import Input from '../atoms/Input'
import Button from '../atoms/Button'

interface AuthFormProps {
	title: string
	subtitle: string
	children: React.ReactNode
	onSubmit: (e: React.FormEvent) => void
	buttonText: string
	loading?: boolean
	error?: string | null
	footer?: React.ReactNode
	buttonStyle?: React.CSSProperties
	afterButton?: React.ReactNode
}

export default function AuthForm({
	title,
	subtitle,
	children,
	onSubmit,
	buttonText,
	loading = false,
	error,
	footer,
	buttonStyle = {},
	afterButton
}: AuthFormProps): JSX.Element {
	return (
		<div style={{
			background: 'var(--card)',
			borderRadius: 'var(--radius-lg)',
			padding: '2rem',
			boxShadow: 'var(--shadow-lg)',
			border: '1px solid var(--border)',
			maxWidth: '22rem',
			width: '100%'
		}}>
			<div style={{
				textAlign: 'center',
				marginBottom: '2rem'
			}}>
				<h1 style={{
					fontSize: '1.5rem',
					fontWeight: '600',
					color: 'var(--card-foreground)',
					margin: '0 0 0.5rem 0'
				}}>
					{title}
				</h1>
				<p style={{
					fontSize: '0.875rem',
					color: 'var(--muted-foreground)',
					margin: 0
				}}>
					{subtitle}
				</p>
			</div>

			<form onSubmit={onSubmit} style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1.5rem'
			}}>
				{children}
				
				{error && (
					<div style={{
						padding: '0.75rem',
						background: 'var(--destructive)',
						color: 'var(--destructive-foreground)',
						borderRadius: 'var(--radius-md)',
						fontSize: '0.875rem',
						textAlign: 'center'
					}}>
						{error}
					</div>
				)}
				
				<Button type="submit" loading={loading} style={{ marginTop: '0.5rem', ...buttonStyle }}>
					{buttonText}
				</Button>
			</form>

			{afterButton && (
				<div style={{ marginTop: '1.5rem' }}>
					{afterButton}
				</div>
			)}

			{footer && (
				<div style={{
					marginTop: '2rem',
					textAlign: 'center',
					fontSize: '0.875rem',
					color: 'var(--muted-foreground)',
					lineHeight: '1.5'
				}}>
					{footer}
				</div>
			)}
		</div>
	)
}
