import { useState, useMemo, useCallback } from 'react'
import { User, UserFilters, UserRole, UserStatus } from '../types/user'
import { mockUsers } from '../mock/users'

export default function useUsers() {
	const [users, setUsers] = useState<User[]>(mockUsers)
	const [filters, setFilters] = useState<UserFilters>({
		search: '',
		role: 'all',
		status: 'all'
	})
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage] = useState(10)
	const [sortKey, setSortKey] = useState<string>('name')
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

	// Lọc users theo filters
	const filteredUsers = useMemo(() => {
		let result = [...users]

		// Lọc theo search
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			result = result.filter(user => 
				user.name.toLowerCase().includes(searchLower) ||
				user.email.toLowerCase().includes(searchLower) ||
				user.phone?.toLowerCase().includes(searchLower) ||
				user.department?.toLowerCase().includes(searchLower)
			)
		}

		// Lọc theo role
		if (filters.role !== 'all') {
			result = result.filter(user => user.role === filters.role)
		}

		// Lọc theo status
		if (filters.status !== 'all') {
			result = result.filter(user => user.status === filters.status)
		}

		return result
	}, [users, filters])

	// Sắp xếp users
	const sortedUsers = useMemo(() => {
		const result = [...filteredUsers]

		result.sort((a, b) => {
			let aValue = a[sortKey as keyof User]
			let bValue = b[sortKey as keyof User]

			// Convert to string for comparison
			if (aValue === undefined) aValue = ''
			if (bValue === undefined) bValue = ''

			const aString = String(aValue).toLowerCase()
			const bString = String(bValue).toLowerCase()

			if (aString < bString) return sortOrder === 'asc' ? -1 : 1
			if (aString > bString) return sortOrder === 'asc' ? 1 : -1
			return 0
		})

		return result
	}, [filteredUsers, sortKey, sortOrder])

	// Phân trang
	const paginatedUsers = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage
		const endIndex = startIndex + itemsPerPage
		return sortedUsers.slice(startIndex, endIndex)
	}, [sortedUsers, currentPage, itemsPerPage])

	const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)

	// Cập nhật filter
	const updateFilter = useCallback((key: keyof UserFilters, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }))
		setCurrentPage(1) // Reset về trang 1 khi filter thay đổi
	}, [])

	// Sắp xếp
	const handleSort = useCallback((key: string) => {
		if (sortKey === key) {
			// Toggle sort order nếu cùng key
			setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
		} else {
			setSortKey(key)
			setSortOrder('asc')
		}
	}, [sortKey])

	// Xóa user
	const deleteUser = useCallback((userId: string) => {
		setUsers(prev => prev.filter(user => user.id !== userId))
	}, [])

	// Toggle status user
	const toggleUserStatus = useCallback((userId: string) => {
		setUsers(prev => prev.map(user => {
			if (user.id === userId) {
				const newStatus: UserStatus = user.status === 'active' ? 'inactive' : 'active'
				return { ...user, status: newStatus }
			}
			return user
		}))
	}, [])

	// Cập nhật user
	const updateUser = useCallback((updatedUser: User) => {
		setUsers(prev => prev.map(user => 
			user.id === updatedUser.id ? updatedUser : user
		))
	}, [])

	// Thêm user mới
	const addUser = useCallback((newUser: Omit<User, 'id' | 'createdAt'>) => {
		const user: User = {
			...newUser,
			id: String(Date.now()),
			createdAt: new Date().toISOString()
		}
		setUsers(prev => [user, ...prev])
	}, [])

	return {
		users: paginatedUsers,
		allUsers: sortedUsers,
		filters,
		updateFilter,
		currentPage,
		setCurrentPage,
		totalPages,
		totalItems: sortedUsers.length,
		itemsPerPage,
		sortKey,
		sortOrder,
		handleSort,
		deleteUser,
		toggleUserStatus,
		updateUser,
		addUser
	}
}

