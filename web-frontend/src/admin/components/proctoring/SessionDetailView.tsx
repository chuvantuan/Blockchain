import React from 'react'
import { ProctoringSession } from '../../types/proctoring'
import Badge from '../common/Badge'
import EventLog from './EventLog'
import { 
	Video, 
	VideoOff, 
	Mic, 
	MicOff, 
	Eye, 
	Wifi,
	Clock,
	User,
	FileText,
	AlertTriangle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface SessionDetailViewProps {
	session: ProctoringSession
	onResolveViolation?: (violationId: string) => void
	onTerminate?: (sessionId: string) => void
	onSendWarning?: (sessionId: string) => void
}

export default function SessionDetailView({ 
	session, 
	onResolveViolation,
	onTerminate,
	onSendWarning
}: SessionDetailViewProps): JSX.Element {
	
	const getRiskBadgeVariant = (risk: string) => {
		switch (risk) {
			case 'low': return 'success'
			case 'medium': return 'warning'
			case 'high': return 'danger'
			case 'critical': return 'danger'
			default: return 'secondary'
		}
	}

	const getRiskLabel = (risk: string) => {
		switch (risk) {
			case 'low': return 'An toàn'
			case 'medium': return 'Cảnh báo'
			case 'high': return 'Nguy hiểm'
			case 'critical': return 'Nghiêm trọng'
			default: return risk
		}
	}

	const getElapsedTime = () => {
		const start = new Date(session.startTime)
		const now = new Date()
		const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000 / 60)
		const duration = session.duration || 0
		return duration > 0 ? `${elapsed}/${duration} phút` : `${elapsed} phút`
	}

	const getProgress = () => {
		const start = new Date(session.startTime)
		const now = new Date()
		const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000 / 60)
		const duration = session.duration || 0
		return duration > 0 ? Math.min((elapsed / duration) * 100, 100) : 0
	}

	return (
		<div className="modal-content-wrapper">
			{/* Header */}
			<div className="modal-info-card">
				<div className="card-icon">
					{session.userAvatar ? (
						<img 
							src={session.userAvatar} 
							alt={session.userName || `User ${session.userId}`}
							style={{ 
								width: '40px', 
								height: '40px', 
								borderRadius: '50%',
								objectFit: 'cover'
							}}
						/>
					) : (
						<div style={{ 
							width: '40px', 
							height: '40px', 
							borderRadius: '50%',
							background: 'var(--accent)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							color: 'var(--accent-foreground)',
							fontSize: '18px',
							fontWeight: 700
						}}>
							{(session.userName || `User ${session.userId}`).charAt(0)}
						</div>
					)}
				</div>
				<div className="card-title">{session.userName || `User ${session.userId}`}</div>
				<div className="card-description">{session.examTitle || `Exam ${session.examId}`}</div>
				<div className="card-value">
					<span className={`modal-status-badge ${getRiskBadgeVariant(session.riskLevel)}`}>
						{getRiskLabel(session.riskLevel)}
					</span>
					<span className="modal-status-badge secondary" style={{ marginLeft: '8px' }}>
						ID: {session.id}
					</span>
				</div>
			</div>

			{/* Action Buttons */}
			{session.status === 'active' && (
				<div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
					{onSendWarning && (
						<button className="btn btn-warning" onClick={() => onSendWarning(session.id)}>
							<AlertTriangle size={18} />
							Gửi cảnh báo
						</button>
					)}
					{onTerminate && (
						<button className="btn btn-danger" onClick={() => onTerminate(session.id)}>
							Dừng phiên thi
						</button>
					)}
				</div>
			)}

			{/* Video Stream Placeholder */}
			<div className="modal-detail-section">
				<div className="section-title">
					<Video />
					<h4>Video Stream</h4>
				</div>
				<div style={{ 
					background: '#000',
					borderRadius: '16px',
					aspectRatio: '16/9',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
					overflow: 'hidden'
				}}>
				{session.cameraEnabled && session.faceDetected ? (
					<>
						<div style={{
							color: 'white',
							fontSize: '48px',
							opacity: 0.5
						}}>
							📹
						</div>
						<div style={{
							position: 'absolute',
							top: '16px',
							left: '16px',
							background: '#10b981',
							color: 'white',
							padding: '6px 12px',
							borderRadius: 'var(--radius-md)',
							fontSize: '13px',
							fontWeight: 600,
							display: 'flex',
							alignItems: 'center',
							gap: '6px'
						}}>
							<div style={{
								width: '8px',
								height: '8px',
								borderRadius: '50%',
								background: 'white',
								animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
							}} />
							LIVE
						</div>
					</>
				) : (
					<div style={{ textAlign: 'center', color: 'white' }}>
						<VideoOff size={64} style={{ marginBottom: '16px', opacity: 0.5 }} />
						<div style={{ fontSize: '18px', fontWeight: 500 }}>
							Camera không khả dụng
						</div>
					</div>
				)}
			</div>

			{/* Progress Bar */}
			<div>
				<div style={{ 
					display: 'flex', 
					justifyContent: 'space-between',
					marginBottom: '8px',
					fontSize: '14px',
					fontWeight: 500
				}}>
					<span>Tiến độ: {getElapsedTime()}</span>
					<span>{Math.round(getProgress())}%</span>
				</div>
				<div style={{
					width: '100%',
					height: '8px',
					background: 'var(--muted)',
					borderRadius: '9999px',
					overflow: 'hidden'
				}}>
					<div style={{
						width: `${getProgress()}%`,
						height: '100%',
						background: session.riskLevel === 'critical' ? '#ef4444' :
								   session.riskLevel === 'high' ? '#f59e0b' :
								   session.riskLevel === 'medium' ? '#eab308' : '#10b981',
						transition: 'width 0.3s ease'
					}} />
				</div>
			</div>
			</div>

			{/* Stats Grid */}
			<div className="modal-info-grid">
				<StatCard
					icon={<Video size={20} />}
					label="Camera"
					value={session.cameraEnabled ? 'Bật' : 'Tắt'}
					color={session.cameraEnabled ? '#10b981' : '#ef4444'}
				/>
				<StatCard
					icon={<Mic size={20} />}
					label="Microphone"
					value={session.audioEnabled ? 'Bật' : 'Tắt'}
					color={session.audioEnabled ? '#10b981' : '#ef4444'}
				/>
				<StatCard
					icon={<Eye size={20} />}
					label="Khuôn mặt"
					value={(session.faceDetected ?? true) ? `${session.faceCount || 1} người` : 'Không phát hiện'}
					color={(session.faceDetected ?? true) && (session.faceCount || 1) === 1 ? '#10b981' : '#ef4444'}
				/>
				<StatCard
					icon={<Wifi size={20} />}
					label="Kết nối"
					value={(session.connectionStatus || 'offline') === 'online' ? 'Ổn định' : 
						   (session.connectionStatus || 'offline') === 'unstable' ? 'Không ổn định' : 'Mất kết nối'}
					color={(session.connectionStatus || 'offline') === 'online' ? '#10b981' : 
						   (session.connectionStatus || 'offline') === 'unstable' ? '#f59e0b' : '#ef4444'}
				/>
				<StatCard
					icon={<AlertTriangle size={20} />}
					label="Vi phạm"
					value={`${session.totalViolations || 0} lần`}
					color={(session.totalViolations || 0) > 0 ? '#ef4444' : '#10b981'}
				/>
				<StatCard
					icon={<FileText size={20} />}
					label="Chuyển tab"
					value={`${session.tabSwitches || 0} lần`}
					color={(session.tabSwitches || 0) > 0 ? '#f59e0b' : '#10b981'}
				/>
			</div>

			{/* Event Log */}
			<div className="modal-detail-section">
				<div className="section-title">
					<AlertTriangle />
					<h4>Nhật ký sự kiện ({(session.violations || []).length})</h4>
				</div>
				<EventLog 
					violations={session.violations || []}
					onResolve={onResolveViolation}
				/>
			</div>
		</div>
	)
}

// Helper Component
function StatCard({ 
	icon, 
	label, 
	value, 
	color 
}: { 
	icon: React.ReactNode
	label: string
	value: string
	color: string
}) {
	return (
		<div className="modal-info-card">
			<div className="card-icon" style={{ background: color }}>
				{icon}
			</div>
			<div className="card-title">{label}</div>
			<div className="card-value" style={{ color }}>{value}</div>
		</div>
	)
}

