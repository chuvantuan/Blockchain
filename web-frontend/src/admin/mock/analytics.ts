// Mock data cho Analytics và Reporting

import { 
	KPIMetric, 
	AnalyticsChart, 
	TopListsWidget, 
	AnalyticsDashboard,
	RevenueData,
	UserGrowthData,
	CourseAnalytics,
	UserAnalytics,
	OrganizationAnalytics,
	InstructorAnalytics,
	CertificateAnalytics,
	EngagementMetrics,
	ConversionMetrics,
	GeographicData,
	DeviceAnalytics,
	TrafficSource,
	AnalyticsActivity,
	AnalyticsAlert,
	AnalyticsInsight,
	ReportConfig,
	AnalyticsComparison,
	AnalyticsSegment,
	AnalyticsGoal,
	AnalyticsBenchmark,
	ChartType,
	TopListType,
	ActivityType,
	AlertType,
	InsightType,
	ReportType,
	ReportFrequency
} from '../types/analytics'

// Mock KPI Metrics
export const mockKPIMetrics: KPIMetric[] = [
	{
		id: 'kpi-1',
		name: 'Tổng doanh thu',
		value: 1250000000, // 1.25B VND
		unit: 'VND',
		change: 12.5,
		changeType: 'increase',
		period: 'tháng này',
		icon: 'DollarSign',
		color: 'var(--success)',
		description: 'Tổng doanh thu từ tất cả nguồn',
		trend: [850000000, 920000000, 1050000000, 1180000000, 1250000000],
		threshold: {
			warning: 1000000000,
			critical: 800000000
		}
	},
	{
		id: 'kpi-2',
		name: 'Người dùng hoạt động',
		value: 15420,
		unit: 'người',
		change: 8.3,
		changeType: 'increase',
		period: 'tuần này',
		icon: 'Users',
		color: 'var(--primary)',
		description: 'Số người dùng đăng nhập trong 7 ngày qua',
		trend: [12800, 13200, 13800, 14500, 15420],
		threshold: {
			warning: 10000,
			critical: 5000
		}
	},
	{
		id: 'kpi-3',
		name: 'Tỷ lệ hoàn thành',
		value: 78.5,
		unit: '%',
		change: -2.1,
		changeType: 'decrease',
		period: 'tháng này',
		icon: 'CheckCircle',
		color: 'var(--warning)',
		description: 'Tỷ lệ hoàn thành khóa học trung bình',
		trend: [82.1, 80.3, 79.8, 80.2, 78.5],
		threshold: {
			warning: 70,
			critical: 60
		}
	},
	{
		id: 'kpi-4',
		name: 'Khóa học mới',
		value: 45,
		unit: 'khóa',
		change: 15.2,
		changeType: 'increase',
		period: 'tháng này',
		icon: 'BookOpen',
		color: 'var(--info)',
		description: 'Số khóa học được tạo mới',
		trend: [28, 32, 38, 42, 45],
		threshold: {
			warning: 30,
			critical: 20
		}
	},
	{
		id: 'kpi-5',
		name: 'Chứng chỉ cấp',
		value: 892,
		unit: 'chứng chỉ',
		change: 22.7,
		changeType: 'increase',
		period: 'tháng này',
		icon: 'Award',
		color: 'var(--accent)',
		description: 'Số chứng chỉ được cấp',
		trend: [520, 610, 720, 820, 892],
		threshold: {
			warning: 500,
			critical: 300
		}
	},
	{
		id: 'kpi-6',
		name: 'Đánh giá trung bình',
		value: 4.6,
		unit: 'sao',
		change: 0.1,
		changeType: 'increase',
		period: 'tháng này',
		icon: 'Star',
		color: 'var(--warning)',
		description: 'Đánh giá trung bình của khóa học',
		trend: [4.4, 4.5, 4.5, 4.6, 4.6],
		threshold: {
			warning: 4.0,
			critical: 3.5
		}
	}
]

