// Types cho User trong hệ thống admin

export interface User {
	id: string
	name: string
	email: string
	role: UserRole
	status: UserStatus
	avatar?: string
	phone?: string
	createdAt: string
	lastLogin?: string
	department?: string
}

export type UserRole = 'admin' | 'user' | 'teacher' | 'student'

export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface UserFilters {
	search: string
	role: UserRole | 'all'
	status: UserStatus | 'all'
}

export interface UserTableColumn {
	key: string
	label: string
	sortable?: boolean
	width?: string
}

