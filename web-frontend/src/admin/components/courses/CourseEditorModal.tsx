import React, { useState, useEffect } from 'react'
import { type CourseForm } from '../../types/course'
import { type Course as ApiCourse, type CourseVisibility } from '../../../services/api/courseApi'
import Modal from '../common/Modal'
import { Save, X } from 'lucide-react'

interface CourseEditorModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (course: CourseForm) => void
    editingCourse?: ApiCourse | null
	title?: string
}

const visibilityOptions: Array<{ value: CourseVisibility; label: string }> = [
	{ value: 'draft', label: 'Bản nháp' },
	{ value: 'private', label: 'Riêng tư' },
	{ value: 'published', label: 'Đã xuất bản' },
	{ value: 'archived', label: 'Đã lưu trữ' },
	{ value: 'suspended', label: 'Tạm dừng' }
]

const emptyForm: CourseForm = {
	title: '',
	description: '',
	instructorId: '',
	thumbnailUrl: '',
	visibility: 'draft'
}

const isValidVisibility = (value: any): value is CourseVisibility =>
	['draft', 'private', 'published', 'archived', 'suspended'].includes(value)

export default function CourseEditorModal({ 
	isOpen, 
	onClose, 
	onSave, 
	editingCourse,
	title = 'Thêm khóa học mới'
}: CourseEditorModalProps): JSX.Element {
	const [form, setForm] = useState<CourseForm>(emptyForm)
	const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
		if (editingCourse) {
			setForm({
				id: editingCourse.id,
				title: editingCourse.title ?? '',
				description: editingCourse.description ?? '',
				instructorId: editingCourse.instructorId ? String(editingCourse.instructorId) : '',
				thumbnailUrl: editingCourse.thumbnailUrl ?? '',
				visibility: isValidVisibility(editingCourse.visibility)
					? editingCourse.visibility
					: 'draft'
			})
		} else {
			setForm(emptyForm)
		}

		setErrors({})
	}, [editingCourse, isOpen])

	const validateForm = (): boolean => {
		const nextErrors: Record<string, string> = {}

		if (!form.title.trim()) {
			nextErrors.title = 'Tên khóa học không được để trống'
		}

		if (!form.description.trim()) {
			nextErrors.description = 'Mô tả không được để trống'
		}

		if (!form.instructorId.trim()) {
			nextErrors.instructorId = 'Vui lòng nhập ID giảng viên'
		} else if (Number.isNaN(Number(form.instructorId))) {
			nextErrors.instructorId = 'ID giảng viên phải là số'
		}

		if (!form.visibility) {
			nextErrors.visibility = 'Vui lòng chọn trạng thái hiển thị'
		}

		setErrors(nextErrors)
		return Object.keys(nextErrors).length === 0
	}

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!validateForm()) return

		onSave({
			...form,
			instructorId: form.instructorId.trim(),
		})
			onClose()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			footer={
				<>
					<button type="button" className="btn btn-secondary" onClick={onClose}>
						<X size={16} />
						Hủy
					</button>
					<button type="submit" form="course-editor-form" className="btn btn-primary">
						<Save size={16} />
						{editingCourse ? 'Cập nhật' : 'Tạo mới'}
					</button>
				</>
			}
		>
			<div className="modal-content-wrapper">
				<form id="course-editor-form" onSubmit={handleSubmit}>
					<div className="modal-form-section">
						<div className="section-title">
							<h4>Thông tin khóa học</h4>
						</div>
						
						<div className="modal-form-group">
							<label className="form-label">Tên khóa học <span className="required">*</span></label>
							<input
								type="text"
								className={`form-input ${errors.title ? 'error' : ''}`}
								value={form.title}
								onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
								placeholder="Nhập tên khóa học"
							/>
							{errors.title && <span className="error-message">{errors.title}</span>}
						</div>

						<div className="modal-form-group">
							<label className="form-label">Mô tả chi tiết <span className="required">*</span></label>
							<textarea
								className={`form-textarea ${errors.description ? 'error' : ''}`}
								value={form.description}
								onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
								rows={4}
								placeholder="Nhập mô tả chi tiết về khóa học"
							/>
							{errors.description && <span className="error-message">{errors.description}</span>}
							</div>

							<div className="modal-form-group">
							<label className="form-label">ID giảng viên <span className="required">*</span></label>
							<input
								type="number"
								className={`form-input ${errors.instructorId ? 'error' : ''}`}
									value={form.instructorId}
								onChange={(e) => setForm(prev => ({ ...prev, instructorId: e.target.value }))}
								placeholder="Nhập ID giảng viên"
								/>
								{errors.instructorId && <span className="error-message">{errors.instructorId}</span>}
						</div>

							<div className="modal-form-group">
							<label className="form-label">Ảnh đại diện</label>
								<input
									type="url"
									className="form-input"
								value={form.thumbnailUrl}
								onChange={(e) => setForm(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
								placeholder="https://example.com/thumbnail.jpg"
							/>
						</div>
						
						<div className="modal-form-group">
							<label className="form-label">Trạng thái hiển thị <span className="required">*</span></label>
							<select
								className={`form-input ${errors.visibility ? 'error' : ''}`}
								value={form.visibility}
								onChange={(e) => {
									const value = e.target.value
									setForm(prev => ({
										...prev,
										visibility: isValidVisibility(value) ? value : 'draft'
									}))
								}}
							>
								{visibilityOptions.map(option => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
							{errors.visibility && <span className="error-message">{errors.visibility}</span>}
						</div>

						{editingCourse?.slug && (
							<div className="modal-form-group">
								<label className="form-label">Slug (tự sinh)</label>
								<input type="text" className="form-input" value={editingCourse.slug} readOnly />
							</div>
						)}
					</div>
				</form>
			</div>
		</Modal>
	)
}