// Mock Chart Data
export const mockAnalyticsCharts: AnalyticsChart[] = [
	{
		id: 'chart-1',
		title: 'Doanh thu theo thời gian',
		type: 'line',
		data: {
			labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
			datasets: [
				{
					label: 'Doanh thu (VND)',
					data: [850000000, 920000000, 1050000000, 1180000000, 1250000000, 1320000000, 1280000000, 1350000000, 1420000000, 1380000000, 1450000000, 1520000000],
					backgroundColor: 'rgba(34, 197, 94, 0.1)',
					borderColor: 'rgba(34, 197, 94, 1)',
					borderWidth: 2,
					fill: true,
					tension: 0.4
				}
			]
		},
		description: 'Biểu đồ doanh thu hàng tháng',
		period: '12 tháng qua',
		lastUpdated: new Date().toISOString()
	},
	{
		id: 'chart-2',
		title: 'Phân bổ người dùng theo danh mục',
		type: 'doughnut',
		data: {
			labels: ['Lập trình', 'Thiết kế', 'Marketing', 'Kinh doanh', 'Khác'],
			datasets: [
				{
					label: 'Số người dùng',
					data: [4500, 3200, 2800, 2100, 1500],
					backgroundColor: [
						'rgba(59, 130, 246, 0.8)',
						'rgba(16, 185, 129, 0.8)',
						'rgba(245, 158, 11, 0.8)',
						'rgba(239, 68, 68, 0.8)',
						'rgba(139, 92, 246, 0.8)'
					],
					borderColor: [
						'rgba(59, 130, 246, 1)',
						'rgba(16, 185, 129, 1)',
						'rgba(245, 158, 11, 1)',
						'rgba(239, 68, 68, 1)',
						'rgba(139, 92, 246, 1)'
					],
					borderWidth: 2
				}
			]
		},
		description: 'Phân bổ người dùng theo danh mục khóa học',
		period: 'tháng này',
		lastUpdated: new Date().toISOString()
	},
	{
		id: 'chart-3',
		title: 'Tăng trưởng người dùng',
		type: 'bar',
		data: {
			labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
			datasets: [
				{
					label: 'Người dùng mới',
					data: [1200, 1350, 1180, 1420, 1580, 1650],
					backgroundColor: 'rgba(59, 130, 246, 0.8)',
					borderColor: 'rgba(59, 130, 246, 1)',
					borderWidth: 1
				},
				{
					label: 'Người dùng hoạt động',
					data: [8500, 9200, 8800, 10200, 11800, 12500],
					backgroundColor: 'rgba(16, 185, 129, 0.8)',
					borderColor: 'rgba(16, 185, 129, 1)',
					borderWidth: 1
				}
			]
		},
		description: 'Tăng trưởng người dùng mới và hoạt động',
		period: '6 tháng qua',
		lastUpdated: new Date().toISOString()
	},
	{
		id: 'chart-4',
		title: 'Tỷ lệ hoàn thành theo tháng',
		type: 'area',
		data: {
			labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
			datasets: [
				{
					label: 'Tỷ lệ hoàn thành (%)',
					data: [82.1, 80.3, 79.8, 80.2, 78.5, 79.2],
					backgroundColor: 'rgba(245, 158, 11, 0.2)',
					borderColor: 'rgba(245, 158, 11, 1)',
					borderWidth: 2,
					fill: true,
					tension: 0.4
				}
			]
		},
		description: 'Tỷ lệ hoàn thành khóa học theo tháng',
		period: '6 tháng qua',
		lastUpdated: new Date().toISOString()
	}
]

