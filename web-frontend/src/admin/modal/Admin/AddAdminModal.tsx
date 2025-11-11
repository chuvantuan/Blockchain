import React, { useState, useEffect } from 'react'
import { X, Save, User, Mail, Lock, Shield, Settings, UserCheck, Phone, Building2 } from 'lucide-react'
import Modal from '../../components/common/Modal'
import { AdminForm, AdminRole, AdminStatus, AdminPermission, AdminPreferences, AdminMetadata } from '../../types/admin'

interface AddAdminModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (adminForm: AdminForm) => void
	editingAdmin?: any
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
	isOpen,
	onClose,
	onSave,
	editingAdmin
}) => {
	const [formData, setFormData] = useState<AdminForm>({
		username: '',
		email: '',
		fullName: '',
		role: 'user_admin',
		permissions: [],
		status: 'pending',
		preferences: {
			language: 'vi',
			timezone: 'Asia/Ho_Chi_Minh',
			theme: 'light',
			notifications: {
				email: true,
				push: true,
				sms: false
			},
			dashboard: {
				layout: 'grid',
				widgets: [],
				refreshInterval: 30
			},
			security: {
				sessionTimeout: 60,
				requirePasswordChange: true,
				passwordExpiryDays: 90
			}
		},
		metadata: {
			department: '',
			phone: '',
			address: '',
			bio: '',
			skills: [],
			certifications: [],
			notes: '',
			tags: []
		}
	})

	const [errors, setErrors] = useState<Record<string, string>>({})

	const roleOptions: { value: AdminRole; label: string; permissions: AdminPermission[] }[] = [
		{
			value: 'super_admin',
			label: 'Super Admin',
			permissions: [
				'user_management', 'content_management', 'system_settings', 'security_settings',
				'audit_logs', 'backup_restore', 'database_management', 'api_management',
				'notification_management', 'report_generation', 'certificate_management',
				'organization_management', 'course_management', 'exam_management',
				'proctoring_management', 'blockchain_management', 'token_management',
				'analytics_access', 'export_data', 'import_data'
			]
		},
		{
			value: 'system_admin',
			label: 'System Admin',
			permissions: [
				'system_settings', 'security_settings', 'audit_logs', 'backup_restore',
				'database_management', 'api_management', 'notification_management',
				'maintenance_mode', 'system_restart', 'system_shutdown'
			]
		},
		{
			value: 'content_admin',
			label: 'Content Admin',
			permissions: [
				'content_management', 'course_management', 'exam_management',
				'certificate_management', 'organization_management'
			]
		},
		{
			value: 'user_admin',
			label: 'User Admin',
			permissions: [
				'user_management', 'organization_management', 'audit_logs'
			]
		},
		{
			value: 'security_admin',
			label: 'Security Admin',
			permissions: [
				'security_settings', 'audit_logs', 'proctoring_management',
				'firewall_update', 'security_scan'
			]
		},
		{
			value: 'audit_admin',
			label: 'Audit Admin',
			permissions: [
				'audit_logs', 'report_generation', 'analytics_access'
			]
		},
		{
			value: 'support_admin',
			label: 'Support Admin',
			permissions: [
				'user_management', 'notification_management', 'audit_logs'
			]
		}
	]

	const statusOptions: { value: AdminStatus; label: string }[] = [
		{ value: 'active', label: 'Hoạt động' },
		{ value: 'inactive', label: 'Không hoạt động' },
		{ value: 'suspended', label: 'Tạm dừng' },
		{ value: 'pending', label: 'Chờ duyệt' },
		{ value: 'locked', label: 'Khóa' }
	]

	useEffect(() => {
		if (editingAdmin) {
			setFormData({
				username: editingAdmin.username || '',
				email: editingAdmin.email || '',
				fullName: editingAdmin.fullName || '',
				role: editingAdmin.role || 'user_admin',
				permissions: editingAdmin.permissions || [],
				status: editingAdmin.status || 'pending',
				preferences: editingAdmin.preferences || {
					language: 'vi',
					timezone: 'Asia/Ho_Chi_Minh',
					theme: 'light',
					notifications: {
						email: true,
						push: true,
						sms: false
					},
					dashboard: {
						layout: 'grid',
						widgets: [],
						refreshInterval: 30
					},
					security: {
						sessionTimeout: 60,
						requirePasswordChange: true,
						passwordExpiryDays: 90
					}
				},
				metadata: editingAdmin.metadata || {
					department: '',
					phone: '',
					address: '',
					bio: '',
					skills: [],
					certifications: [],
					notes: '',
					tags: []
				}
			})
		} else {
			// Reset form for new admin
			setFormData({
				username: '',
				email: '',
				fullName: '',
				role: 'user_admin',
				permissions: [],
				status: 'pending',
				preferences: {
					language: 'vi',
					timezone: 'Asia/Ho_Chi_Minh',
					theme: 'light',
					notifications: {
						email: true,
						push: true,
						sms: false
					},
					dashboard: {
						layout: 'grid',
						widgets: [],
						refreshInterval: 30
					},
					security: {
						sessionTimeout: 60,
						requirePasswordChange: true,
						passwordExpiryDays: 90
					}
				},
				metadata: {
					department: '',
					phone: '',
					address: '',
					bio: '',
					skills: [],
					certifications: [],
					notes: '',
					tags: []
				}
			})
		}
		setErrors({})
	}, [editingAdmin, isOpen])

	const handleRoleChange = (role: AdminRole) => {
		const selectedRole = roleOptions.find(r => r.value === role)
		setFormData(prev => ({
			...prev,
			role,
			permissions: selectedRole?.permissions || []
		}))
	}

	const handlePermissionToggle = (permission: AdminPermission) => {
		setFormData(prev => ({
			...prev,
			permissions: prev.permissions.includes(permission)
				? prev.permissions.filter(p => p !== permission)
				: [...prev.permissions, permission]
		}))
	}

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {}

		if (!formData.username.trim()) {
			newErrors.username = 'Tên đăng nhập là bắt buộc'
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email là bắt buộc'
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email không hợp lệ'
		}

		if (!formData.fullName.trim()) {
			newErrors.fullName = 'Họ tên là bắt buộc'
		}

		if (formData.permissions.length === 0) {
			newErrors.permissions = 'Phải chọn ít nhất một quyền'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (validateForm()) {
			onSave(formData)
		}
	}

	const handleInputChange = (field: string, value: any) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
	}

	const handleMetadataChange = (field: string, value: any) => {
		setFormData(prev => ({
			...prev,
			metadata: {
				...prev.metadata,
				[field]: value
			}
		}))
	}

	const selectedRole = roleOptions.find(r => r.value === formData.role)

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={editingAdmin ? 'Chỉnh sửa Admin' : 'Thêm Admin mới'}
			maxWidth="900px"
			footer={
				<>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={onClose}
					>
						<X size={18} />
						Hủy
					</button>
					<button
						type="submit"
						form="admin-form"
						className="btn btn-primary"
					>
						<Save size={18} />
						{editingAdmin ? 'Cập nhật' : 'Tạo mới'}
					</button>
				</>
			}
		>
			<div className="modal-content-wrapper">
				<form id="admin-form" onSubmit={handleSubmit}>
					{/* Basic Information */}
					<div className="modal-form-section">
						<div className="section-title">
							<User />
							<h4>Thông tin cơ bản</h4>
						</div>
						
						<div className="modal-form-row">
							<div className="modal-form-group">
								<label className="form-label">
									<UserCheck />
									Tên đăng nhập *
								</label>
								<input
									type="text"
									value={formData.username}
									onChange={(e) => handleInputChange('username', e.target.value)}
									className={`form-input ${errors.username ? 'error' : ''}`}
									placeholder="Nhập tên đăng nhập"
								/>
								{errors.username && <span className="error-message">{errors.username}</span>}
							</div>
							<div className="modal-form-group">
								<label className="form-label">
									<Mail />
									Email *
								</label>
								<input
									type="email"
									value={formData.email}
									onChange={(e) => handleInputChange('email', e.target.value)}
									className={`form-input ${errors.email ? 'error' : ''}`}
									placeholder="Nhập email"
								/>
								{errors.email && <span className="error-message">{errors.email}</span>}
							</div>
						</div>
						
						<div className="modal-form-row">
							<div className="modal-form-group">
								<label className="form-label">
									<User />
									Họ và tên *
								</label>
								<input
									type="text"
									value={formData.fullName}
									onChange={(e) => handleInputChange('fullName', e.target.value)}
									className={`form-input ${errors.fullName ? 'error' : ''}`}
									placeholder="Nhập họ và tên"
								/>
								{errors.fullName && <span className="error-message">{errors.fullName}</span>}
							</div>
							<div className="modal-form-group">
								<label className="form-label">
									<UserCheck />
									Trạng thái
								</label>
								<select
									value={formData.status}
									onChange={(e) => handleInputChange('status', e.target.value as AdminStatus)}
									className="form-select"
								>
									{statusOptions.map(option => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>

					{/* Role and Permissions */}
					<div className="modal-form-section">
						<div className="section-title">
							<Shield />
							<h4>Vai trò và quyền hạn</h4>
						</div>
						
						<div className="modal-form-group">
							<label className="form-label">
								<Shield />
								Vai trò
							</label>
							<select
								value={formData.role}
								onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
								className="form-select"
							>
								{roleOptions.map(option => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div className="modal-form-group">
							<label className="form-label">
								<Settings />
								Quyền hạn
							</label>
							{errors.permissions && <span className="error-message">{errors.permissions}</span>}
							<div className="modal-checkbox-group">
								{selectedRole?.permissions.map(permission => (
									<div key={permission} className="checkbox-item">
										<label className="checkbox-label">
											<input
												type="checkbox"
												checked={formData.permissions.includes(permission)}
												onChange={() => handlePermissionToggle(permission)}
											/>
											<span>{permission.replace(/_/g, ' ')}</span>
										</label>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Additional Information */}
					<div className="modal-form-section">
						<div className="section-title">
							<Settings />
							<h4>Thông tin bổ sung</h4>
						</div>
						
						<div className="modal-form-row">
							<div className="modal-form-group">
								<label className="form-label">
									<Building2 />
									Phòng ban
								</label>
								<input
									type="text"
									value={formData.metadata.department || ''}
									onChange={(e) => handleMetadataChange('department', e.target.value)}
									className="form-input"
									placeholder="Nhập phòng ban"
								/>
							</div>
							<div className="modal-form-group">
								<label className="form-label">
									<Phone />
									Số điện thoại
								</label>
								<input
									type="tel"
									value={formData.metadata.phone || ''}
									onChange={(e) => handleMetadataChange('phone', e.target.value)}
									className="form-input"
									placeholder="Nhập số điện thoại"
								/>
							</div>
						</div>
						
						<div className="modal-form-group">
							<label className="form-label">
								<Building2 />
								Địa chỉ
							</label>
							<input
								type="text"
								value={formData.metadata.address || ''}
								onChange={(e) => handleMetadataChange('address', e.target.value)}
								className="form-input"
								placeholder="Nhập địa chỉ"
							/>
						</div>
						
						<div className="modal-form-group">
							<label className="form-label">
								<User />
								Giới thiệu
							</label>
							<textarea
								value={formData.metadata.bio || ''}
								onChange={(e) => handleMetadataChange('bio', e.target.value)}
								className="form-textarea"
								placeholder="Nhập giới thiệu"
								rows={3}
							/>
						</div>
					</div>
				</form>
			</div>
		</Modal>
	)
}

export default AddAdminModal
