import React from 'react'
import UserTableRow from './UserTableRow'
import { User } from '../../types/user'
import '../../styles/table.css'

interface UserTableProps {
	users: User[]
	loading?: boolean
	onEdit: (user: User) => void
	onDelete: (user: User) => void
	onToggleStatus: (user: User) => void
	onSort?: (key: string) => void
	sortKey?: string
	sortOrder?: 'asc' | 'desc'
}

export default function UserTable({
	users,
	loading = false,
	onEdit,
	onDelete,
	onToggleStatus,
	onSort,
	sortKey,
	sortOrder
}: UserTableProps): JSX.Element {
	
	const columns = [
		{ key: 'name', label: 'Người dùng', sortable: true },
		{ key: 'role', label: 'Vai trò', sortable: true, width: '120px' },
		{ key: 'department', label: 'Phòng ban', sortable: true },
		{ key: 'phone', label: 'Số điện thoại', width: '140px' },
		{ key: 'status', label: 'Trạng thái', sortable: true, width: '140px' },
		{ key: 'lastLogin', label: 'Đăng nhập lần cuối', sortable: true, width: '180px' },
		{ key: 'actions', label: 'Hành động', width: '160px' }
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

	if (users.length === 0) {
		return (
			<div className="admin-table-empty">
				<div className="admin-table-empty-icon">📭</div>
				<div className="admin-table-empty-text">Không tìm thấy người dùng nào</div>
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
				{users.map((user) => (
					<UserTableRow
						key={user.id}
						user={user}
						onEdit={onEdit}
						onDelete={onDelete}
						onToggleStatus={onToggleStatus}
					/>
				))}
			</tbody>
		</table>
	)
}