// Mock Top Lists
export const mockTopLists: TopListsWidget[] = [
	{
		id: 'top-courses',
		title: 'Khóa học phổ biến nhất',
		type: 'courses',
		items: [
			{
				id: 'course-1',
				name: 'ReactJS từ A đến Z',
				value: 1250,
				unit: 'học viên',
				change: 15.2,
				changeType: 'increase',
				metadata: { category: 'Lập trình', instructor: 'Nguyễn Văn A', rating: 4.8 },
				subtitle: 'Lập trình • Nguyễn Văn A'
			},
			{
				id: 'course-2',
				name: 'UI/UX Design Fundamentals',
				value: 980,
				unit: 'học viên',
				change: 8.7,
				changeType: 'increase',
				metadata: { category: 'Thiết kế', instructor: 'Trần Thị B', rating: 4.6 },
				subtitle: 'Thiết kế • Trần Thị B'
			},
			{
				id: 'course-3',
				name: 'Digital Marketing Strategy',
				value: 850,
				unit: 'học viên',
				change: 12.3,
				changeType: 'increase',
				metadata: { category: 'Marketing', instructor: 'Lê Văn C', rating: 4.5 },
				subtitle: 'Marketing • Lê Văn C'
			},
			{
				id: 'course-4',
				name: 'Python Data Science',
				value: 720,
				unit: 'học viên',
				change: -2.1,
				changeType: 'decrease',
				metadata: { category: 'Lập trình', instructor: 'Phạm Thị D', rating: 4.7 },
				subtitle: 'Lập trình • Phạm Thị D'
			},
			{
				id: 'course-5',
				name: 'Business Analysis',
				value: 680,
				unit: 'học viên',
				change: 5.4,
				changeType: 'increase',
				metadata: { category: 'Kinh doanh', instructor: 'Hoàng Văn E', rating: 4.4 },
				subtitle: 'Kinh doanh • Hoàng Văn E'
			}
		],
		period: 'tháng này',
		lastUpdated: new Date().toISOString(),
		maxItems: 5
	},
	{
		id: 'top-users',
		title: 'Người dùng tích cực nhất',
		type: 'users',
		items: [
			{
				id: 'user-1',
				name: 'Nguyễn Minh An',
				value: 45,
				unit: 'khóa học',
				change: 8,
				changeType: 'increase',
				avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
				metadata: { completions: 38, certificates: 12, level: 'advanced' },
				subtitle: '38 hoàn thành • 12 chứng chỉ'
			},
			{
				id: 'user-2',
				name: 'Trần Thị Lan',
				value: 42,
				unit: 'khóa học',
				change: 12,
				changeType: 'increase',
				avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
				metadata: { completions: 35, certificates: 10, level: 'intermediate' },
				subtitle: '35 hoàn thành • 10 chứng chỉ'
			},
			{
				id: 'user-3',
				name: 'Lê Văn Hùng',
				value: 38,
				unit: 'khóa học',
				change: 5,
				changeType: 'increase',
				avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
				metadata: { completions: 32, certificates: 8, level: 'intermediate' },
				subtitle: '32 hoàn thành • 8 chứng chỉ'
			},
			{
				id: 'user-4',
				name: 'Phạm Thị Mai',
				value: 35,
				unit: 'khóa học',
				change: 15,
				changeType: 'increase',
				avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
				metadata: { completions: 28, certificates: 6, level: 'beginner' },
				subtitle: '28 hoàn thành • 6 chứng chỉ'
			},
			{
				id: 'user-5',
				name: 'Hoàng Minh Tuấn',
				value: 32,
				unit: 'khóa học',
				change: 3,
				changeType: 'increase',
				avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
				metadata: { completions: 25, certificates: 5, level: 'beginner' },
				subtitle: '25 hoàn thành • 5 chứng chỉ'
			}
		],
		period: 'tháng này',
		lastUpdated: new Date().toISOString(),
		maxItems: 5
	},
	{
		id: 'top-organizations',
		title: 'Tổ chức có nhiều người dùng nhất',
		type: 'organizations',
		items: [
			{
				id: 'org-1',
				name: 'Đại học Bách Khoa Hà Nội',
				value: 1250,
				unit: 'người dùng',
				change: 8.5,
				changeType: 'increase',
				metadata: { courses: 45, completions: 850, plan: 'enterprise' },
				subtitle: '45 khóa học • 850 hoàn thành'
			},
			{
				id: 'org-2',
				name: 'FPT Software',
				value: 980,
				unit: 'người dùng',
				change: 12.3,
				changeType: 'increase',
				metadata: { courses: 38, completions: 720, plan: 'premium' },
				subtitle: '38 khóa học • 720 hoàn thành'
			},
			{
				id: 'org-3',
				name: 'Vietcombank',
				value: 850,
				unit: 'người dùng',
				change: 5.7,
				changeType: 'increase',
				metadata: { courses: 32, completions: 650, plan: 'premium' },
				subtitle: '32 khóa học • 650 hoàn thành'
			},
			{
				id: 'org-4',
				name: 'VinGroup',
				value: 720,
				unit: 'người dùng',
				change: 15.2,
				changeType: 'increase',
				metadata: { courses: 28, completions: 580, plan: 'basic' },
				subtitle: '28 khóa học • 580 hoàn thành'
			},
			{
				id: 'org-5',
				name: 'Viettel',
				value: 680,
				unit: 'người dùng',
				change: 3.8,
				changeType: 'increase',
				metadata: { courses: 25, completions: 520, plan: 'basic' },
				subtitle: '25 khóa học • 520 hoàn thành'
			}
		],
		period: 'tháng này',
		lastUpdated: new Date().toISOString(),
		maxItems: 5
	}
]

