import React from 'react'
import { Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react'

interface RecentExam {
	id: string
	title: string
	score?: number
	maxScore: number
	status: 'completed' | 'in-progress' | 'failed'
	date: string
	duration: string
	certificate?: boolean
}

interface ExamCardProps {
	exam: RecentExam
	onViewExam?: (examId: string) => void
	onRetakeExam?: (examId: string) => void
}

export default function ExamCard({ exam, onViewExam, onRetakeExam }: ExamCardProps): JSX.Element {
	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'completed':
				return <CheckCircle style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
			case 'in-progress':
				return <Clock style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
			case 'failed':
				return <AlertCircle style={{ width: '16px', height: '16px', color: 'var(--destructive)' }} />
			default:
				return null
		}
	}

	const getScoreColor = (score?: number, maxScore: number = 100) => {
		if (!score) return 'var(--muted-foreground)'
		const percentage = (score / maxScore) * 100
		if (percentage >= 80) return 'var(--primary)'
		if (percentage >= 60) return 'var(--accent)'
		return 'var(--destructive)'
	}

	return (
		<div style={{
			padding: '12px',
			borderRadius: 'var(--radius-md)',
			border: '1px solid var(--border)',
			background: 'var(--card)',
			transition: 'all 0.2s',
			cursor: 'pointer',
			boxShadow: 'var(--shadow-sm)',
			position: 'relative',
			overflow: 'hidden'
		}}
		onMouseEnter={(e) => {
			e.currentTarget.style.borderColor = 'var(--primary)'
			e.currentTarget.style.transform = 'translateX(4px)'
			e.currentTarget.style.boxShadow = 'var(--shadow-md)'
		}}
		onMouseLeave={(e) => {
			e.currentTarget.style.borderColor = 'var(--border)'
			e.currentTarget.style.transform = 'translateX(0)'
			e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
		}}>
			<div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
				<div style={{ flex: 1 }}>
					<div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
						{getStatusIcon(exam.status)}
						<h4 style={{ fontSize: '14px', fontWeight: 500, marginLeft: '8px' }}>
							{exam.title}
						</h4>
					</div>
					
					<div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
						<Clock style={{ width: '12px', height: '12px', marginRight: '4px' }} />
						{exam.date}
					</div>

					{exam.score !== undefined && (
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
								Điểm
							</span>
							<span style={{ 
								fontSize: '14px', 
								fontWeight: 600, 
								color: getScoreColor(exam.score, exam.maxScore) 
							}}>
								{exam.score}/{exam.maxScore}
							</span>
						</div>
					)}

					{exam.certificate && (
						<div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
							<span style={{ 
								fontSize: '12px', 
								background: 'var(--accent)', 
								color: 'var(--accent-foreground)', 
								padding: '2px 8px', 
								borderRadius: '9999px' 
							}}>
								Có chứng chỉ
							</span>
						</div>
					)}
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '12px' }}>
					<button
						onClick={() => onViewExam?.(exam.id)}
						style={{
							padding: '4px',
							color: 'var(--accent)',
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							transition: 'color 0.2s'
						}}
						title="Xem chi tiết"
						onMouseEnter={(e) => {
							e.currentTarget.style.color = 'var(--primary)'
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.color = 'var(--accent)'
						}}
					>
						<Eye style={{ width: '16px', height: '16px' }} />
					</button>

					{exam.status === 'completed' && exam.score && exam.score < 70 && (
						<button
							onClick={() => onRetakeExam?.(exam.id)}
							style={{
								fontSize: '12px',
								color: 'var(--accent)',
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								textDecoration: 'underline',
								transition: 'color 0.2s'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.color = 'var(--primary)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.color = 'var(--accent)'
							}}
						>
							Thi lại
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
