import { User } from '../types/user'

// Mock data cho Users
export const mockUsers: User[] = [
	{
		id: '1',
		name: 'Nguyễn Văn An',
		email: 'nguyen.van.an@eduplatform.vn',
		role: 'admin',
		status: 'active',
		avatar: 'https://i.pravatar.cc/150?img=1',
		phone: '0901234567',
		createdAt: '2024-01-15T08:30:00Z',
		lastLogin: '2024-03-20T14:25:00Z',
		department: 'Quản trị hệ thống'
	},
	{
		id: '2',
		name: 'Trần Thị Bình',
		email: 'tran.thi.binh@eduplatform.vn',
		role: 'teacher',
		status: 'active',
		avatar: 'https://i.pravatar.cc/150?img=2',
		phone: '0912345678',
		createdAt: '2024-01-20T09:15:00Z',
		lastLogin: '2024-03-21T10:30:00Z',
		department: 'Khoa Công nghệ thông tin'
	},
	{
		id: '3',
		name: 'Lê Minh Cường',
		email: 'le.minh.cuong@student.edu.vn',
		role: 'student',
		status: 'active',
		avatar: 'https://i.pravatar.cc/150?img=3',
		phone: '0923456789',
		createdAt: '2024-02-01T10:00:00Z',
		lastLogin: '2024-03-21T16:45:00Z',
		department: 'Khoa Công nghệ thông tin'
	},
	{
		id: '4',
		name: 'Phạm Thị Dung',
		email: 'pham.thi.dung@eduplatform.vn',
		role: 'teacher',
		status: 'active',
		avatar: 'https://i.pravatar.cc/150?img=4',
		phone: '0934567890',
		createdAt: '2024-02-05T11:20:00Z',
		lastLogin: '2024-03-20T09:15:00Z',
		department: 'Khoa Kinh tế'
	},
	{
		id: '5',
		name: 'Hoàng Văn Em',
		email: 'hoang.van.em@student.edu.vn',
		role: 'student',
		status: 'inactive',
		avatar: 'https://i.pravatar.cc/150?img=5',
		phone: '0945678901',
		createdAt: '2024-02-10T14:30:00Z',
		lastLogin: '2024-03-10T08:20:00Z',
		department: 'Khoa Kinh tế'
	},
	{
		id: '6',
		name: 'Đỗ Thị Phương',
		email: 'do.thi.phuong@eduplatform.vn',
		role: 'user',
		status: 'active',
		avatar: 'https://i.pravatar.cc/150?img=6',
		phone: '0956789012',
		createdAt: '2024-02-15T15:45:00Z',
		lastLogin: '2024-03-21T11:30:00Z',
		department: 'Phòng Hành chính'
	},
	{
		id: '7',
		name: 'Vũ Minh Giang',
		email: 'vu.minh.giang@student.edu.vn',
		role: 'student',
		status: 'suspended',
		avatar: 'https://i.pravatar.cc/150?img=7',
		phone: '0967890123',
		createdAt: '2024-02-20T08:00:00Z',
		lastLogin: '2024-03-01T13:20:00Z',
		department: 'Khoa Công nghệ thông tin'
	},
	{
		id: '8',
		name: 'Ngô Thị Hà',
		email: 'ngo.thi.ha@eduplatform.vn',
		role: 'teacher',
		status: 'active',
		avatar: 'https://i.pravatar.cc/150?img=8',
		phone: '0978901234',
		createdAt: '2024-02-25T09:30:00Z',
		lastLogin: '2024-03-21T15:10:00Z',
		department: 'Khoa Ngoại ngữ'
	},
	{
		id: '9',
		name: 'Bùi Văn Ích',
		email: 'bui.van.ich@student.edu.vn',
		role: 'student',
		status: 'active',
		avatar: 'https://i.pravatar.cc/150?img=9',
		phone: '0989012345',
		createdAt: '2024-03-01T10:15:00Z',
		lastLogin: '2024-03-21T17:30:00Z',
		department: 'Khoa Ngoại ngữ'
	},
	{
		id: '10',
		name: 'Lý Thị Kim',
		email: 'ly.thi.kim@eduplatform.vn',
		role: 'admin',
		status: 'active',
		avatar: 'https://i.pravatar.cc/150?img=10',
		phone: '0990123456',
		createdAt: '2024-03-05T11:00:00Z',
		lastLogin: '2024-03-21T12:45:00Z',
		department: 'Quản trị hệ thống'
	},
	{
		id: '11',
		name: 'Trương Minh Long',
		email: 'truong.minh.long@student.edu.vn',
		role: 'student',
		status: 'active',
		avatar: 'https://i.pravatar.cc/150?img=11',
		phone: '0901234568',
		createdAt: '2024-03-08T13:20:00Z',
		lastLogin: '2024-03-21T09:00:00Z',
		department: 'Khoa Công nghệ thông tin'
	},
	{
		id: '12',
		name: 'Mai Thị Nhung',
		email: 'mai.thi.nhung@eduplatform.vn',
		role: 'user',
		status: 'inactive',
		avatar: 'https://i.pravatar.cc/150?img=12',
		phone: '0912345679',
		createdAt: '2024-03-10T14:40:00Z',
		lastLogin: '2024-03-15T10:20:00Z',
		department: 'Phòng Kế toán'
	}
]

// Hàm helper để lấy users
export function getAllUsers(): User[] {
	return mockUsers
}

export function getUserById(id: string): User | undefined {
	return mockUsers.find(user => user.id === id)
}

export function getUsersByRole(role: string): User[] {
	if (role === 'all') return mockUsers
	return mockUsers.filter(user => user.role === role)
}

export function getUsersByStatus(status: string): User[] {
	if (status === 'all') return mockUsers
	return mockUsers.filter(user => user.status === status)
}

