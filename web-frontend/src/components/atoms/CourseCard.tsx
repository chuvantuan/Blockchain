import React from 'react'
import { BookOpen, Play, Award, Clock } from 'lucide-react'

interface Course {
	id: string
	title: string
	progress: number
	totalLessons: number
	completedLessons: number
	duration: string
	nextLesson?: string
	certificate?: boolean
}

interface CourseCardProps {
	course: Course
	onContinueCourse?: (courseId: string) => void
	onViewCourse?: (courseId: string) => void
}

export default function CourseCard({ course, onContinueCourse, onViewCourse }: CourseCardProps): JSX.Element {
	const getProgressColor = (progress: number) => {
		if (progress >= 80) return 'var(--primary)'
		if (progress >= 60) return 'var(--primary)'
		if (progress >= 40) return 'var(--accent)'
		return 'var(--destructive)'
	}

	return (
		<div style={{
			padding: '16px',
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
			e.currentTarget.style.transform = 'translateY(-2px)'
			e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
		}}
		onMouseLeave={(e) => {
			e.currentTarget.style.borderColor = 'var(--border)'
			e.currentTarget.style.transform = 'translateY(0)'
			e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
		}}>
			<div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
				<div style={{ flex: 1 }}>
					<div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
						<BookOpen style={{ width: '16px', height: '16px', color: 'var(--accent)', marginRight: '8px' }} />
						<h4 style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>
							{course.title}
						</h4>
					</div>
					
					<div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
						<Clock style={{ width: '12px', height: '12px', marginRight: '4px' }} />
						{course.duration} • {course.completedLessons}/{course.totalLessons} bài học
					</div>

					{/* Progress Bar */}
					<div style={{ marginBottom: '8px' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
							<span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
								Tiến độ
							</span>
							<span style={{ fontSize: '12px', fontWeight: 600, color: getProgressColor(course.progress) }}>
								{course.progress}%
							</span>
						</div>
						<div style={{
							width: '100%',
							height: '6px',
							background: 'var(--muted)',
							borderRadius: '3px',
							overflow: 'hidden'
						}}>
							<div style={{
								width: `${course.progress}%`,
								height: '100%',
								background: `linear-gradient(90deg, var(--primary), var(--accent))`,
								borderRadius: '3px',
								transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
								position: 'relative'
							}} />
						</div>
					</div>

					{course.nextLesson && (
						<div style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
							Tiếp theo: {course.nextLesson}
						</div>
					)}

					{course.certificate && (
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

				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '12px' }}>
					<button
						onClick={() => onContinueCourse?.(course.id)}
						style={{
							background: 'linear-gradient(135deg, var(--primary), var(--accent))',
							color: 'white',
							padding: '6px 12px',
							borderRadius: 'var(--radius-md)',
							fontSize: '12px',
							fontWeight: 500,
							border: 'none',
							cursor: 'pointer',
							transition: 'transform 0.2s, box-shadow 0.2s',
							display: 'flex',
							alignItems: 'center',
							gap: '4px',
							boxShadow: 'none'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'translateY(-2px)'
							e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'translateY(0)'
							e.currentTarget.style.boxShadow = 'none'
						}}
					>
						<Play style={{ width: '12px', height: '12px' }} />
						Tiếp tục
					</button>

					<button
						onClick={() => onViewCourse?.(course.id)}
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
						Xem chi tiết
					</button>
				</div>
			</div>
		</div>
	)
}
