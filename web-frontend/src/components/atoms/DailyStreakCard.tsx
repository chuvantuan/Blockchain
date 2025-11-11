import React from 'react'

interface DailyStreakCardProps {
	currentStreak: number
	weeklyProgress?: boolean[] // Array of 7 booleans for each day of the week
}

export default function DailyStreakCard({ 
	currentStreak, 
	weeklyProgress = [true, true, true, true, true, true, true] // Default: all days completed
}: DailyStreakCardProps): JSX.Element {
	const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

	return (
		<div style={{ 
			background: 'var(--card)', 
			borderRadius: 'var(--radius-lg)', 
			padding: '20px',
			border: '1px solid var(--border)',
			boxShadow: 'var(--shadow-sm)'
		}}>
			{/* Title */}
			<h3 style={{ 
				fontSize: '18px', 
				fontWeight: 700, 
				color: 'var(--foreground)', 
				marginBottom: '16px', 
				margin: 0 
			}}>
				Chuỗi ngày
			</h3>

			{/* Days of Week */}
			<div style={{ 
				display: 'flex', 
				justifyContent: 'space-between', 
				marginBottom: '12px' 
			}}>
				{days.map((day, index) => (
					<span 
						key={index}
						style={{ 
							fontSize: '14px', 
							fontWeight: 500, 
							color: 'var(--muted-foreground)',
							textAlign: 'center',
							width: '20px'
						}}
					>
						{day}
					</span>
				))}
			</div>

			{/* Progress Dots */}
			<div style={{ 
				display: 'flex', 
				justifyContent: 'space-between', 
				marginBottom: '16px' 
			}}>
				{weeklyProgress.map((isCompleted, index) => (
					<div 
						key={index}
						style={{ 
							width: '12px', 
							height: '12px', 
							borderRadius: '50%', 
							background: isCompleted ? 'var(--primary)' : 'var(--muted)', 
							transition: 'background-color 0.3s ease'
						}} 
					/>
				))}
			</div>

			{/* Current Streak Summary */}
			<div style={{ 
				display: 'flex', 
				justifyContent: 'space-between', 
				alignItems: 'center' 
			}}>
				<span style={{ 
					fontSize: '14px', 
					fontWeight: 500, 
					color: 'var(--foreground)' 
				}}>
					Chuỗi hiện tại:
				</span>
				<span style={{ 
					fontSize: '16px', 
					fontWeight: 700, 
					color: 'var(--accent)' 
				}}>
					{currentStreak} ngày
				</span>
			</div>
		</div>
	)
}