// Mock Revenue Data
export const mockRevenueData: RevenueData[] = Array.from({ length: 30 }, (_, i) => {
	const date = new Date()
	date.setDate(date.getDate() - (29 - i))
	return {
		date: date.toISOString().split('T')[0],
		revenue: Math.floor(Math.random() * 50000000) + 20000000,
		transactions: Math.floor(Math.random() * 200) + 50,
		avgOrderValue: Math.floor(Math.random() * 200000) + 100000,
		refunds: Math.floor(Math.random() * 5000000) + 1000000,
		netRevenue: Math.floor(Math.random() * 45000000) + 19000000
	}
})

// Mock User Growth Data
export const mockUserGrowthData: UserGrowthData[] = Array.from({ length: 30 }, (_, i) => {
	const date = new Date()
	date.setDate(date.getDate() - (29 - i))
	return {
		date: date.toISOString().split('T')[0],
		newUsers: Math.floor(Math.random() * 100) + 20,
		activeUsers: Math.floor(Math.random() * 500) + 200,
		totalUsers: Math.floor(Math.random() * 1000) + 5000,
		retentionRate: Math.random() * 20 + 70,
		churnRate: Math.random() * 5 + 2
	}
})

// Mock Course Analytics
export const mockCourseAnalytics: CourseAnalytics[] = [
	{
		courseId: 'course-1',
		courseName: 'ReactJS từ A đến Z',
		enrollments: 1250,
		completions: 980,
		completionRate: 78.4,
		avgRating: 4.8,
		revenue: 125000000,
		views: 8500,
		likes: 420,
		shares: 180,
		comments: 95,
		duration: 45,
		category: 'Lập trình',
		instructor: 'Nguyễn Văn A',
		createdAt: '2023-01-15',
		lastUpdated: '2024-01-15'
	},
	{
		courseId: 'course-2',
		courseName: 'UI/UX Design Fundamentals',
		enrollments: 980,
		completions: 720,
		completionRate: 73.5,
		avgRating: 4.6,
		revenue: 98000000,
		views: 7200,
		likes: 380,
		shares: 150,
		comments: 85,
		duration: 38,
		category: 'Thiết kế',
		instructor: 'Trần Thị B',
		createdAt: '2023-02-20',
		lastUpdated: '2024-01-10'
	},
	{
		courseId: 'course-3',
		courseName: 'Digital Marketing Strategy',
		enrollments: 850,
		completions: 620,
		completionRate: 72.9,
		avgRating: 4.5,
		revenue: 85000000,
		views: 6800,
		likes: 350,
		shares: 140,
		comments: 75,
		duration: 42,
		category: 'Marketing',
		instructor: 'Lê Văn C',
		createdAt: '2023-03-10',
		lastUpdated: '2024-01-05'
	}
]

// Mock User Analytics
export const mockUserAnalytics: UserAnalytics[] = [
	{
		userId: 'user-1',
		userName: 'Nguyễn Minh An',
		email: 'an.nguyen@email.com',
		avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
		enrollments: 45,
		completions: 38,
		completionRate: 84.4,
		avgScore: 87.5,
		timeSpent: 1250,
		certificates: 12,
		lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		joinDate: '2023-01-15',
		organization: 'Đại học Bách Khoa Hà Nội',
		level: 'advanced',
		preferredCategories: ['Lập trình', 'Thiết kế']
	},
	{
		userId: 'user-2',
		userName: 'Trần Thị Lan',
		email: 'lan.tran@email.com',
		avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
		enrollments: 42,
		completions: 35,
		completionRate: 83.3,
		avgScore: 85.2,
		timeSpent: 1180,
		certificates: 10,
		lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
		joinDate: '2023-02-20',
		organization: 'FPT Software',
		level: 'intermediate',
		preferredCategories: ['Marketing', 'Kinh doanh']
	}
]

// Mock Organization Analytics
export const mockOrganizationAnalytics: OrganizationAnalytics[] = [
	{
		organizationId: 'org-1',
		organizationName: 'Đại học Bách Khoa Hà Nội',
		logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop',
		totalUsers: 1250,
		activeUsers: 980,
		totalCourses: 45,
		completedCourses: 850,
		totalRevenue: 125000000,
		avgCompletionRate: 78.5,
		avgRating: 4.6,
		lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		joinDate: '2023-01-01',
		plan: 'enterprise',
		industry: 'Education',
		location: 'Hà Nội'
	},
	{
		organizationId: 'org-2',
		organizationName: 'FPT Software',
		logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
		totalUsers: 980,
		activeUsers: 750,
		totalCourses: 38,
		completedCourses: 720,
		totalRevenue: 98000000,
		avgCompletionRate: 76.8,
		avgRating: 4.5,
		lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		joinDate: '2023-02-15',
		plan: 'premium',
		industry: 'Technology',
		location: 'TP.HCM'
	}
]

