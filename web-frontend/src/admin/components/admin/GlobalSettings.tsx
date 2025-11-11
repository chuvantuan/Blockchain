import React, { useState, useEffect } from 'react'
import { GlobalSettings as GlobalSettingsType, SettingsCategory, SettingsType } from '../../types/admin'
import { 
	Save, 
	RefreshCw, 
	Search, 
	Filter,
	Settings as SettingsIcon,
	Eye,
	EyeOff,
	AlertCircle,
	CheckCircle,
	Info,
	AlertTriangle,
	X,
	Plus,
	Edit,
	Trash2
} from 'lucide-react'
import Badge from '../common/Badge'

interface GlobalSettingsProps {
	settings: GlobalSettingsType[]
	onUpdateSetting: (settingId: string, value: any) => void
	onResetSetting: (settingId: string) => void
	onAddSetting: (setting: Partial<GlobalSettingsType>) => void
	onDeleteSetting: (settingId: string) => void
	loading?: boolean
}

export default function GlobalSettings({
	settings,
	onUpdateSetting,
	onResetSetting,
	onAddSetting,
	onDeleteSetting,
	loading = false
}: GlobalSettingsProps): JSX.Element {
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedCategory, setSelectedCategory] = useState<SettingsCategory | 'all'>('all')
	const [showPublicOnly, setShowPublicOnly] = useState(false)
	const [editingSetting, setEditingSetting] = useState<string | null>(null)
	const [editValue, setEditValue] = useState<any>('')
	const [showAddForm, setShowAddForm] = useState(false)
	const [newSetting, setNewSetting] = useState<Partial<GlobalSettingsType>>({
		category: 'general',
		name: '',
		key: '',
		value: '',
		type: 'string',
		description: '',
		isRequired: false,
		isPublic: false
	})

	const getCategoryLabel = (category: SettingsCategory) => {
		const labels: Record<SettingsCategory, string> = {
			general: 'Tổng quan',
			security: 'Bảo mật',
			email: 'Email',
			storage: 'Lưu trữ',
			api: 'API',
			notification: 'Thông báo',
			backup: 'Sao lưu',
			maintenance: 'Bảo trì',
			integration: 'Tích hợp',
			appearance: 'Giao diện'
		}
		return labels[category] || category
	}

	const getCategoryColor = (category: SettingsCategory) => {
		const colors: Record<SettingsCategory, string> = {
			general: 'var(--primary)',
			security: 'var(--danger)',
			email: 'var(--info)',
			storage: 'var(--warning)',
			api: 'var(--success)',
			notification: 'var(--accent)',
			backup: 'var(--secondary)',
			maintenance: 'var(--warning)',
			integration: 'var(--info)',
			appearance: 'var(--primary)'
		}
		return colors[category] || 'var(--muted-foreground)'
	}

	const getTypeLabel = (type: SettingsType) => {
		const labels: Record<SettingsType, string> = {
			string: 'Chuỗi',
			number: 'Số',
			boolean: 'Boolean',
			array: 'Mảng',
			object: 'Đối tượng',
			json: 'JSON',
			url: 'URL',
			email: 'Email',
			password: 'Mật khẩu',
			file: 'File'
		}
		return labels[type] || type
	}

	const filteredSettings = settings.filter(setting => {
		const matchesSearch = !searchTerm || 
			setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
			setting.description.toLowerCase().includes(searchTerm.toLowerCase())
		
		const matchesCategory = selectedCategory === 'all' || setting.category === selectedCategory
		const matchesPublic = !showPublicOnly || setting.isPublic

		return matchesSearch && matchesCategory && matchesPublic
	})

	const handleEditStart = (setting: GlobalSettingsType) => {
		setEditingSetting(setting.id)
		setEditValue(setting.value)
	}

	const handleEditSave = () => {
		if (editingSetting) {
			onUpdateSetting(editingSetting, editValue)
			setEditingSetting(null)
			setEditValue('')
		}
	}

	const handleEditCancel = () => {
		setEditingSetting(null)
		setEditValue('')
	}

	const handleAddSetting = () => {
		if (newSetting.name && newSetting.key && newSetting.value !== undefined) {
			onAddSetting(newSetting)
			setNewSetting({
				category: 'general',
				name: '',
				key: '',
				value: '',
				type: 'string',
				description: '',
				isRequired: false,
				isPublic: false
			})
			setShowAddForm(false)
		}
	}

	const renderValueInput = (setting: GlobalSettingsType, value: any, onChange: (value: any) => void) => {
		switch (setting.type) {
			case 'boolean':
				return (
					<input
						type="checkbox"
						checked={Boolean(value)}
						onChange={(e) => onChange(e.target.checked)}
						className="form-checkbox"
					/>
				)
			case 'number':
				return (
					<input
						type="number"
						value={value}
						onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
						className="form-input"
						min={setting.validation?.min}
						max={setting.validation?.max}
					/>
				)
			case 'email':
				return (
					<input
						type="email"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						className="form-input"
					/>
				)
			case 'url':
				return (
					<input
						type="url"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						className="form-input"
					/>
				)
			case 'password':
				return (
					<input
						type="password"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						className="form-input"
					/>
				)
			case 'json':
			case 'object':
				return (
					<textarea
						value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
						onChange={(e) => {
							try {
								onChange(JSON.parse(e.target.value))
							} catch {
								onChange(e.target.value)
							}
						}}
						className="form-textarea"
						rows={4}
					/>
				)
			case 'array':
				return (
					<div className="array-input">
						<input
							type="text"
							value={Array.isArray(value) ? value.join(', ') : ''}
							onChange={(e) => onChange(e.target.value.split(',').map(item => item.trim()))}
							className="form-input"
							placeholder="Nhập các giá trị cách nhau bởi dấu phẩy"
						/>
					</div>
				)
			default:
				return (
					<input
						type="text"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						className="form-input"
						minLength={setting.validation?.min}
						maxLength={setting.validation?.max}
					/>
				)
		}
	}

	const renderValueDisplay = (setting: GlobalSettingsType) => {
		const value = setting.value

		if (setting.type === 'password') {
			return '••••••••'
		}

		if (setting.type === 'boolean') {
			return (
				<Badge variant={value ? 'success' : 'secondary'}>
					{value ? 'Bật' : 'Tắt'}
				</Badge>
			)
		}

		if (setting.type === 'json' || setting.type === 'object') {
			return (
				<pre className="json-display">
					{JSON.stringify(value, null, 2)}
				</pre>
			)
		}

		if (setting.type === 'array') {
			return (
				<div className="array-display">
					{Array.isArray(value) ? value.map((item, index) => (
						<Badge key={index} variant="secondary">{String(item)}</Badge>
					)) : String(value)}
				</div>
			)
		}

		return String(value)
	}

	if (loading) {
		return (
			<div className="global-settings loading">
				<div className="loading-spinner"></div>
				<p>Đang tải cài đặt hệ thống...</p>
			</div>
		)
	}

	return (
		<div className="global-settings">
			{/* Header */}
			<div className="settings-header">
				<div className="settings-title">
					<SettingsIcon size={24} />
					<h2>Cài đặt Hệ thống</h2>
				</div>
				<div className="settings-actions">
					<button
						className="btn btn-primary"
						onClick={() => setShowAddForm(!showAddForm)}
					>
						<Plus size={16} />
						Thêm cài đặt
					</button>
				</div>
			</div>

			{/* Add Setting Form */}
			{showAddForm && (
				<div className="add-setting-form">
					<h3>Thêm cài đặt mới</h3>
					<div className="form-grid">
						<div className="form-group">
							<label>Tên cài đặt *</label>
							<input
								type="text"
								value={newSetting.name || ''}
								onChange={(e) => setNewSetting(prev => ({ ...prev, name: e.target.value }))}
								className="form-input"
								placeholder="Tên hiển thị của cài đặt"
							/>
						</div>
						<div className="form-group">
							<label>Key *</label>
							<input
								type="text"
								value={newSetting.key || ''}
								onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
								className="form-input"
								placeholder="setting.key.name"
							/>
						</div>
						<div className="form-group">
							<label>Danh mục</label>
							<select
								value={newSetting.category || 'general'}
								onChange={(e) => setNewSetting(prev => ({ ...prev, category: e.target.value as SettingsCategory }))}
								className="form-select"
							>
								{Object.values(['general', 'security', 'email', 'storage', 'api', 'notification', 'backup', 'maintenance', 'integration', 'appearance'] as SettingsCategory[]).map(category => (
									<option key={category} value={category}>
										{getCategoryLabel(category)}
									</option>
								))}
							</select>
						</div>
						<div className="form-group">
							<label>Kiểu dữ liệu</label>
							<select
								value={newSetting.type || 'string'}
								onChange={(e) => setNewSetting(prev => ({ ...prev, type: e.target.value as SettingsType }))}
								className="form-select"
							>
								{Object.values(['string', 'number', 'boolean', 'array', 'object', 'json', 'url', 'email', 'password', 'file'] as SettingsType[]).map(type => (
									<option key={type} value={type}>
										{getTypeLabel(type)}
									</option>
								))}
							</select>
						</div>
						<div className="form-group">
							<label>Giá trị</label>
							{renderValueInput(newSetting as GlobalSettingsType, newSetting.value, (value) => 
								setNewSetting(prev => ({ ...prev, value }))
							)}
						</div>
						<div className="form-group">
							<label>Mô tả</label>
							<textarea
								value={newSetting.description || ''}
								onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
								className="form-textarea"
								rows={3}
								placeholder="Mô tả chi tiết về cài đặt này"
							/>
						</div>
						<div className="form-group">
							<label className="checkbox-label">
								<input
									type="checkbox"
									checked={newSetting.isRequired || false}
									onChange={(e) => setNewSetting(prev => ({ ...prev, isRequired: e.target.checked }))}
								/>
								<span>Bắt buộc</span>
							</label>
						</div>
						<div className="form-group">
							<label className="checkbox-label">
								<input
									type="checkbox"
									checked={newSetting.isPublic || false}
									onChange={(e) => setNewSetting(prev => ({ ...prev, isPublic: e.target.checked }))}
								/>
								<span>Công khai</span>
							</label>
						</div>
					</div>
					<div className="form-actions">
						<button
							className="btn btn-secondary"
							onClick={() => setShowAddForm(false)}
						>
							Hủy
						</button>
						<button
							className="btn btn-primary"
							onClick={handleAddSetting}
						>
							<Save size={16} />
							Thêm
						</button>
					</div>
				</div>
			)}

			{/* Filters */}
			<div className="settings-filters">
				<div className="search-bar">
					<Search size={16} />
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Tìm kiếm cài đặt..."
						className="form-input"
					/>
				</div>
				<div className="filter-group">
					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value as SettingsCategory | 'all')}
						className="form-select"
					>
						<option value="all">Tất cả danh mục</option>
						{Object.values(['general', 'security', 'email', 'storage', 'api', 'notification', 'backup', 'maintenance', 'integration', 'appearance'] as SettingsCategory[]).map(category => (
							<option key={category} value={category}>
								{getCategoryLabel(category)}
							</option>
						))}
					</select>
				</div>
				<div className="filter-group">
					<label className="checkbox-label">
						<input
							type="checkbox"
							checked={showPublicOnly}
							onChange={(e) => setShowPublicOnly(e.target.checked)}
						/>
						<span>Chỉ hiện công khai</span>
					</label>
				</div>
			</div>

			{/* Settings List */}
			<div className="settings-list">
				{filteredSettings.map((setting) => (
					<div key={setting.id} className="setting-item">
						<div className="setting-header">
							<div className="setting-info">
								<div className="setting-name">
									{setting.name}
									{setting.isRequired && (
										<Badge variant="warning" style={{ marginLeft: '8px' }}>
											Bắt buộc
										</Badge>
									)}
									{setting.isPublic && (
										<Badge variant="info" style={{ marginLeft: '4px' }}>
											Công khai
										</Badge>
									)}
								</div>
								<div className="setting-key">{setting.key}</div>
								<div className="setting-description">{setting.description}</div>
							</div>
							<div className="setting-meta">
								<Badge 
									variant="secondary" 
									style={{ backgroundColor: getCategoryColor(setting.category) }}
								>
									{getCategoryLabel(setting.category)}
								</Badge>
								<Badge variant="secondary">
									{getTypeLabel(setting.type)}
								</Badge>
								<span className="setting-version">v{setting.version}</span>
							</div>
						</div>

						<div className="setting-content">
							<div className="setting-value">
								{editingSetting === setting.id ? (
									<div className="setting-edit">
										{renderValueInput(setting, editValue, setEditValue)}
										<div className="edit-actions">
											<button
												className="btn btn-sm btn-success"
												onClick={handleEditSave}
											>
												<CheckCircle size={14} />
											</button>
											<button
												className="btn btn-sm btn-secondary"
												onClick={handleEditCancel}
											>
												<X size={14} />
											</button>
										</div>
									</div>
								) : (
									<div className="setting-display">
										{renderValueDisplay(setting)}
									</div>
								)}
							</div>

							<div className="setting-actions">
								{editingSetting !== setting.id && (
									<button
										className="btn btn-sm btn-outline"
										onClick={() => handleEditStart(setting)}
										title="Chỉnh sửa"
									>
										<Edit size={14} />
									</button>
								)}
								<button
									className="btn btn-sm btn-outline"
									onClick={() => onResetSetting(setting.id)}
									title="Đặt lại"
								>
									<RefreshCw size={14} />
								</button>
								<button
									className="btn btn-sm btn-outline btn-danger"
									onClick={() => onDeleteSetting(setting.id)}
									title="Xóa"
								>
									<Trash2 size={14} />
								</button>
							</div>
						</div>

						<div className="setting-footer">
							<div className="setting-updated">
								Cập nhật bởi: {setting.updatedBy} - {new Date(setting.updatedAt).toLocaleString('vi-VN')}
							</div>
						</div>
					</div>
				))}
			</div>

			{filteredSettings.length === 0 && (
				<div className="settings-empty">
					<SettingsIcon size={48} />
					<h3>Không có cài đặt nào</h3>
					<p>Không tìm thấy cài đặt phù hợp với bộ lọc</p>
				</div>
			)}
		</div>
	)
}
