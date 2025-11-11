import React, { useState } from 'react'
import { AuditLog as AuditLogType, AuditAction, AuditResult } from '../../types/admin'
import { 
	Search, 
	Filter, 
	Download, 
	RefreshCw,
	Eye,
	Clock,
	User,
	Activity,
	AlertTriangle,
	CheckCircle,
	XCircle,
	Info,
	Shield,
	Database,
	Settings,
	Key,
	Trash2,
	Edit,
	Plus,
	Minus
} from 'lucide-react'
import Badge from '../common/Badge'

interface AuditLogProps {
	logs: AuditLogType[]
	onRefresh?: () => void
	onExport?: () => void
	loading?: boolean
	emptyMessage?: string
}

export default function AuditLog({
	logs,
	onRefresh,
	onExport,
	loading = false,
	emptyMessage = 'Không có log nào'
}: AuditLogProps): JSX.Element {
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedAction, setSelectedAction] = useState<AuditAction | 'all'>('all')
	const [selectedResult, setSelectedResult] = useState<AuditResult | 'all'>('all')
	const [selectedUser, setSelectedUser] = useState<string>('all')
	const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all')
	const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())

	const getActionLabel = (action: AuditAction) => {
		const labels: Record<AuditAction, string> = {
			login: 'Đăng nhập',
			logout: 'Đăng xuất',
			create: 'Tạo mới',
			read: 'Xem',
			update: 'Cập nhật',
			delete: 'Xóa',
			export: 'Xuất dữ liệu',
			import: 'Nhập dữ liệu',
			backup: 'Sao lưu',
			restore: 'Khôi phục',
			configure: 'Cấu hình',
			grant_permission: 'Cấp quyền',
			revoke_permission: 'Thu hồi quyền',
			suspend_user: 'Tạm dừng người dùng',
			activate_user: 'Kích hoạt người dùng',
			reset_password: 'Đặt lại mật khẩu',
			change_password: 'Đổi mật khẩu',
			enable_2fa: 'Bật 2FA',
			disable_2fa: 'Tắt 2FA',
			system_restart: 'Khởi động hệ thống',
			system_shutdown: 'Tắt hệ thống',
			maintenance_mode: 'Chế độ bảo trì',
			security_scan: 'Quét bảo mật',
			firewall_update: 'Cập nhật firewall',
			ssl_renewal: 'Gia hạn SSL'
		}
		return labels[action] || action
	}

	const getActionIcon = (action: AuditAction) => {
		switch (action) {
			case 'login':
			case 'logout':
				return <User size={14} />
			case 'create':
				return <Plus size={14} />
			case 'read':
				return <Eye size={14} />
			case 'update':
				return <Edit size={14} />
			case 'delete':
				return <Trash2 size={14} />
			case 'export':
			case 'import':
				return <Download size={14} />
			case 'backup':
			case 'restore':
				return <Database size={14} />
			case 'configure':
				return <Settings size={14} />
			case 'grant_permission':
			case 'revoke_permission':
			case 'enable_2fa':
			case 'disable_2fa':
				return <Key size={14} />
			case 'suspend_user':
			case 'activate_user':
				return <User size={14} />
			case 'reset_password':
			case 'change_password':
				return <Key size={14} />
			case 'system_restart':
			case 'system_shutdown':
			case 'maintenance_mode':
				return <Settings size={14} />
			case 'security_scan':
			case 'firewall_update':
			case 'ssl_renewal':
				return <Shield size={14} />
			default:
				return <Activity size={14} />
		}
	}

	const getResultIcon = (result: AuditResult) => {
		switch (result) {
			case 'success':
				return <CheckCircle size={14} className="text-green-500" />
			case 'failure':
				return <XCircle size={14} className="text-red-500" />
			case 'warning':
				return <AlertTriangle size={14} className="text-yellow-500" />
			case 'error':
				return <XCircle size={14} className="text-red-500" />
			default:
				return <Info size={14} className="text-gray-500" />
		}
	}

	const getResultColor = (result: AuditResult) => {
		switch (result) {
			case 'success':
				return 'var(--success)'
			case 'failure':
				return 'var(--danger)'
			case 'warning':
				return 'var(--warning)'
			case 'error':
				return 'var(--danger)'
			default:
				return 'var(--muted-foreground)'
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString('vi-VN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		})
	}

	const formatRelativeTime = (dateString: string) => {
		const now = new Date()
		const date = new Date(dateString)
		const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
		
		if (diffInMinutes < 1) return 'Vừa xong'
		if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
		return `${Math.floor(diffInMinutes / 1440)} ngày trước`
	}

	const getFilteredLogs = () => {
		return logs.filter(log => {
			const matchesSearch = !searchTerm || 
				log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
				log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
				log.details.description.toLowerCase().includes(searchTerm.toLowerCase())
			
			const matchesAction = selectedAction === 'all' || log.action === selectedAction
			const matchesResult = selectedResult === 'all' || log.result === selectedResult
			const matchesUser = selectedUser === 'all' || log.userId === selectedUser

			let matchesDate = true
			if (dateRange !== 'all') {
				const logDate = new Date(log.timestamp)
				const now = new Date()
				
				switch (dateRange) {
					case 'today':
						matchesDate = logDate.toDateString() === now.toDateString()
						break
					case 'week':
						const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
						matchesDate = logDate >= weekAgo
						break
					case 'month':
						const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
						matchesDate = logDate >= monthAgo
						break
				}
			}

			return matchesSearch && matchesAction && matchesResult && matchesUser && matchesDate
		})
	}

	const toggleLogExpansion = (logId: string) => {
		const newExpanded = new Set(expandedLogs)
		if (newExpanded.has(logId)) {
			newExpanded.delete(logId)
		} else {
			newExpanded.add(logId)
		}
		setExpandedLogs(newExpanded)
	}

	const uniqueUsers = Array.from(new Set(logs.map(log => log.userId)))
	const uniqueActions = Array.from(new Set(logs.map(log => log.action))) as AuditAction[]

	if (loading) {
		return (
			<div className="audit-log loading">
				<div className="loading-spinner"></div>
				<p>Đang tải audit log...</p>
			</div>
		)
	}

	const filteredLogs = getFilteredLogs()

	return (
		<div className="audit-log">
			{/* Header */}
			<div className="audit-header">
				<div className="audit-title">
					<Activity size={24} />
					<h2>Audit Log</h2>
					<Badge variant="info">{filteredLogs.length} entries</Badge>
				</div>
				<div className="audit-actions">
					{onRefresh && (
						<button
							className="btn btn-secondary"
							onClick={onRefresh}
							title="Làm mới"
						>
							<RefreshCw size={16} />
						</button>
					)}
					{onExport && (
						<button
							className="btn btn-secondary"
							onClick={onExport}
							title="Xuất log"
						>
							<Download size={16} />
						</button>
					)}
				</div>
			</div>

			{/* Filters */}
			<div className="audit-filters">
				<div className="search-bar">
					<Search size={16} />
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Tìm kiếm trong log..."
						className="form-input"
					/>
				</div>
				<div className="filter-group">
					<select
						value={selectedAction}
						onChange={(e) => setSelectedAction(e.target.value as AuditAction | 'all')}
						className="form-select"
					>
						<option value="all">Tất cả hành động</option>
						{uniqueActions.map(action => (
							<option key={action} value={action}>
								{getActionLabel(action)}
							</option>
						))}
					</select>
				</div>
				<div className="filter-group">
					<select
						value={selectedResult}
						onChange={(e) => setSelectedResult(e.target.value as AuditResult | 'all')}
						className="form-select"
					>
						<option value="all">Tất cả kết quả</option>
						<option value="success">Thành công</option>
						<option value="failure">Thất bại</option>
						<option value="warning">Cảnh báo</option>
						<option value="error">Lỗi</option>
					</select>
				</div>
				<div className="filter-group">
					<select
						value={selectedUser}
						onChange={(e) => setSelectedUser(e.target.value)}
						className="form-select"
					>
						<option value="all">Tất cả người dùng</option>
						{uniqueUsers.map(userId => {
							const user = logs.find(log => log.userId === userId)
							return (
								<option key={userId} value={userId}>
									{user?.userName || userId}
								</option>
							)
						})}
					</select>
				</div>
				<div className="filter-group">
					<select
						value={dateRange}
						onChange={(e) => setDateRange(e.target.value as any)}
						className="form-select"
					>
						<option value="all">Tất cả thời gian</option>
						<option value="today">Hôm nay</option>
						<option value="week">7 ngày qua</option>
						<option value="month">30 ngày qua</option>
					</select>
				</div>
			</div>

			{/* Logs List */}
			<div className="audit-logs-list">
				{filteredLogs.map((log) => (
					<div key={log.id} className="audit-log-item">
						<div className="log-header" onClick={() => toggleLogExpansion(log.id)}>
							<div className="log-main">
								<div className="log-action">
									{getActionIcon(log.action)}
									<span className="action-name">{getActionLabel(log.action)}</span>
									<span className="action-resource">on {log.resource}</span>
									{log.resourceId && (
										<span className="resource-id">#{log.resourceId}</span>
									)}
								</div>
								<div className="log-description">
									{log.details.description}
								</div>
							</div>
							<div className="log-meta">
								<div className="log-user">
									<User size={14} />
									<span>{log.userName}</span>
									<Badge variant="secondary">{log.userRole}</Badge>
								</div>
								<div className="log-result">
									{getResultIcon(log.result)}
									<span style={{ color: getResultColor(log.result) }}>
										{log.result.toUpperCase()}
									</span>
								</div>
								<div className="log-time">
									<Clock size={14} />
									<span title={formatDate(log.timestamp)}>
										{formatRelativeTime(log.timestamp)}
									</span>
								</div>
								<div className="log-expand">
									{expandedLogs.has(log.id) ? <Minus size={16} /> : <Plus size={16} />}
								</div>
							</div>
						</div>

						{expandedLogs.has(log.id) && (
							<div className="log-details">
								<div className="details-grid">
									<div className="detail-section">
										<h4>Thông tin cơ bản</h4>
										<div className="detail-item">
											<span className="detail-label">ID:</span>
											<span className="detail-value">{log.id}</span>
										</div>
										<div className="detail-item">
											<span className="detail-label">Thời gian:</span>
											<span className="detail-value">{formatDate(log.timestamp)}</span>
										</div>
										<div className="detail-item">
											<span className="detail-label">Session ID:</span>
											<span className="detail-value">{log.sessionId}</span>
										</div>
										<div className="detail-item">
											<span className="detail-label">Kết quả:</span>
											<span className="detail-value" style={{ color: getResultColor(log.result) }}>
												{log.result.toUpperCase()}
											</span>
										</div>
									</div>

									<div className="detail-section">
										<h4>Thông tin người dùng</h4>
										<div className="detail-item">
											<span className="detail-label">Tên:</span>
											<span className="detail-value">{log.userName}</span>
										</div>
										<div className="detail-item">
											<span className="detail-label">ID:</span>
											<span className="detail-value">{log.userId}</span>
										</div>
										<div className="detail-item">
											<span className="detail-label">Vai trò:</span>
											<span className="detail-value">{log.userRole}</span>
										</div>
									</div>

									<div className="detail-section">
										<h4>Thông tin mạng</h4>
										<div className="detail-item">
											<span className="detail-label">IP Address:</span>
											<span className="detail-value">{log.ipAddress}</span>
										</div>
										<div className="detail-item">
											<span className="detail-label">User Agent:</span>
											<span className="detail-value">{log.userAgent}</span>
										</div>
									</div>

									<div className="detail-section">
										<h4>Chi tiết hành động</h4>
										<div className="detail-item">
											<span className="detail-label">Hành động:</span>
											<span className="detail-value">{getActionLabel(log.action)}</span>
										</div>
										<div className="detail-item">
											<span className="detail-label">Tài nguyên:</span>
											<span className="detail-value">{log.resource}</span>
										</div>
										{log.resourceId && (
											<div className="detail-item">
												<span className="detail-label">Resource ID:</span>
												<span className="detail-value">{log.resourceId}</span>
											</div>
										)}
										{log.details.duration && (
											<div className="detail-item">
												<span className="detail-label">Thời gian thực hiện:</span>
												<span className="detail-value">{log.details.duration}s</span>
											</div>
										)}
									</div>

									{log.details.changes && Object.keys(log.details.changes).length > 0 && (
										<div className="detail-section">
											<h4>Thay đổi</h4>
											{Object.entries(log.details.changes).map(([key, change]) => (
												<div key={key} className="change-item">
													<div className="change-field">{key}</div>
													<div className="change-values">
														<div className="change-old">
															<span className="change-label">Cũ:</span>
															<span className="change-value">{String(change.old)}</span>
														</div>
														<div className="change-new">
															<span className="change-label">Mới:</span>
															<span className="change-value">{String(change.new)}</span>
														</div>
													</div>
												</div>
											))}
										</div>
									)}

									{log.details.error && (
										<div className="detail-section">
											<h4>Lỗi</h4>
											<div className="error-message">
												<AlertTriangle size={16} />
												<span>{log.details.error}</span>
											</div>
										</div>
									)}

									{log.details.warning && (
										<div className="detail-section">
											<h4>Cảnh báo</h4>
											<div className="warning-message">
												<AlertTriangle size={16} />
												<span>{log.details.warning}</span>
											</div>
										</div>
									)}

									{log.metadata && Object.keys(log.metadata).length > 0 && (
										<div className="detail-section">
											<h4>Metadata</h4>
											<pre className="metadata-display">
												{JSON.stringify(log.metadata, null, 2)}
											</pre>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{filteredLogs.length === 0 && (
				<div className="audit-empty">
					<Activity size={48} />
					<h3>Không có log nào</h3>
					<p>{emptyMessage}</p>
				</div>
			)}
		</div>
	)
}
