// Mock data cho Dashboard tổng quan

import { DashboardData, UserGrowthData, CourseCategoryData, RecentActivity, TopPerformer, SystemHealth, SystemAlert } from '../types/dashboard'

// Dữ liệu tăng trưởng người dùng (30 ngày gần nhất)
export const mockUserGrowthData: UserGrowthData[] = Array.from({ length: 30 }, (_, i) => {
	const date = new Date()
	date.setDate(date.getDate() - (29 - i))
	
	const baseUsers = 15000 + i * 50
	const newUsers = Math.floor(Math.random() * 100) + 20
	const activeUsers = Math.floor(baseUsers * (0.6 + Math.random() * 0.2))
	
	return {
		date: date.toISOString().split('T')[0],
		users: baseUsers,
		newUsers,
		activeUsers
	}
})

// Dữ liệu phân bổ khóa học theo danh mục
export const mockCourseCategoryData: CourseCategoryData[] = [
	{
		category: 'Phát triển Web',
		courses: 45,
		enrollments: 12500,
		revenue: 125000000,
		color: '#3b82f6',
		icon: '🌐'
	},
	{
		category: 'Lập trình Mobile',
		courses: 32,
		enrollments: 8900,
		revenue: 89000000,
		color: '#10b981',
		icon: '📱'
	},
	{
		category: 'Data Science',
		courses: 28,
		enrollments: 7200,
		revenue: 72000000,
		color: '#f59e0b',
		icon: '📊'
	},
	{
		category: 'AI & Machine Learning',
		courses: 25,
		enrollments: 6800,
		revenue: 68000000,
		color: '#8b5cf6',
		icon: '🤖'
	},
	{
		category: 'DevOps',
		courses: 20,
		enrollments: 5200,
		revenue: 52000000,
		color: '#ef4444',
		icon: '⚙️'
	},
	{
		category: 'UI/UX Design',
		courses: 18,
		enrollments: 4800,
		revenue: 48000000,
		color: '#ec4899',
		icon: '🎨'
	},
	{
		category: 'Blockchain',
		courses: 15,
		enrollments: 3800,
		revenue: 38000000,
		color: '#06b6d4',
		icon: '⛓️'
	},
	{
		category: 'Cybersecurity',
		courses: 12,
		enrollments: 3200,
		revenue: 32000000,
		color: '#84cc16',
		icon: '🔒'
	}
]

// Hoạt động gần đây
export const mockRecentActivities: RecentActivity[] = [
	{
		id: 'act-1',
		type: 'user_registration',
		title: 'Người dùng mới đăng ký',
		description: 'Nguyễn Văn A đã đăng ký tài khoản',
		user: 'Nguyễn Văn A',
		timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
		status: 'success'
	},
	{
		id: 'act-2',
		type: 'course_enrollment',
		title: 'Đăng ký khóa học',
		description: 'Trần Thị B đã đăng ký khóa học React Nâng cao',
		user: 'Trần Thị B',
		course: 'React Nâng cao',
		timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
		status: 'success'
	},
	{
		id: 'act-3',
		type: 'course_completion',
		title: 'Hoàn thành khóa học',
		description: 'Lê Văn C đã hoàn thành khóa học JavaScript Cơ bản',
		user: 'Lê Văn C',
		course: 'JavaScript Cơ bản',
		timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
		status: 'success',
		metadata: { certificateIssued: true, tokensEarned: 500 }
	},
	{
		id: 'act-4',
		type: 'course_published',
		title: 'Khóa học mới được xuất bản',
		description: 'Khóa học Vue.js 3 được xuất bản bởi giảng viên Phạm Thị D',
		course: 'Vue.js 3',
		timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
		status: 'success'
	},
	{
		id: 'act-5',
		type: 'payment_received',
		title: 'Thanh toán thành công',
		description: 'Hoàng Văn E đã thanh toán 2,500,000 LEARN cho khóa học Node.js',
		user: 'Hoàng Văn E',
		course: 'Node.js',
		timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		status: 'success',
		metadata: { amount: 2500000, tokenSymbol: 'LEARN' }
	},
	{
		id: 'act-6',
		type: 'certificate_issued',
		title: 'Chứng chỉ được cấp',
		description: 'Chứng chỉ hoàn thành khóa học Python được cấp cho Vũ Thị F',
		user: 'Vũ Thị F',
		course: 'Python',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		status: 'success',
		metadata: { certificateId: 'CERT-2024-001' }
	},
	{
		id: 'act-7',
		type: 'review_submitted',
		title: 'Đánh giá khóa học',
		description: 'Đặng Văn G đã đánh giá 5 sao cho khóa học React Nâng cao',
		user: 'Đặng Văn G',
		course: 'React Nâng cao',
		timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
		status: 'success',
		metadata: { rating: 5, review: 'Khóa học rất hay và bổ ích!' }
	},
	{
		id: 'act-8',
		type: 'system_alert',
		title: 'Cảnh báo hệ thống',
		description: 'Tỷ lệ lỗi API tăng cao trong 10 phút qua',
		timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
		status: 'warning',
		metadata: { errorRate: 5.2, threshold: 3.0 }
	},
	{
		id: 'act-9',
		type: 'admin_action',
		title: 'Hành động quản trị',
		description: 'Admin đã cập nhật cài đặt hệ thống thưởng token',
		timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
		status: 'info'
	},
	{
		id: 'act-10',
		type: 'course_updated',
		title: 'Cập nhật khóa học',
		description: 'Khóa học Angular được cập nhật thêm 3 bài học mới',
		course: 'Angular',
		timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
		status: 'info'
	}
]

