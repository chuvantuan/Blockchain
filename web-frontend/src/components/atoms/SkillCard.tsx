import React from 'react'
import Badge from '../atoms/Badge'

interface Skill {
	id: string
	title: string
	icon: React.ReactNode
	category: 'algorithm' | 'language' | 'framework' | 'tool'
	progress?: number
	isCompleted?: boolean
}

interface SkillCardProps {
	skill: Skill
	onSkillClick?: (skillId: string) => void
}

export default function SkillCard({ skill, onSkillClick }: SkillCardProps): JSX.Element {
	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'algorithm': return 'var(--primary)'
			case 'language': return 'var(--primary)'
			case 'framework': return 'var(--accent)'
			case 'tool': return 'var(--primary)'
			default: return 'var(--muted-foreground)'
		}
	}

	const getProgressColor = (progress: number) => {
		if (progress >= 80) return 'var(--primary)'
		if (progress >= 60) return 'var(--primary)'
		if (progress >= 40) return 'var(--accent)'
		return 'var(--destructive)'
	}

	return (
		<div
			style={{
				padding: '12px',
				borderRadius: '12px',
				border: '1px solid var(--border)',
				background: 'var(--card)',
				transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
				cursor: 'pointer',
				position: 'relative',
				boxShadow: 'var(--shadow-sm)',
				overflow: 'hidden'
			}}
			onClick={() => onSkillClick?.(skill.id)}
			onMouseEnter={(e) => {
				e.currentTarget.style.borderColor = 'var(--primary)'
				e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
				e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.borderColor = 'var(--border)'
				e.currentTarget.style.transform = 'translateY(0) scale(1)'
				e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
			}}
			onMouseDown={(e) => {
				e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)'
			}}
			onMouseUp={(e) => {
				e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
			}}
		>
			{/* Icon */}
			<div 
				style={{ 
					marginBottom: '8px', 
					display: 'flex', 
					alignItems: 'center', 
					justifyContent: 'center', 
					width: '32px', 
					height: '32px', 
					borderRadius: 'var(--radius-md)',
					background: getCategoryColor(skill.category) + '20',
					color: getCategoryColor(skill.category)
				}}
			>
				{skill.icon}
			</div>

			{/* Title */}
			<h3 style={{ 
				fontSize: '14px', 
				fontWeight: 500, 
				color: 'var(--foreground)', 
				marginBottom: '4px', 
				margin: 0 
			}}>
				{skill.title}
			</h3>

			{/* Progress Bar */}
			{skill.progress !== undefined && (
				<div style={{ width: '100%' }}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
						<span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
							Tiến độ
						</span>
						<span 
							style={{ 
								fontSize: '12px', 
								fontWeight: 600, 
								color: getProgressColor(skill.progress) 
							}}
						>
							{skill.progress}%
						</span>
					</div>
					<div style={{ 
						width: '100%', 
						background: 'var(--muted)', 
						borderRadius: '9999px', 
						height: '6px' 
					}}>
						<div 
							style={{ 
								height: '6px', 
								borderRadius: '9999px', 
								background: getProgressColor(skill.progress),
								width: `${skill.progress}%`,
								transition: 'width 0.5s ease'
							}}
						/>
					</div>
				</div>
			)}

			{/* Category Badge */}
			<div style={{ marginTop: '8px' }}>
				<span 
					style={{ 
						fontSize: '12px', 
						padding: '2px 8px', 
						borderRadius: '9999px', 
						fontWeight: 500,
						background: getCategoryColor(skill.category) + '20',
						color: getCategoryColor(skill.category)
					}}
				>
					{skill.category}
				</span>
			</div>

			{/* Completed Badge */}
			{skill.isCompleted && (
				<div style={{ 
					position: 'absolute', 
					top: '8px', 
					right: '8px'
				}}>
					<Badge variant="success" size="sm">
						✓
					</Badge>
				</div>
			)}
		</div>
	)
}