// Mock Instructor Analytics
export const mockInstructorAnalytics: InstructorAnalytics[] = [
	{
		instructorId: 'instructor-1',
		instructorName: 'Nguyễn Văn A',
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
		totalCourses: 8,
		totalStudents: 1250,
		totalRevenue: 125000000,
		avgRating: 4.8,
		avgCompletionRate: 78.4,
		totalHours: 360,
		certificatesIssued: 980,
		lastCourseCreated: '2024-01-15',
		joinDate: '2023-01-01',
		specialization: ['ReactJS', 'JavaScript', 'Frontend'],
		experience: 5
	},
	{
		instructorId: 'instructor-2',
		instructorName: 'Trần Thị B',
		avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
		totalCourses: 6,
		totalStudents: 980,
		totalRevenue: 98000000,
		avgRating: 4.6,
		avgCompletionRate: 73.5,
		totalHours: 228,
		certificatesIssued: 720,
		lastCourseCreated: '2024-01-10',
		joinDate: '2023-02-01',
		specialization: ['UI/UX Design', 'Figma', 'Adobe'],
		experience: 4
	}
]

// Mock Certificate Analytics
export const mockCertificateAnalytics: CertificateAnalytics[] = [
	{
		certificateId: 'cert-1',
		certificateName: 'ReactJS Developer Certificate',
		totalIssued: 980,
		totalActive: 920,
		totalExpired: 45,
		totalRevoked: 15,
		completionRate: 78.4,
		avgTimeToComplete: 45,
		popularityScore: 95,
		lastIssued: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		createdAt: '2023-01-15',
		category: 'Lập trình',
		level: 'Advanced'
	},
	{
		certificateId: 'cert-2',
		certificateName: 'UI/UX Design Certificate',
		totalIssued: 720,
		totalActive: 680,
		totalExpired: 30,
		totalRevoked: 10,
		completionRate: 73.5,
		avgTimeToComplete: 38,
		popularityScore: 88,
		lastIssued: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
		createdAt: '2023-02-20',
		category: 'Thiết kế',
		level: 'Intermediate'
	}
]

// Mock Activities
export const mockAnalyticsActivities: AnalyticsActivity[] = [
	{
		id: 'activity-1',
		type: 'course_completion',
		title: 'Hoàn thành khóa học ReactJS',
		description: 'Nguyễn Minh An đã hoàn thành khóa học ReactJS từ A đến Z',
		timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		userId: 'user-1',
		userName: 'Nguyễn Minh An',
		avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
		metadata: { courseId: 'course-1', score: 87, duration: 45 },
		impact: 'medium'
	},
	{
		id: 'activity-2',
		type: 'certificate_issued',
		title: 'Cấp chứng chỉ UI/UX Design',
		description: 'Trần Thị Lan đã nhận chứng chỉ UI/UX Design Fundamentals',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		userId: 'user-2',
		userName: 'Trần Thị Lan',
		avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
		metadata: { certificateId: 'cert-2', courseId: 'course-2' },
		impact: 'high'
	},
	{
		id: 'activity-3',
		type: 'course_enrollment',
		title: 'Đăng ký khóa học mới',
		description: 'Lê Văn Hùng đã đăng ký khóa học Digital Marketing Strategy',
		timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
		userId: 'user-3',
		userName: 'Lê Văn Hùng',
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
		metadata: { courseId: 'course-3' },
		impact: 'low'
	}
]

// Mock Alerts
export const mockAnalyticsAlerts: AnalyticsAlert[] = [
	{
		id: 'alert-1',
		type: 'completion_rate_low',
		severity: 'medium',
		title: 'Tỷ lệ hoàn thành thấp',
		message: 'Tỷ lệ hoàn thành khóa học Python Data Science giảm xuống 65%',
		timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		resolved: false,
		metadata: { courseId: 'course-4', threshold: 70 }
	},
	{
		id: 'alert-2',
		type: 'revenue_drop',
		severity: 'high',
		title: 'Doanh thu giảm',
		message: 'Doanh thu tháng này giảm 15% so với tháng trước',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		resolved: false,
		metadata: { currentMonth: 1250000000, previousMonth: 1470000000 }
	}
]