// Top performers
export const mockTopPerformers: TopPerformer[] = [
	{
		id: 'perf-1',
		name: 'React Nâng cao',
		type: 'course',
		value: 12500,
		unit: 'học viên',
		growth: 15.2,
		avatar: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop&crop=face',
		metadata: { category: 'Phát triển Web', rating: 4.8 }
	},
	{
		id: 'perf-2',
		name: 'Nguyễn Văn A',
		type: 'instructor',
		value: 8,
		unit: 'khóa học',
		growth: 12.5,
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
		metadata: { students: 2500, rating: 4.9 }
	},
	{
		id: 'perf-3',
		name: 'Trần Thị B',
		type: 'student',
		value: 15,
		unit: 'khóa học',
		growth: 8.3,
		avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
		metadata: { certificates: 12, tokens: 15000 }
	},
	{
		id: 'perf-4',
		name: 'JavaScript Cơ bản',
		type: 'course',
		value: 9800,
		unit: 'học viên',
		growth: 22.1,
		avatar: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=100&h=100&fit=crop&crop=face',
		metadata: { category: 'Phát triển Web', rating: 4.7 }
	},
	{
		id: 'perf-5',
		name: 'Lê Văn C',
		type: 'instructor',
		value: 6,
		unit: 'khóa học',
		growth: 18.7,
		avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
		metadata: { students: 1800, rating: 4.8 }
	}
]

// System health
export const mockSystemAlerts: SystemAlert[] = [
	{
		id: 'alert-1',
		type: 'performance',
		severity: 'medium',
		title: 'Thời gian phản hồi API chậm',
		message: 'Thời gian phản hồi trung bình vượt quá 2 giây',
		timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		resolved: false
	},
	{
		id: 'alert-2',
		type: 'security',
		severity: 'low',
		title: 'Đăng nhập bất thường',
		message: 'Phát hiện đăng nhập từ địa chỉ IP mới',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		resolved: true
	},
	{
		id: 'alert-3',
		type: 'error',
		severity: 'high',
		title: 'Lỗi kết nối database',
		message: 'Mất kết nối với database chính trong 5 phút',
		timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
		resolved: true
	}
]

export const mockSystemHealth: SystemHealth = {
	status: 'healthy',
	uptime: 99.8,
	responseTime: 1.2,
	errorRate: 0.8,
	lastUpdate: new Date().toISOString(),
	alerts: mockSystemAlerts
}

// Dữ liệu dashboard tổng hợp
export const mockDashboardData: DashboardData = {
	stats: {
		totalUsers: 15680,
		totalCourses: 195,
		totalEnrollments: 52800,
		totalRevenue: 528000000,
		activeUsers: 12500,
		publishedCourses: 168,
		todayEnrollments: 245,
		todayRevenue: 2450000,
		userGrowthRate: 12.5,
		courseGrowthRate: 8.3,
		enrollmentGrowthRate: 15.2,
		revenueGrowthRate: 18.7
	},
	userGrowth: mockUserGrowthData,
	courseCategories: mockCourseCategoryData,
	recentActivities: mockRecentActivities,
	topPerformers: mockTopPerformers,
	systemHealth: mockSystemHealth,
	chartData: {
		userGrowth: {
			labels: mockUserGrowthData.map(d => new Date(d.date).toLocaleDateString()),
			datasets: [
				{
					label: 'Tổng người dùng',
					data: mockUserGrowthData.map(d => d.users),
					backgroundColor: 'rgba(59, 130, 246, 0.1)',
					borderColor: 'rgba(59, 130, 246, 1)',
					borderWidth: 2,
					fill: true,
					tension: 0.4
				},
				{
					label: 'Người dùng mới',
					data: mockUserGrowthData.map(d => d.newUsers),
					backgroundColor: 'rgba(16, 185, 129, 0.1)',
					borderColor: 'rgba(16, 185, 129, 1)',
					borderWidth: 2,
					fill: false,
					tension: 0.4
				}
			]
		},
		courseCategories: {
			labels: mockCourseCategoryData.map(d => d.category),
			datasets: [
				{
					label: 'Số khóa học',
					data: mockCourseCategoryData.map(d => d.courses),
					backgroundColor: mockCourseCategoryData.map(d => d.color + '40'),
					borderColor: mockCourseCategoryData.map(d => d.color),
					borderWidth: 2
				}
			]
		},
		revenueTrend: {
			labels: mockUserGrowthData.map(d => new Date(d.date).toLocaleDateString()),
			datasets: [
				{
					label: 'Doanh thu (LEARN)',
					data: mockUserGrowthData.map((_, i) => Math.floor(Math.random() * 5000000) + 2000000),
					backgroundColor: 'rgba(245, 158, 11, 0.1)',
					borderColor: 'rgba(245, 158, 11, 1)',
					borderWidth: 2,
					fill: true,
					tension: 0.4
				}
			]
		}
	}
}
