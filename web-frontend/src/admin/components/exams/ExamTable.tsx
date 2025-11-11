import React from 'react'
import ExamTableRow from './ExamTableRow'
import { Exam } from '../../types/exam'
import '../../styles/table.css'

interface ExamTableProps {
	exams: Exam[]
	loading?: boolean
	onEdit: (exam: Exam) => void
	onDelete: (exam: Exam) => void
	onView: (exam: Exam) => void
	onDuplicate: (exam: Exam) => void
	onPublish?: (exam: Exam) => void // ✨ NEW
	onUnpublish?: (exam: Exam) => void // ✨ NEW
	onSort?: (key: string) => void
	sortKey?: string
	sortOrder?: 'asc' | 'desc'
}

export default function ExamTable({
	exams,
	loading = false,
	onEdit,
	onDelete,
	onView,
	onDuplicate,
	onPublish,
	onUnpublish,
	onSort,
	sortKey,
	sortOrder
}: ExamTableProps): JSX.Element {
	
	const columns = [
		{ key: 'title', label: 'Tiêu đề', sortable: true },
		{ key: 'type', label: 'Loại', sortable: true, width: '120px' },
		{ key: 'assignedQuestionCount', label: 'Câu hỏi (đã gán / mục tiêu)', sortable: true, width: '170px' },
		{ key: 'duration', label: 'Thời gian', sortable: true, width: '110px' },
		{ key: 'totalPoints', label: 'Tổng điểm', sortable: true, width: '110px' },
		{ key: 'difficulty', label: 'Độ khó', sortable: true, width: '130px' },
		{ key: 'status', label: 'Trạng thái', sortable: true, width: '140px' },
		{ key: 'createdAt', label: 'Ngày tạo', sortable: true, width: '150px' },
		{ key: 'actions', label: 'Hành động', width: '180px' }
	]

	const handleSort = (key: string) => {
		if (onSort) {
			onSort(key)
		}
	}

	if (loading) {
		return (
			<div className="admin-table-empty">
				<div className="admin-table-empty-icon">⏳</div>
				<div className="admin-table-empty-text">Đang tải dữ liệu...</div>
			</div>
		)
	}

	if (exams.length === 0) {
		return (
			<div className="admin-table-empty">
				<div className="admin-table-empty-icon">📭</div>
				<div className="admin-table-empty-text">Không tìm thấy bài thi nào</div>
			</div>
		)
	}

	return (
		<table className="admin-table">
			<thead>
				<tr>
					{columns.map((column) => (
						<th
							key={column.key}
							className={column.sortable ? 'sortable' : ''}
							style={{ width: column.width }}
							onClick={() => column.sortable && handleSort(column.key)}
						>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								{column.label}
								{column.sortable && sortKey === column.key && (
									<span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
								)}
							</div>
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{exams.map((exam) => (
					<ExamTableRow
						key={exam.id}
						exam={exam}
						onEdit={onEdit}
						onDelete={onDelete}
						onView={onView}
						onDuplicate={onDuplicate}
						onPublish={onPublish} // ✨ NEW
						onUnpublish={onUnpublish} // ✨ NEW
					/>
				))}
			</tbody>
		</table>
	)
}