// Mock Insights
export const mockAnalyticsInsights: AnalyticsInsight[] = [
	{
		id: 'insight-1',
		type: 'trend_analysis',
		title: 'Xu hướng tăng trưởng người dùng',
		description: 'Người dùng mới tăng 25% trong 3 tháng qua, chủ yếu từ các khóa học lập trình',
		confidence: 85,
		impact: 'high',
		actionable: true,
		recommendations: [
			'Tăng cường marketing cho các khóa học lập trình',
			'Mở rộng danh mục khóa học lập trình',
			'Tối ưu hóa trải nghiệm học tập'
		],
		timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
		metadata: { period: '3 months', category: 'programming' }
	},
	{
		id: 'insight-2',
		type: 'correlation_analysis',
		title: 'Mối tương quan giữa đánh giá và hoàn thành',
		description: 'Khóa học có đánh giá cao (>4.5) có tỷ lệ hoàn thành cao hơn 20%',
		confidence: 92,
		impact: 'medium',
		actionable: true,
		recommendations: [
			'Cải thiện chất lượng nội dung khóa học',
			'Khuyến khích học viên đánh giá khóa học',
			'Phân tích feedback để cải thiện'
		],
		timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
		metadata: { correlation: 0.78, sampleSize: 150 }
	}
]

// Mock Dashboard
export const mockAnalyticsDashboard: AnalyticsDashboard = {
	overview: {
		totalUsers: 15420,
		totalCourses: 245,
		totalRevenue: 1250000000,
		totalEnrollments: 12580,
		avgCompletionRate: 78.5,
		avgRating: 4.6,
		activeUsers: 8920,
		newUsersToday: 45
	},
	kpis: mockKPIMetrics,
	charts: mockAnalyticsCharts,
	topLists: mockTopLists,
	recentActivity: mockAnalyticsActivities,
	alerts: mockAnalyticsAlerts,
	insights: mockAnalyticsInsights
}

// Mock Geographic Data
export const mockGeographicData: GeographicData[] = [
	{ country: 'Vietnam', countryCode: 'VN', users: 12500, revenue: 850000000, courses: 180, completions: 8500, percentage: 65.2 },
	{ country: 'Thailand', countryCode: 'TH', users: 1800, revenue: 120000000, courses: 25, completions: 1200, percentage: 9.4 },
	{ country: 'Malaysia', countryCode: 'MY', users: 1200, revenue: 80000000, courses: 18, completions: 900, percentage: 6.3 },
	{ country: 'Singapore', countryCode: 'SG', users: 800, revenue: 60000000, courses: 12, completions: 600, percentage: 4.2 },
	{ country: 'Indonesia', countryCode: 'ID', users: 600, revenue: 40000000, courses: 8, completions: 400, percentage: 3.1 },
	{ country: 'Philippines', countryCode: 'PH', users: 400, revenue: 30000000, courses: 6, completions: 300, percentage: 2.1 },
	{ country: 'Others', countryCode: 'OT', users: 920, revenue: 120000000, courses: 16, completions: 680, percentage: 9.7 }
]

// Mock Device Analytics
export const mockDeviceAnalytics: DeviceAnalytics[] = [
	{ device: 'Desktop', users: 8500, sessions: 12500, avgSessionDuration: 45, bounceRate: 25, percentage: 55.2 },
	{ device: 'Mobile', users: 5200, sessions: 8200, avgSessionDuration: 28, bounceRate: 35, percentage: 33.8 },
	{ device: 'Tablet', users: 1720, sessions: 2100, avgSessionDuration: 38, bounceRate: 30, percentage: 11.0 }
]

// Mock Traffic Sources
export const mockTrafficSources: TrafficSource[] = [
	{ source: 'Organic Search', users: 6500, sessions: 9200, revenue: 450000000, conversionRate: 8.5, percentage: 42.2 },
	{ source: 'Direct', users: 4200, sessions: 5800, revenue: 320000000, conversionRate: 12.3, percentage: 27.3 },
	{ source: 'Social Media', users: 2800, sessions: 3500, revenue: 180000000, conversionRate: 6.8, percentage: 18.2 },
	{ source: 'Email', users: 1200, sessions: 1500, revenue: 150000000, conversionRate: 15.2, percentage: 7.8 },
	{ source: 'Referral', users: 720, sessions: 900, revenue: 150000000, conversionRate: 18.5, percentage: 4.5 }
]
