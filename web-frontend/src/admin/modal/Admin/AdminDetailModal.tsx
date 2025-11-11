import React from 'react'
import { Users, Shield, Mail, Phone, MapPin, Calendar, Clock, User, Award } from 'lucide-react'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'

interface AdminDetailModalProps {
	isOpen: boolean
	onClose: () => void
	admin: any
}

const AdminDetailModal: React.FC<AdminDetailModalProps> = ({
	isOpen,
	onClose,
	admin
}) => {
	if (!admin) return null

	const getRoleLabel = (role: string) => {
		const labels: Record<string, string> = {
			super_admin: 'Super Admin',
			system_admin: 'System Admin',
			content_admin: 'Content Admin',
			user_admin: 'User Admin',
			security_admin: 'Security Admin',
			audit_admin: 'Audit Admin',
			support_admin: 'Support Admin'
		}
		return labels[role] || role
	}

	const getStatusLabel = (status: string) => {
		const labels: Record<string, string> = {
			active: 'Hoạt động',
			inactive: 'Không hoạt động',
			suspended: 'Tạm dừng',
			pending: 'Chờ duyệt',
			locked: 'Khóa'
		}
		return labels[status] || status
	}

	const getStatusVariant = (status: string) => {
		const variants: Record<string, "success" | "warning" | "danger" | "secondary"> = {
			active: 'success',
			inactive: 'secondary',
			suspended: 'warning',
			pending: 'warning',
			locked: 'danger'
		}
		return variants[status] || 'secondary'
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={admin.fullName || 'Chi tiết Admin'}
			maxWidth="900px"
		>
			<div className="admin-detail-modal-content">
				<div className="admin-detail-header">
					<div className="admin-detail-avatar">
						{admin.avatar ? (
							<img src={admin.avatar} alt={admin.fullName} />
						) : (
							<Users size={48} />
						)}
					</div>
					<div className="admin-detail-info">
						<h2 className="admin-detail-title">{admin.fullName}</h2>
						<p className="admin-detail-username">@{admin.username}</p>
						<div className="admin-detail-meta">
							<div className="meta-item">
								<Badge variant="secondary">
									{getRoleLabel(admin.role)}
								</Badge>
							</div>
							<div className="meta-item">
								<Badge variant={getStatusVariant(admin.status)}>
									{getStatusLabel(admin.status)}
								</Badge>
							</div>
							<div className="meta-item">
								<Shield size={16} />
								<span>{admin.isTwoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="admin-detail-sections">
					<div className="detail-section">
						<h3>
							<Mail size={20} />
							Thông tin liên hệ
						</h3>
						<div className="contact-info">
							<div className="contact-item">
								<span className="contact-label">
									<Mail size={14} /> Email
								</span>
								<span className="contact-value">{admin.email}</span>
							</div>
							{admin.metadata.phone && (
								<div className="contact-item">
									<span className="contact-label">
										<Phone size={14} /> Phone
									</span>
									<span className="contact-value">{admin.metadata.phone}</span>
								</div>
							)}
							{admin.metadata.address && (
								<div className="contact-item">
									<span className="contact-label">
										<MapPin size={14} /> Address
									</span>
									<span className="contact-value">{admin.metadata.address}</span>
								</div>
							)}
						</div>
					</div>

					<div className="detail-section">
						<h3>
							<Shield size={20} />
							Quyền hạn ({admin.permissions.length})
						</h3>
						<div className="permissions-list">
							{admin.permissions.map((permission: string) => (
								<Badge key={permission} variant="info">
									{permission.replace(/_/g, ' ')}
								</Badge>
							))}
						</div>
					</div>

					<div className="detail-section">
						<h3>
							<Clock size={20} />
							Thông tin hoạt động
						</h3>
						<div className="activity-info">
							<div className="activity-item">
								<span className="activity-label">
									<Clock size={14} /> Đăng nhập cuối
								</span>
								<span className="activity-value">
									{new Date(admin.lastLoginAt).toLocaleString('vi-VN')}
								</span>
							</div>
							<div className="activity-item">
								<span className="activity-label">
									<User size={14} /> Tạo bởi
								</span>
								<span className="activity-value">{admin.createdBy}</span>
							</div>
							<div className="activity-item">
								<span className="activity-label">
									<Calendar size={14} /> Ngày tạo
								</span>
								<span className="activity-value">
									{new Date(admin.createdAt).toLocaleString('vi-VN')}
								</span>
							</div>
							<div className="activity-item">
								<span className="activity-label">
									<Calendar size={14} /> Cập nhật cuối
								</span>
								<span className="activity-value">
									{new Date(admin.updatedAt).toLocaleString('vi-VN')}
								</span>
							</div>
						</div>
					</div>

					{admin.metadata.bio && (
						<div className="detail-section">
							<h3>
								<User size={20} />
								Giới thiệu
							</h3>
							<p className="bio-content">{admin.metadata.bio}</p>
						</div>
					)}

					{admin.metadata.skills && admin.metadata.skills.length > 0 && (
						<div className="detail-section">
							<h3>
								<Award size={20} />
								Kỹ năng ({admin.metadata.skills.length})
							</h3>
							<div className="skills-list">
								{admin.metadata.skills.map((skill: string) => (
									<Badge key={skill} variant="success">{skill}</Badge>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</Modal>
	)
}

export default AdminDetailModal
