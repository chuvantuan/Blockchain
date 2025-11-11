import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, BookOpen, Users, Filter, Search } from 'lucide-react'
import { useExamSchedule } from '../hooks/useExamSchedule'
import { examService } from '../services/examService'

interface FilterOptions {
	timeRange: 'all' | 'today' | 'week' | 'month'
	status: 'all' | 'upcoming' | 'ongoing' | 'completed'
	searchQuery: string
}

export default function ExamSchedulePage(): JSX.Element {
	const navigate = useNavigate()
	const [filters, setFilters] = useState<FilterOptions>({
		timeRange: 'all',
		status: 'all',
		searchQuery: ''
	})
	const [submissions, setSubmissions] = useState<any[]>([])
	
	const { schedules, loading, error } = useExamSchedule(filters)
	
	// Load user submissions to check actual status
	useEffect(() => {
		const loadSubmissions = async () => {
			try {
				const subs = await examService.getMySubmissions()
				setSubmissions(subs)
			} catch (err) {
				console.error('Error loading submissions:', err)
			}
		}
		loadSubmissions()
	}, [])
	
	const handleExamClick = async (examId: string, status: string) => {
		// Check if user actually has a completed submission for this exam
		const submission = submissions.find((s: any) => s.quizId === examId)
		
		// CRITICAL: Check if submittedAt has a REAL value
		const hasValidSubmittedAt = submission?.submittedAt && 
			submission.submittedAt !== null && 
			submission.submittedAt !== '' &&
			submission.submittedAt !== 'null'
		
		// If there's a completed submission (with valid submittedAt), go to result page
		if (hasValidSubmittedAt) {
			navigate(`/exam/${examId}/result`)
		} else {
			// Otherwise, go to pre-check page (for ongoing exams)
			navigate(`/exam/${examId}/pre-check`)
		}
	}
	
	const getStatusBadge = (exam: any) => {
		// CRITICAL: Check if submittedAt has a REAL value
		const hasValidSubmittedAt = exam.submittedAt && 
			exam.submittedAt !== null && 
			exam.submittedAt !== '' &&
			exam.submittedAt !== 'null'
		
		// If user completed this exam, show completed badge
		if (hasValidSubmittedAt) {
			return (
				<span style={{
					padding: '4px 12px',
					borderRadius: '12px',
					fontSize: '12px',
					fontWeight: 500,
					background: '#10b98114',
					color: '#10b981'
				}}>
					Đã hoàn thành
				</span>
			)
		}
		
		// Otherwise, show status based on scheduled date
		const styles: Record<string, { bg: string; text: string; label: string }> = {
			upcoming: { bg: '#3b82f614', text: '#3b82f6', label: 'Sắp diễn ra' },
			ongoing: { bg: '#f59e0b14', text: '#f59e0b', label: 'Đang diễn ra' },
			completed: { bg: '#6b728014', text: '#6b7280', label: 'Chưa làm' }
		}
		const config = styles[exam.status] || styles.upcoming
		
		return (
			<span style={{
				padding: '4px 12px',
				borderRadius: '12px',
				fontSize: '12px',
				fontWeight: 500,
				background: config.bg,
				color: config.text
			}}>
				{config.label}
			</span>
		)
	}
	
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const today = new Date()
		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)
		
		// Check if same day
		if (date.toDateString() === today.toDateString()) {
			return `Hôm nay, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
		}
		if (date.toDateString() === tomorrow.toDateString()) {
			return `Ngày mai, ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
		}
		
		return date.toLocaleString('vi-VN', {
			weekday: 'short',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}
	
	return (
		<div style={{
			maxWidth: '1400px',
			margin: '0 auto',
			padding: '32px 24px',
			position: 'relative',
			width: '100%',
			boxSizing: 'border-box'
		}}>
			{/* Header */}
			<div style={{ 
				marginBottom: '32px',
				width: '100%'
			}}>
				<h1 style={{
					fontSize: '32px',
					fontWeight: 700,
					marginBottom: '8px',
					color: 'var(--foreground)'
				}}>
					Lịch Thi
				</h1>
				<p style={{
					fontSize: '16px',
					color: 'var(--muted-foreground)'
				}}>
					Quản lý và theo dõi lịch trình các kỳ thi của bạn
				</p>
			</div>
			
			{/* Filters */}
			<div style={{
				display: 'flex',
				gap: '16px',
				marginBottom: '32px',
				flexWrap: 'wrap',
				position: 'relative',
				zIndex: 5,
				width: '100%',
				boxSizing: 'border-box'
			}}>
				{/* Search */}
				<div style={{ 
					flex: '1 1 300px', 
					position: 'relative',
					minWidth: '250px'
				}}>
					<Search size={20} style={{
						position: 'absolute',
						left: '12px',
						top: '50%',
						transform: 'translateY(-50%)',
						color: 'var(--muted-foreground)',
						pointerEvents: 'none',
						zIndex: 1
					}} />
					<input
						type="text"
						placeholder="Tìm kiếm bài thi..."
						value={filters.searchQuery}
						onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
						style={{
							width: '100%',
							padding: '10px 12px 10px 40px',
							border: '1px solid var(--border)',
							borderRadius: '8px',
							fontSize: '14px',
							background: 'var(--card)',
							color: 'var(--foreground)',
							outline: 'none',
							boxSizing: 'border-box'
						}}
					/>
				</div>
				
				{/* Time Range Filter */}
				<div style={{ position: 'relative' }}>
					<select
						value={filters.timeRange}
						onChange={(e) => setFilters({ ...filters, timeRange: e.target.value as any })}
						style={{
							padding: '10px 16px',
							border: '1px solid var(--border)',
							borderRadius: '8px',
							fontSize: '14px',
							background: 'var(--card)',
							color: 'var(--foreground)',
							cursor: 'pointer',
							outline: 'none',
							minWidth: '180px',
							boxSizing: 'border-box'
						}}
					>
						<option value="all">Tất cả thời gian</option>
						<option value="today">Hôm nay</option>
						<option value="week">Tuần này</option>
						<option value="month">Tháng này</option>
					</select>
				</div>
				
				{/* Status Filter */}
				<div style={{ position: 'relative' }}>
					<select
						value={filters.status}
						onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
						style={{
							padding: '10px 16px',
							border: '1px solid var(--border)',
							borderRadius: '8px',
							fontSize: '14px',
							background: 'var(--card)',
							color: 'var(--foreground)',
							cursor: 'pointer',
							outline: 'none',
							minWidth: '180px',
							boxSizing: 'border-box'
						}}
					>
						<option value="all">Tất cả trạng thái</option>
						<option value="upcoming">Sắp diễn ra</option>
						<option value="ongoing">Đang diễn ra</option>
						<option value="completed">Đã kết thúc</option>
					</select>
				</div>
			</div>
			
			{/* Loading State */}
			{loading && (
				<div style={{
					textAlign: 'center',
					padding: '60px 20px',
					color: 'var(--muted-foreground)'
				}}>
					<div style={{
						width: '40px',
						height: '40px',
						border: '3px solid var(--border)',
						borderTopColor: 'var(--primary)',
						borderRadius: '50%',
						margin: '0 auto 16px',
						animation: 'spin 0.8s linear infinite'
					}} />
					Đang tải lịch thi...
				</div>
			)}
			
			{/* Error State */}
			{error && (
				<div style={{
					padding: '16px',
					background: '#ef444414',
					border: '1px solid #ef4444',
					borderRadius: '8px',
					color: '#ef4444',
					marginBottom: '24px'
				}}>
					{error}
				</div>
			)}
			
			{/* Exam Schedule List */}
			{!loading && !error && schedules.length === 0 && (
				<div style={{
					textAlign: 'center',
					padding: '60px 20px',
					color: 'var(--muted-foreground)'
				}}>
					<Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
					<p style={{ fontSize: '16px', fontWeight: 500 }}>
						Không có lịch thi nào
					</p>
					<p style={{ fontSize: '14px', marginTop: '8px' }}>
						Thay đổi bộ lọc hoặc kiểm tra lại sau
					</p>
				</div>
			)}
			
			{!loading && !error && schedules.length > 0 && (
				<div style={{
					display: 'grid',
					gap: '16px',
					position: 'relative',
					zIndex: 1
				}}>
					{schedules.map((exam) => (
						<div
							key={exam.id}
							onClick={() => handleExamClick(exam.id, exam.status)}
							style={{
								background: 'var(--card)',
								border: '1px solid var(--border)',
								borderRadius: '12px',
								padding: '20px',
								cursor: 'pointer',
								transition: 'all 0.2s ease',
								display: 'flex',
								gap: '20px',
								alignItems: 'start',
								position: 'relative'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.borderColor = 'var(--primary)'
								e.currentTarget.style.transform = 'translateY(-2px)'
								e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.borderColor = 'var(--border)'
								e.currentTarget.style.transform = 'translateY(0)'
								e.currentTarget.style.boxShadow = 'none'
							}}
						>
							{/* Date Box */}
							<div style={{
								minWidth: '80px',
								textAlign: 'center',
								padding: '12px',
								background: 'var(--primary-alpha)',
								borderRadius: '8px',
								border: '1px solid var(--primary)'
							}}>
								<div style={{
									fontSize: '24px',
									fontWeight: 700,
									color: 'var(--primary)'
								}}>
									{new Date(exam.scheduledDate || exam.startTime || '').getDate()}
								</div>
								<div style={{
									fontSize: '12px',
									color: 'var(--primary)',
									textTransform: 'uppercase'
								}}>
									Tháng {new Date(exam.scheduledDate || exam.startTime || '').getMonth() + 1}
								</div>
							</div>
							
							{/* Exam Info */}
							<div style={{ flex: 1 }}>
								<div style={{
									display: 'flex',
									alignItems: 'center',
									gap: '12px',
									marginBottom: '8px'
								}}>
									<h3 style={{
										fontSize: '18px',
										fontWeight: 600,
										color: 'var(--foreground)',
										margin: 0
									}}>
										{exam.title}
									</h3>
									{getStatusBadge(exam)}
								</div>
								
								<p style={{
									fontSize: '14px',
									color: 'var(--muted-foreground)',
									marginBottom: '12px'
								}}>
									{exam.description || 'Không có mô tả'}
								</p>
								
								<div style={{
									display: 'flex',
									gap: '24px',
									fontSize: '14px',
									color: 'var(--muted-foreground)'
								}}>
									<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
										<Clock size={16} />
										<span>{formatDate(exam.scheduledDate || exam.startTime || '')}</span>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
										<BookOpen size={16} />
										<span>{exam.questionCount || exam.questions?.length || 0} câu hỏi</span>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
										<Clock size={16} />
										<span>{exam.duration || exam.timeLimit || 60} phút</span>
									</div>
									{exam.participantCount && (
										<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
											<Users size={16} />
											<span>{exam.participantCount} người tham gia</span>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
			
			{/* Add keyframes for loading spinner */}
			<style>{`
				@keyframes spin {
					to { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	)
}

