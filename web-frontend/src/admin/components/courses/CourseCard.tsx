import React from 'react'
import { type Course as ApiCourse } from '../../../services/api/courseApi'
import Badge from '../common/Badge'
import '../../styles/courses.css'
import { Edit, Trash2, Eye, Play, Pause, Calendar, Hash, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface CourseCardProps {
	course: ApiCourse
	onClick?: (course: ApiCourse) => void
	onEdit?: (course: ApiCourse) => void
	onDelete?: (courseId: string) => void
	onToggleStatus?: (courseId: string) => void
}

const visibilityVariantMap: Record<ApiCourse['visibility'], Parameters<typeof Badge>[0]['variant']> = {
	draft: 'warning',
	published: 'success',
	archived: 'secondary',
	suspended: 'danger',
	private: 'secondary'
}

const visibilityLabelMap: Record<ApiCourse['visibility'], string> = {
	draft: 'Bản nháp',
	published: 'Đã xuất bản',
	archived: 'Đã lưu trữ',
	suspended: 'Tạm dừng',
	private: 'Riêng tư'
}

const fallbackThumbnail =
	'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="280" height="160"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16" fill="%2394a3b8">No thumbnail</text></svg>'

const truncate = (value: string, length = 160) => {
	if (!value) return ''
	return value.length <= length ? value : `${value.slice(0, length)}…`
}

export default function CourseCard({ course, onClick, onEdit, onDelete, onToggleStatus }: CourseCardProps): JSX.Element {
	const isPublished = course.visibility === 'published'
	const visibilityVariant = visibilityVariantMap[course.visibility] ?? 'secondary'
	const visibilityLabel = visibilityLabelMap[course.visibility] ?? course.visibility
	const updatedAt = course.updatedAt
		? formatDistanceToNow(new Date(course.updatedAt), { addSuffix: true, locale: vi })
		: 'Không xác định'

	const handleCardClick = () => {
		onClick?.(course)
	}

	const handleEditClick = (event: React.MouseEvent) => {
		event.stopPropagation()
		onEdit?.(course)
	}

	const handleDeleteClick = (event: React.MouseEvent) => {
		event.stopPropagation()
		onDelete?.(course.id)
	}

	const handleToggleStatusClick = (event: React.MouseEvent) => {
		event.stopPropagation()
		onToggleStatus?.(course.id)
	}

	return (
		<div className="course-card" onClick={handleCardClick}>
			<div className="course-overlay">
				<div className="course-actions">
					<button
						type="button"
						className="course-action-btn course-action-btn--view"
						title="Xem chi tiết"
						onClick={handleCardClick}
					>
						<Eye size={16} />
					</button>
					<button
						type="button"
						className="course-action-btn course-action-btn--edit"
						title="Chỉnh sửa"
						onClick={handleEditClick}
					>
						<Edit size={16} />
					</button>
					<button
						type="button"
						className={`course-action-btn ${isPublished ? 'course-action-btn--pause' : 'course-action-btn--publish'}`}
						title={isPublished ? 'Chuyển về nháp' : 'Xuất bản khóa học'}
						onClick={handleToggleStatusClick}
					>
						{isPublished ? <Pause size={18} /> : <Play size={18} />}
					</button>
					<button
						type="button"
						className="course-action-btn course-action-btn--delete"
						title="Xóa khóa học"
						onClick={handleDeleteClick}
					>
						<Trash2 size={16} />
					</button>
				</div>
			</div>

			<div className="course-hero">
				<img
					src={course.thumbnailUrl || fallbackThumbnail}
					alt={course.title}
					className="course-hero-thumbnail"
				/>
				<div className="course-hero-top">
					<Badge variant={visibilityVariant}>{visibilityLabel}</Badge>
				</div>
				<h3 className="course-hero-title">{course.title}</h3>
			</div>

			<div className="course-content">
				<p className="course-description">{truncate(course.description)}</p>

				<div className="course-meta-simple">
					<div className="meta-item">
						<User size={14} />
						<span>Org {(course as any).organizationId || '—'}</span>
					</div>
					{course.slug && (
						<div className="meta-item">
							<Hash size={14} />
							<span>{course.slug}</span>
						</div>
					)}
					<div className="meta-item">
						<Calendar size={14} />
						<span>Cập nhật {updatedAt}</span>
					</div>
				</div>
			</div>
		</div>
	)
}
