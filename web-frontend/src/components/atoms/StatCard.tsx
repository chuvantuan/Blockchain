import React from 'react'

interface StatCardProps {
	title: string
	value: string | number
	icon?: React.ReactNode
	gradient?: 'primary' | 'accent'
	subtitle?: string
	delayMs?: number
}

export default function StatCard({ title, value, icon, gradient = 'primary', subtitle }: StatCardProps): JSX.Element {
	const getGradientStyles = () => {
		switch (gradient) {
			case 'primary':
				return {
					background: 'var(--gradient-primary)',
					color: 'var(--primary-foreground)'
				}
			case 'accent':
				return {
					background: 'var(--gradient-accent)',
					color: 'var(--accent-foreground)'
				}
			default:
				return {
					background: 'var(--gradient-primary)',
					color: 'var(--primary-foreground)'
				}
		}
	}

	const gradientStyles = getGradientStyles()

	return (
		<div style={{
			background: gradientStyles.background,
			padding: '16px',
			borderRadius: 'var(--radius-md)',
			transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
			cursor: 'pointer',
			position: 'relative',
			overflow: 'hidden',
			boxShadow: 'var(--shadow-sm)'
		}}
		onMouseEnter={(e) => {
			e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
			e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
		}}
		onMouseLeave={(e) => {
			e.currentTarget.style.transform = 'translateY(0) scale(1)';
			e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
		}}
		onMouseDown={(e) => {
			e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
		}}
		onMouseUp={(e) => {
			e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
		}}
		>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<div>
					<p style={{ fontSize: '14px', fontWeight: 500, color: gradientStyles.color, margin: 0 }}>
						{title}
					</p>
					<p style={{ fontSize: '24px', fontWeight: 700, color: gradientStyles.color, margin: 0 }}>
						{value}
					</p>
					{subtitle && (
						<p style={{ fontSize: '12px', fontWeight: 400, color: gradientStyles.color, margin: '4px 0 0', opacity: 0.8 }}>
							{subtitle}
						</p>
					)}
				</div>
				{icon && (
					<div style={{ color: gradientStyles.color }}>
						{icon}
					</div>
				)}
			</div>
		</div>
	)
}
