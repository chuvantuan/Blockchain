import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, AlertCircle, CheckCircle, X, Camera, Mic, User, Shield, Info, Award } from 'lucide-react'

interface UpcomingExam {
	id: string
	title: string
	date: string
	time: string
	duration: string
	type: 'scheduled' | 'practice' | 'certification'
	status: 'upcoming' | 'registered' | 'ready'
	proctoring?: boolean
}

interface UpcomingExamsProps {
	exams?: UpcomingExam[]
	onRegisterExam?: (examId: string) => void
	onViewExam?: (examId: string) => void
	onStartExam?: (examId: string) => void
}

export default function UpcomingExams({
	exams = [
		{
			id: 'javascript-advanced',
			title: 'JavaScript nâng cao',
			date: 'Hôm nay',
			time: '2:00 chiều',
			duration: '90 phút',
			type: 'certification',
			status: 'ready',
			proctoring: true
		},
		{
			id: 'react-fundamentals',
			title: 'Phát triển React cơ bản',
			date: 'Ngày mai',
			time: '10:00 sáng',
			duration: '60 phút',
			type: 'scheduled',
			status: 'registered',
			proctoring: true
		},
		{
			id: 'data-structures',
			title: 'Bài kiểm tra Cấu trúc dữ liệu',
			date: '15 tháng 12, 2024',
			time: '3:30 chiều',
			duration: '45 phút',
			type: 'practice',
			status: 'upcoming',
			proctoring: false
		}
	],
	onRegisterExam,
	onViewExam,
	onStartExam
}: UpcomingExamsProps): JSX.Element {
	const navigate = useNavigate()
	const [showExamDetailModal, setShowExamDetailModal] = useState(false)
	const [showRegisterModal, setShowRegisterModal] = useState(false)
	const [showPreCheckModal, setShowPreCheckModal] = useState(false)
	const [selectedExam, setSelectedExam] = useState<UpcomingExam | null>(null)
	const [checklistItems, setChecklistItems] = useState({
		webcam: false,
		microphone: false,
		identity: false,
		agreement: false
	})
	const getTypeColor = (type: string) => {
		switch (type) {
			case 'certification':
				return 'var(--accent)'
			case 'scheduled':
				return 'var(--primary)'
			case 'practice':
				return 'var(--primary)'
			default:
				return 'var(--muted-foreground)'
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'ready':
				return <CheckCircle className="w-4 h-4 text-green-500" style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
			case 'registered':
				return <Clock className="w-4 h-4 text-blue-500" style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
			case 'upcoming':
				return <AlertCircle className="w-4 h-4 text-yellow-500" style={{ width: '16px', height: '16px', color: 'var(--accent)' }} />
			default:
				return null
		}
	}

	const getTypeLabel = (type: string) => {
		switch (type) {
			case 'certification':
				return 'Chứng chỉ'
			case 'scheduled':
				return 'Đã lên lịch'
			case 'practice':
				return 'Luyện tập'
			default:
				return type
		}
	}

	const handleStartExam = (examId: string) => {
		const exam = exams.find(e => e.id === examId)
		if (exam) {
			setSelectedExam(exam)
			if (exam.proctoring) {
				// Show pre-check modal for proctored exams
				setShowPreCheckModal(true)
			} else {
				// Navigate to pre-check page directly for non-proctored exams
				navigate(`/exam/${examId}/pre-check`)
				onStartExam?.(examId)
			}
		}
	}

	const handleViewExam = (examId: string) => {
		const exam = exams.find(e => e.id === examId)
		if (exam) {
			setSelectedExam(exam)
			setShowExamDetailModal(true)
			onViewExam?.(examId)
		}
	}

	const handleRegisterExam = (examId: string) => {
		const exam = exams.find(e => e.id === examId)
		if (exam) {
			setSelectedExam(exam)
			setShowRegisterModal(true)
		}
	}

	const handleConfirmRegistration = () => {
		if (selectedExam) {
			onRegisterExam?.(selectedExam.id)
			setShowRegisterModal(false)
			// Update exam status to registered (in real app, this would come from backend)
			alert('Đã đăng ký thành công!')
		}
	}

	const handleViewSchedule = () => {
		navigate('/user/exams/schedule')
	}

	const handleProceedToExam = () => {
		if (selectedExam && allChecksPassed()) {
			setShowPreCheckModal(false)
			navigate(`/exam/${selectedExam.id}/pre-check`)
			onStartExam?.(selectedExam.id)
		}
	}

	const allChecksPassed = () => {
		return Object.values(checklistItems).every(value => value === true)
	}

	const toggleChecklistItem = (key: keyof typeof checklistItems) => {
		setChecklistItems(prev => ({
			...prev,
			[key]: !prev[key]
		}))
	}

	const getActionButton = (exam: UpcomingExam) => {
		switch (exam.status) {
			case 'ready':
				return (
					<button
						onClick={() => handleStartExam(exam.id)}
						style={{
							background: 'linear-gradient(135deg, var(--primary), var(--accent))',
							color: 'white',
							padding: '8px 16px',
							borderRadius: 'var(--radius-md)',
							fontSize: '14px',
							fontWeight: 500,
							border: 'none',
							cursor: 'pointer',
							transition: 'all 0.2s ease',
							minWidth: '120px',
							textAlign: 'center'
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
						Bắt đầu thi
					</button>
				)
			case 'registered':
				return (
					<button
						onClick={() => handleStartExam(exam.id)}
						style={{
							background: 'linear-gradient(135deg, var(--accent), var(--primary))',
							color: 'white',
							padding: '8px 16px',
							borderRadius: 'var(--radius-md)',
							fontSize: '14px',
							fontWeight: 500,
							border: 'none',
							cursor: 'pointer',
							transition: 'all 0.2s ease',
							minWidth: '120px',
							textAlign: 'center'
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
						Tiếp tục làm bài
					</button>
				)
			case 'upcoming':
				return (
					<button
						onClick={() => handleRegisterExam(exam.id)}
						style={{
							background: 'linear-gradient(135deg, var(--primary), var(--accent))',
							color: 'white',
							padding: '8px 16px',
							borderRadius: 'var(--radius-md)',
							fontSize: '14px',
							fontWeight: 500,
							border: 'none',
							cursor: 'pointer',
							transition: 'all 0.2s ease',
							minWidth: '120px',
							textAlign: 'center'
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
						Đăng ký
					</button>
				)
			default:
				return null
		}
	}

	return (
		<>
			<div className="card stagger-load hover-lift interactive" style={{ animationDelay: '500ms', padding: '16px', height: '490px', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
				<div className="flex items-center justify-between mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
					<h3 className="text-lg font-semibold flex items-center" style={{ fontSize: '18px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center' }}>
						<Calendar className="w-5 h-5 mr-2" style={{ width: '20px', height: '20px', marginRight: '8px', color: 'var(--accent)' }} />
						Bài thi sắp tới
					</h3>
					<button
						onClick={handleViewSchedule}
						className="text-sm text-[var(--accent)] hover:underline"
						style={{
							fontSize: '14px',
							color: 'var(--primary)',
							background: 'none',
							border: 'none',
							cursor: 'pointer',
							transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
							padding: '4px 8px',
							borderRadius: '6px',
							fontWeight: 500
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = 'var(--primary-light)'
							e.currentTarget.style.textDecoration = 'underline'
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = 'none'
							e.currentTarget.style.textDecoration = 'none'
						}}
					>
						Xem lịch
					</button>
				</div>

				<div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
						{exams.map((exam) => (
							<div
								key={exam.id}
								style={{
									padding: '12px',
									borderRadius: 'var(--radius-md)',
									border: '1px solid var(--border)',
									background: 'var(--card)',
									transition: 'all 0.2s ease',
									cursor: 'pointer',
									boxShadow: 'var(--shadow-sm)'
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
								}}
							>
								<div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
									<div style={{ flex: 1, marginRight: '8px' }}>
										<div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
											{getStatusIcon(exam.status)}
											<h4 style={{ fontSize: '14px', fontWeight: 500, marginLeft: '8px', margin: 0 }}>
												{exam.title}
											</h4>
										</div>
										<div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px' }}>
											<Calendar style={{ width: '12px', height: '12px', marginRight: '4px' }} />
											{exam.date} lúc {exam.time}
										</div>
										<div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--muted-foreground)' }}>
											<Clock style={{ width: '12px', height: '12px', marginRight: '4px' }} />
											{exam.duration}
											{exam.proctoring && (
												<span style={{ marginLeft: '8px', padding: '2px 8px', background: 'var(--destructive)', color: 'white', borderRadius: '9999px', fontSize: '11px' }}>
													Giám sát
												</span>
											)}
										</div>
									</div>

									<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
										<span
											style={{
												fontSize: '11px',
												padding: '4px 10px',
												borderRadius: '9999px',
												fontWeight: 500,
												background: getTypeColor(exam.type) + '20',
												color: getTypeColor(exam.type)
											}}
										>
											{getTypeLabel(exam.type)}
										</span>
									</div>
								</div>

								<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
									{getActionButton(exam)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Exam Detail Modal */}
			{showExamDetailModal && selectedExam && (
				<div style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'rgba(0, 0, 0, 0.7)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 10000,
					backdropFilter: 'blur(4px)',
					animation: 'fadeIn 0.2s ease'
				}}>
					<div style={{
						background: 'var(--card)',
						borderRadius: 'var(--radius-lg)',
						padding: '32px',
						maxWidth: '500px',
						width: '90%',
						position: 'relative',
						boxShadow: 'var(--shadow-xl)',
						animation: 'slideInUp 0.3s ease'
					}}>
						<button
							onClick={() => setShowExamDetailModal(false)}
							style={{
								position: 'absolute',
								top: '16px',
								right: '16px',
								background: 'var(--muted)',
								border: 'none',
								borderRadius: '50%',
								width: '32px',
								height: '32px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								transition: 'all 0.2s ease'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'var(--destructive)'
								e.currentTarget.style.transform = 'scale(1.1)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'var(--muted)'
								e.currentTarget.style.transform = 'scale(1)'
							}}
						>
							<X style={{ width: '20px', height: '20px' }} />
						</button>

						<div style={{ textAlign: 'center' }}>
							<Calendar style={{
								width: '64px',
								height: '64px',
								color: 'var(--primary)',
								margin: '0 auto 16px'
							}} />

							<h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
								{selectedExam.title}
							</h2>

							<span
								style={{
									display: 'inline-block',
									fontSize: '12px',
									padding: '4px 12px',
									borderRadius: '9999px',
									fontWeight: 500,
									background: getTypeColor(selectedExam.type) + '20',
									color: getTypeColor(selectedExam.type),
									marginBottom: '24px'
								}}
							>
								{getTypeLabel(selectedExam.type)}
							</span>

							<div style={{
								background: 'var(--muted)',
								padding: '20px',
								borderRadius: 'var(--radius-md)',
								marginBottom: '24px',
								textAlign: 'left'
							}}>
								<div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
									<Calendar style={{ width: '16px', height: '16px', color: 'var(--primary)', marginRight: '8px' }} />
									<strong>Ngày thi:</strong> {selectedExam.date}
								</div>
								<div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
									<Clock style={{ width: '16px', height: '16px', color: 'var(--primary)', marginRight: '8px' }} />
									<strong>Giờ:</strong> {selectedExam.time}
								</div>
								<div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
									<Clock style={{ width: '16px', height: '16px', color: 'var(--primary)', marginRight: '8px' }} />
									<strong>Thời lượng:</strong> {selectedExam.duration}
								</div>
								{selectedExam.proctoring && (
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<Shield style={{ width: '16px', height: '16px', color: 'var(--destructive)', marginRight: '8px' }} />
										<strong>Giám sát:</strong> Có (camera & micro)
									</div>
								)}
							</div>

							<button
								onClick={() => setShowExamDetailModal(false)}
								style={{
									width: '100%',
									padding: '12px',
									background: 'linear-gradient(135deg, var(--primary), var(--accent))',
									color: 'white',
									border: 'none',
									borderRadius: 'var(--radius-md)',
									fontSize: '16px',
									fontWeight: 600,
									cursor: 'pointer',
									transition: 'all 0.2s ease'
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
								Đã hiểu
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Register Modal */}
			{showRegisterModal && selectedExam && (
				<div style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'rgba(0, 0, 0, 0.7)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 10000,
					backdropFilter: 'blur(4px)',
					animation: 'fadeIn 0.2s ease'
				}}>
					<div style={{
						background: 'var(--card)',
						borderRadius: 'var(--radius-lg)',
						padding: '32px',
						maxWidth: '500px',
						width: '90%',
						position: 'relative',
						boxShadow: 'var(--shadow-xl)',
						animation: 'slideInUp 0.3s ease'
					}}>
						<button
							onClick={() => setShowRegisterModal(false)}
							style={{
								position: 'absolute',
								top: '16px',
								right: '16px',
								background: 'var(--muted)',
								border: 'none',
								borderRadius: '50%',
								width: '32px',
								height: '32px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								transition: 'all 0.2s ease'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'var(--destructive)'
								e.currentTarget.style.transform = 'scale(1.1)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'var(--muted)'
								e.currentTarget.style.transform = 'scale(1)'
							}}
						>
							<X style={{ width: '20px', height: '20px' }} />
						</button>

						<div style={{ textAlign: 'center' }}>
							<Info style={{
								width: '64px',
								height: '64px',
								color: 'var(--primary)',
								margin: '0 auto 16px'
							}} />

							<h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
								Xác nhận đăng ký
							</h2>

							<p style={{ color: 'var(--muted-foreground)', marginBottom: '24px' }}>
								Bạn muốn đăng ký tham gia kỳ thi này?
							</p>

							<div style={{
								background: 'var(--muted)',
								padding: '16px',
								borderRadius: 'var(--radius-md)',
								marginBottom: '24px',
								textAlign: 'left'
							}}>
								<h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
									{selectedExam.title}
								</h3>
								<p style={{ fontSize: '14px', margin: '4px 0' }}>
									📅 {selectedExam.date} lúc {selectedExam.time}
								</p>
								<p style={{ fontSize: '14px', margin: '4px 0' }}>
									⏱️ {selectedExam.duration}
								</p>
								{selectedExam.proctoring && (
									<p style={{ fontSize: '14px', margin: '4px 0', color: 'var(--destructive)' }}>
										🔒 Bài thi có giám sát
									</p>
								)}
							</div>

							<div style={{ display: 'flex', gap: '12px' }}>
								<button
									onClick={() => setShowRegisterModal(false)}
									style={{
										flex: 1,
										padding: '12px',
										background: 'var(--muted)',
										color: 'var(--foreground)',
										border: '1px solid var(--border)',
										borderRadius: 'var(--radius-md)',
										fontSize: '16px',
										fontWeight: 600,
										cursor: 'pointer',
										transition: 'all 0.2s ease'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = 'var(--border)'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = 'var(--muted)'
									}}
								>
									Hủy
								</button>
								<button
									onClick={handleConfirmRegistration}
									style={{
										flex: 1,
										padding: '12px',
										background: 'linear-gradient(135deg, var(--primary), var(--accent))',
										color: 'white',
										border: 'none',
										borderRadius: 'var(--radius-md)',
										fontSize: '16px',
										fontWeight: 600,
										cursor: 'pointer',
										transition: 'all 0.2s ease'
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
									Xác nhận
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Pre-Check Modal for Proctored Exams */}
			{showPreCheckModal && selectedExam && selectedExam.proctoring && (
				<div style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'rgba(0, 0, 0, 0.7)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 10000,
					backdropFilter: 'blur(4px)',
					animation: 'fadeIn 0.2s ease'
				}}>
					<div style={{
						background: 'var(--card)',
						borderRadius: 'var(--radius-lg)',
						padding: '32px',
						maxWidth: '600px',
						width: '90%',
						maxHeight: '80vh',
						overflowY: 'auto',
						position: 'relative',
						boxShadow: 'var(--shadow-xl)',
						animation: 'slideInUp 0.3s ease'
					}}>
						<button
							onClick={() => {
								setShowPreCheckModal(false)
								setChecklistItems({
									webcam: false,
									microphone: false,
									identity: false,
									agreement: false
								})
							}}
							style={{
								position: 'absolute',
								top: '16px',
								right: '16px',
								background: 'var(--muted)',
								border: 'none',
								borderRadius: '50%',
								width: '32px',
								height: '32px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								transition: 'all 0.2s ease'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'var(--destructive)'
								e.currentTarget.style.transform = 'scale(1.1)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'var(--muted)'
								e.currentTarget.style.transform = 'scale(1)'
							}}
						>
							<X style={{ width: '20px', height: '20px' }} />
						</button>

						<div style={{ textAlign: 'center' }}>
							<Shield style={{
								width: '64px',
								height: '64px',
								color: 'var(--primary)',
								margin: '0 auto 16px'
							}} />

							<h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
								Kiểm tra trước khi thi
							</h2>

							<p style={{ color: 'var(--muted-foreground)', marginBottom: '24px' }}>
								Bài thi này yêu cầu giám sát. Vui lòng xác nhận các mục sau:
							</p>

							<div style={{
								background: 'var(--muted)',
								padding: '20px',
								borderRadius: 'var(--radius-md)',
								marginBottom: '24px',
								textAlign: 'left'
							}}>
								{/* Webcam Check */}
								<div
									onClick={() => toggleChecklistItem('webcam')}
									style={{
										display: 'flex',
										alignItems: 'center',
										padding: '12px',
										background: 'var(--card)',
										borderRadius: 'var(--radius-md)',
										marginBottom: '12px',
										cursor: 'pointer',
										border: `2px solid ${checklistItems.webcam ? 'var(--primary)' : 'var(--border)'}`,
										transition: 'all 0.2s ease'
									}}
								>
									<div style={{
										width: '24px',
										height: '24px',
										borderRadius: '50%',
										border: '2px solid var(--primary)',
										marginRight: '12px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: checklistItems.webcam ? 'var(--primary)' : 'transparent'
									}}>
										{checklistItems.webcam && <CheckCircle style={{ width: '16px', height: '16px', color: 'white' }} />}
									</div>
									<Camera style={{ width: '20px', height: '20px', marginRight: '8px', color: 'var(--primary)' }} />
									<span>Webcam hoạt động tốt</span>
								</div>

								{/* Microphone Check */}
								<div
									onClick={() => toggleChecklistItem('microphone')}
									style={{
										display: 'flex',
										alignItems: 'center',
										padding: '12px',
										background: 'var(--card)',
										borderRadius: 'var(--radius-md)',
										marginBottom: '12px',
										cursor: 'pointer',
										border: `2px solid ${checklistItems.microphone ? 'var(--primary)' : 'var(--border)'}`,
										transition: 'all 0.2s ease'
									}}
								>
									<div style={{
										width: '24px',
										height: '24px',
										borderRadius: '50%',
										border: '2px solid var(--primary)',
										marginRight: '12px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: checklistItems.microphone ? 'var(--primary)' : 'transparent'
									}}>
										{checklistItems.microphone && <CheckCircle style={{ width: '16px', height: '16px', color: 'white' }} />}
									</div>
									<Mic style={{ width: '20px', height: '20px', marginRight: '8px', color: 'var(--primary)' }} />
									<span>Microphone hoạt động tốt</span>
								</div>

								{/* Identity Check */}
								<div
									onClick={() => toggleChecklistItem('identity')}
									style={{
										display: 'flex',
										alignItems: 'center',
										padding: '12px',
										background: 'var(--card)',
										borderRadius: 'var(--radius-md)',
										marginBottom: '12px',
										cursor: 'pointer',
										border: `2px solid ${checklistItems.identity ? 'var(--primary)' : 'var(--border)'}`,
										transition: 'all 0.2s ease'
									}}
								>
									<div style={{
										width: '24px',
										height: '24px',
										borderRadius: '50%',
										border: '2px solid var(--primary)',
										marginRight: '12px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: checklistItems.identity ? 'var(--primary)' : 'transparent'
									}}>
										{checklistItems.identity && <CheckCircle style={{ width: '16px', height: '16px', color: 'white' }} />}
									</div>
									<User style={{ width: '20px', height: '20px', marginRight: '8px', color: 'var(--primary)' }} />
									<span>Tôi đã chuẩn bị giấy tờ tùy thân</span>
								</div>

								{/* Agreement Check */}
								<div
									onClick={() => toggleChecklistItem('agreement')}
									style={{
										display: 'flex',
										alignItems: 'center',
										padding: '12px',
										background: 'var(--card)',
										borderRadius: 'var(--radius-md)',
										cursor: 'pointer',
										border: `2px solid ${checklistItems.agreement ? 'var(--primary)' : 'var(--border)'}`,
										transition: 'all 0.2s ease'
									}}
								>
									<div style={{
										width: '24px',
										height: '24px',
										borderRadius: '50%',
										border: '2px solid var(--primary)',
										marginRight: '12px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: checklistItems.agreement ? 'var(--primary)' : 'transparent'
									}}>
										{checklistItems.agreement && <CheckCircle style={{ width: '16px', height: '16px', color: 'white' }} />}
									</div>
									<Shield style={{ width: '20px', height: '20px', marginRight: '8px', color: 'var(--primary)' }} />
									<span>Tôi đồng ý với quy định thi</span>
								</div>
							</div>

							{!allChecksPassed() && (
								<div style={{
									padding: '12px',
									background: 'var(--destructive)',
									color: 'white',
									borderRadius: 'var(--radius-md)',
									fontSize: '14px',
									marginBottom: '16px',
									display: 'flex',
									alignItems: 'center',
									gap: '8px'
								}}>
									<AlertCircle style={{ width: '16px', height: '16px' }} />
									Vui lòng hoàn thành tất cả các mục kiểm tra
								</div>
							)}

							<button
								onClick={handleProceedToExam}
								disabled={!allChecksPassed()}
								style={{
									width: '100%',
									padding: '12px',
									background: allChecksPassed() ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--muted)',
									color: allChecksPassed() ? 'white' : 'var(--muted-foreground)',
									border: 'none',
									borderRadius: 'var(--radius-md)',
									fontSize: '16px',
									fontWeight: 600,
									cursor: allChecksPassed() ? 'pointer' : 'not-allowed',
									transition: 'all 0.2s ease',
									opacity: allChecksPassed() ? 1 : 0.6
								}}
								onMouseEnter={(e) => {
									if (allChecksPassed()) {
										e.currentTarget.style.transform = 'translateY(-2px)'
										e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
									}
								}}
								onMouseLeave={(e) => {
									if (allChecksPassed()) {
										e.currentTarget.style.transform = 'translateY(0)'
										e.currentTarget.style.boxShadow = 'none'
									}
								}}
							>
								Bắt đầu thi
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Add animations */}
			<style>{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes slideInUp {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</>
	)
}
