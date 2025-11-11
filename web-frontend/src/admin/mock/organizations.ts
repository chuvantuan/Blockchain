// Mock data cho Organization Management

import { 
	Organization, 
	OrganizationDashboard, 
	OrganizationStats, 
	OrganizationAlert, 
	OrganizationActivity,
	OrganizationType,
	OrganizationStatus,
	OrganizationSize,
	SubscriptionPlan,
	SubscriptionStatus,
	VerificationStatus
} from '../types/organization'

// Mock organizations data
export const mockOrganizations: Organization[] = [
	{
		id: 'org-1',
		name: 'Đại học Bách Khoa Hà Nội',
		description: 'Trường đại học kỹ thuật hàng đầu Việt Nam, chuyên đào tạo các ngành kỹ thuật, công nghệ và khoa học ứng dụng.',
		shortDescription: 'Trường đại học kỹ thuật hàng đầu Việt Nam',
		logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop&crop=face',
		website: 'https://hust.edu.vn',
		email: 'info@hust.edu.vn',
		phone: '+84-24-3868-2442',
		address: 'Số 1 Đại Cồ Việt, Hai Bà Trưng',
		city: 'Hà Nội',
		country: 'Việt Nam',
		postalCode: '100000',
		type: 'university',
		status: 'active',
		size: 'large',
		industry: 'Giáo dục',
		foundedYear: 1956,
		revenue: 500000000000,
		currency: 'VND',
		employees: 2500,
		departments: 15,
		courses: 120,
		students: 45000,
		instructors: 1200,
		admins: 25,
		subscriptionPlan: 'enterprise',
		subscriptionStatus: 'active',
		subscriptionExpiry: '2024-12-31',
		features: [
			{ id: 'f1', name: 'Quản lý khóa học', description: 'Tạo và quản lý khóa học', enabled: true, limit: 1000, used: 120, category: 'learning' },
			{ id: 'f2', name: 'Phân tích dữ liệu', description: 'Báo cáo và thống kê chi tiết', enabled: true, limit: 5000, used: 1200, category: 'analytics' },
			{ id: 'f3', name: 'Tích hợp SSO', description: 'Đăng nhập đơn giản', enabled: true, category: 'security' }
		],
		tags: ['Giáo dục', 'Kỹ thuật', 'Công nghệ', 'Hà Nội'],
		contactPerson: {
			name: 'Nguyễn Văn Minh',
			title: 'Giám đốc CNTT',
			email: 'minh.nv@hust.edu.vn',
			phone: '+84-24-3868-2442',
			department: 'Phòng CNTT',
			isPrimary: true
		},
		socialMedia: {
			website: 'https://hust.edu.vn',
			facebook: 'https://facebook.com/hust.edu.vn',
			youtube: 'https://youtube.com/hust'
		},
		settings: {
			timezone: 'Asia/Ho_Chi_Minh',
			language: 'vi',
			dateFormat: 'DD/MM/YYYY',
			currency: 'VND',
			notifications: {
				email: true,
				sms: false,
				push: true,
				marketing: false,
				updates: true,
				security: true
			},
			privacy: {
				dataSharing: false,
				analytics: true,
				marketing: false,
				thirdParty: false
			},
			learning: {
				certificates: true,
				badges: true,
				gamification: true,
				socialLearning: true,
				offlineMode: false
			},
			security: {
				twoFactor: true,
				sso: true,
				passwordPolicy: true,
				sessionTimeout: 480,
				ipWhitelist: true
			}
		},
		createdAt: '2023-01-15T08:00:00Z',
		updatedAt: '2024-01-15T10:30:00Z',
		lastLoginAt: '2024-01-15T09:45:00Z',
		isActive: true,
		isVerified: true,
		isPremium: true,
		verificationStatus: 'verified',
		notes: 'Tổ chức giáo dục uy tín, có nhiều năm kinh nghiệm trong đào tạo kỹ thuật.'
	},
	{
		id: 'org-2',
		name: 'FPT Software',
		description: 'Công ty phần mềm hàng đầu Việt Nam, chuyên cung cấp dịch vụ phát triển phần mềm và giải pháp công nghệ.',
		shortDescription: 'Công ty phần mềm hàng đầu Việt Nam',
		logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face',
		website: 'https://fptsoftware.com',
		email: 'contact@fptsoftware.com',
		phone: '+84-24-7300-1886',
		address: 'Tòa nhà FPT, Duy Tân, Cầu Giấy',
		city: 'Hà Nội',
		country: 'Việt Nam',
		postalCode: '100000',
		type: 'enterprise',
		status: 'active',
		size: 'enterprise',
		industry: 'Công nghệ thông tin',
		foundedYear: 1999,
		revenue: 2000000000000,
		currency: 'VND',
		employees: 15000,
		departments: 25,
		courses: 200,
		students: 8000,
		instructors: 500,
		admins: 15,
		subscriptionPlan: 'enterprise',
		subscriptionStatus: 'active',
		subscriptionExpiry: '2024-11-30',
		features: [
			{ id: 'f1', name: 'Quản lý khóa học', description: 'Tạo và quản lý khóa học', enabled: true, limit: 2000, used: 200, category: 'learning' },
			{ id: 'f2', name: 'Phân tích dữ liệu', description: 'Báo cáo và thống kê chi tiết', enabled: true, limit: 10000, used: 2500, category: 'analytics' },
			{ id: 'f3', name: 'Tích hợp API', description: 'Kết nối với hệ thống khác', enabled: true, category: 'integration' }
		],
		tags: ['Công nghệ', 'Phần mềm', 'FPT', 'Hà Nội'],
		contactPerson: {
			name: 'Trần Thị Lan',
			title: 'Trưởng phòng Đào tạo',
			email: 'lan.tt@fptsoftware.com',
			phone: '+84-24-7300-1886',
			department: 'Phòng Đào tạo',
			isPrimary: true
		},
		socialMedia: {
			website: 'https://fptsoftware.com',
			linkedin: 'https://linkedin.com/company/fpt-software',
			youtube: 'https://youtube.com/fptsoftware'
		},
		settings: {
			timezone: 'Asia/Ho_Chi_Minh',
			language: 'vi',
			dateFormat: 'DD/MM/YYYY',
			currency: 'VND',
			notifications: {
				email: true,
				sms: true,
				push: true,
				marketing: true,
				updates: true,
				security: true
			},
			privacy: {
				dataSharing: true,
				analytics: true,
				marketing: true,
				thirdParty: true
			},
			learning: {
				certificates: true,
				badges: true,
				gamification: true,
				socialLearning: true,
				offlineMode: true
			},
			security: {
				twoFactor: true,
				sso: true,
				passwordPolicy: true,
				sessionTimeout: 240,
				ipWhitelist: true
			}
		},
		createdAt: '2023-02-20T10:00:00Z',
		updatedAt: '2024-01-14T16:20:00Z',
		lastLoginAt: '2024-01-15T08:30:00Z',
		isActive: true,
		isVerified: true,
		isPremium: true,
		verificationStatus: 'verified',
		notes: 'Công ty công nghệ lớn, có hệ thống đào tạo nội bộ phát triển.'
	},
	{
		id: 'org-3',
		name: 'Trung tâm Đào tạo CNTT Aptech',
		description: 'Trung tâm đào tạo công nghệ thông tin chuyên nghiệp, cung cấp các khóa học lập trình và công nghệ.',
		shortDescription: 'Trung tâm đào tạo CNTT chuyên nghiệp',
		logo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop&crop=face',
		website: 'https://aptech.vn',
		email: 'info@aptech.vn',
		phone: '+84-24-3773-0666',
		address: 'Số 285 Đội Cấn, Ba Đình',
		city: 'Hà Nội',
		country: 'Việt Nam',
		postalCode: '100000',
		type: 'training_center',
		status: 'active',
		size: 'medium',
		industry: 'Giáo dục',
		foundedYear: 1999,
		revenue: 50000000000,
		currency: 'VND',
		employees: 150,
		departments: 8,
		courses: 50,
		students: 2000,
		instructors: 80,
		admins: 5,
		subscriptionPlan: 'professional',
		subscriptionStatus: 'active',
		subscriptionExpiry: '2024-10-15',
		features: [
			{ id: 'f1', name: 'Quản lý khóa học', description: 'Tạo và quản lý khóa học', enabled: true, limit: 100, used: 50, category: 'learning' },
			{ id: 'f2', name: 'Phân tích dữ liệu', description: 'Báo cáo và thống kê chi tiết', enabled: true, limit: 1000, used: 200, category: 'analytics' }
		],
		tags: ['Đào tạo', 'CNTT', 'Lập trình', 'Hà Nội'],
		contactPerson: {
			name: 'Lê Văn Hùng',
			title: 'Giám đốc Trung tâm',
			email: 'hung.lv@aptech.vn',
			phone: '+84-24-3773-0666',
			department: 'Ban Giám đốc',
			isPrimary: true
		},
		socialMedia: {
			website: 'https://aptech.vn',
			facebook: 'https://facebook.com/aptechvietnam',
			youtube: 'https://youtube.com/aptechvietnam'
		},
		settings: {
			timezone: 'Asia/Ho_Chi_Minh',
			language: 'vi',
			dateFormat: 'DD/MM/YYYY',
			currency: 'VND',
			notifications: {
				email: true,
				sms: false,
				push: true,
				marketing: true,
				updates: true,
				security: false
			},
			privacy: {
				dataSharing: false,
				analytics: true,
				marketing: true,
				thirdParty: false
			},
			learning: {
				certificates: true,
				badges: true,
				gamification: false,
				socialLearning: true,
				offlineMode: false
			},
			security: {
				twoFactor: false,
				sso: false,
				passwordPolicy: true,
				sessionTimeout: 480,
				ipWhitelist: false
			}
		},
		createdAt: '2023-03-10T14:00:00Z',
		updatedAt: '2024-01-12T11:15:00Z',
		lastLoginAt: '2024-01-15T07:20:00Z',
		isActive: true,
		isVerified: true,
		isPremium: false,
		verificationStatus: 'verified',
		notes: 'Trung tâm đào tạo có uy tín, chuyên về các khóa học lập trình.'
	},
	{
		id: 'org-4',
		name: 'Trường THPT Chuyên Hà Nội - Amsterdam',
		description: 'Trường trung học phổ thông chuyên hàng đầu Việt Nam, đào tạo học sinh giỏi các môn khoa học tự nhiên.',
		shortDescription: 'Trường THPT chuyên hàng đầu Việt Nam',
		logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop&crop=face',
		website: 'https://ams.edu.vn',
		email: 'info@ams.edu.vn',
		phone: '+84-24-3851-3935',
		address: 'Số 1 Hoàng Minh Giám, Cầu Giấy',
		city: 'Hà Nội',
		country: 'Việt Nam',
		postalCode: '100000',
		type: 'school',
		status: 'active',
		size: 'medium',
		industry: 'Giáo dục',
		foundedYear: 1985,
		revenue: 20000000000,
		currency: 'VND',
		employees: 200,
		departments: 12,
		courses: 80,
		students: 3000,
		instructors: 150,
		admins: 8,
		subscriptionPlan: 'professional',
		subscriptionStatus: 'active',
		subscriptionExpiry: '2024-09-30',
		features: [
			{ id: 'f1', name: 'Quản lý khóa học', description: 'Tạo và quản lý khóa học', enabled: true, limit: 200, used: 80, category: 'learning' },
			{ id: 'f2', name: 'Phân tích dữ liệu', description: 'Báo cáo và thống kê chi tiết', enabled: true, limit: 500, used: 150, category: 'analytics' }
		],
		tags: ['Giáo dục', 'THPT', 'Chuyên', 'Hà Nội'],
		contactPerson: {
			name: 'Phạm Thị Mai',
			title: 'Hiệu trưởng',
			email: 'mai.pt@ams.edu.vn',
			phone: '+84-24-3851-3935',
			department: 'Ban Giám hiệu',
			isPrimary: true
		},
		socialMedia: {
			website: 'https://ams.edu.vn',
			facebook: 'https://facebook.com/ams.edu.vn'
		},
		settings: {
			timezone: 'Asia/Ho_Chi_Minh',
			language: 'vi',
			dateFormat: 'DD/MM/YYYY',
			currency: 'VND',
			notifications: {
				email: true,
				sms: false,
				push: false,
				marketing: false,
				updates: true,
				security: false
			},
			privacy: {
				dataSharing: false,
				analytics: true,
				marketing: false,
				thirdParty: false
			},
			learning: {
				certificates: true,
				badges: false,
				gamification: false,
				socialLearning: false,
				offlineMode: false
			},
			security: {
				twoFactor: false,
				sso: false,
				passwordPolicy: true,
				sessionTimeout: 480,
				ipWhitelist: false
			}
		},
		createdAt: '2023-04-05T09:00:00Z',
		updatedAt: '2024-01-10T14:30:00Z',
		lastLoginAt: '2024-01-14T16:45:00Z',
		isActive: true,
		isVerified: true,
		isPremium: false,
		verificationStatus: 'verified',
		notes: 'Trường THPT chuyên có chất lượng giáo dục cao.'
	},
	{
		id: 'org-5',
		name: 'Startup TechHub',
		description: 'Cộng đồng startup công nghệ, hỗ trợ các doanh nghiệp khởi nghiệp trong lĩnh vực công nghệ.',
		shortDescription: 'Cộng đồng startup công nghệ',
		logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop&crop=face',
		website: 'https://techhub.vn',
		email: 'hello@techhub.vn',
		phone: '+84-24-7300-1886',
		address: 'Tầng 5, Tòa nhà TechHub, Quận 1',
		city: 'TP. Hồ Chí Minh',
		country: 'Việt Nam',
		postalCode: '700000',
		type: 'startup',
		status: 'active',
		size: 'small',
		industry: 'Công nghệ',
		foundedYear: 2020,
		revenue: 5000000000,
		currency: 'VND',
		employees: 25,
		departments: 3,
		courses: 15,
		students: 500,
		instructors: 20,
		admins: 3,
		subscriptionPlan: 'basic',
		subscriptionStatus: 'active',
		subscriptionExpiry: '2024-08-20',
		features: [
			{ id: 'f1', name: 'Quản lý khóa học', description: 'Tạo và quản lý khóa học', enabled: true, limit: 50, used: 15, category: 'learning' }
		],
		tags: ['Startup', 'Công nghệ', 'HCM', 'Khởi nghiệp'],
		contactPerson: {
			name: 'Nguyễn Minh Tuấn',
			title: 'Founder & CEO',
			email: 'tuan.nm@techhub.vn',
			phone: '+84-24-7300-1886',
			department: 'Ban Lãnh đạo',
			isPrimary: true
		},
		socialMedia: {
			website: 'https://techhub.vn',
			facebook: 'https://facebook.com/techhubvietnam',
			twitter: 'https://twitter.com/techhubvn',
			linkedin: 'https://linkedin.com/company/techhub-vietnam'
		},
		settings: {
			timezone: 'Asia/Ho_Chi_Minh',
			language: 'vi',
			dateFormat: 'DD/MM/YYYY',
			currency: 'VND',
			notifications: {
				email: true,
				sms: false,
				push: true,
				marketing: true,
				updates: true,
				security: false
			},
			privacy: {
				dataSharing: true,
				analytics: true,
				marketing: true,
				thirdParty: true
			},
			learning: {
				certificates: false,
				badges: true,
				gamification: true,
				socialLearning: true,
				offlineMode: false
			},
			security: {
				twoFactor: false,
				sso: false,
				passwordPolicy: false,
				sessionTimeout: 720,
				ipWhitelist: false
			}
		},
		createdAt: '2023-05-15T11:00:00Z',
		updatedAt: '2024-01-08T13:20:00Z',
		lastLoginAt: '2024-01-15T10:15:00Z',
		isActive: true,
		isVerified: false,
		isPremium: false,
		verificationStatus: 'pending',
		notes: 'Startup mới thành lập, đang trong giai đoạn phát triển.'
	},
	{
		id: 'org-6',
		name: 'Tổ chức Phi lợi nhuận GreenTech',
		description: 'Tổ chức phi lợi nhuận chuyên về công nghệ xanh và phát triển bền vững.',
		shortDescription: 'Tổ chức phi lợi nhuận về công nghệ xanh',
		logo: 'https://images.unsplash.com/photo-1569163139394-de446e5b5d0e?w=100&h=100&fit=crop&crop=face',
		website: 'https://greentech.org.vn',
		email: 'info@greentech.org.vn',
		phone: '+84-24-7300-1886',
		address: 'Số 123 Nguyễn Huệ, Quận 1',
		city: 'TP. Hồ Chí Minh',
		country: 'Việt Nam',
		postalCode: '700000',
		type: 'ngo',
		status: 'active',
		size: 'small',
		industry: 'Môi trường',
		foundedYear: 2018,
		revenue: 2000000000,
		currency: 'VND',
		employees: 15,
		departments: 2,
		courses: 10,
		students: 200,
		instructors: 8,
		admins: 2,
		subscriptionPlan: 'free',
		subscriptionStatus: 'active',
		subscriptionExpiry: '2024-12-31',
		features: [
			{ id: 'f1', name: 'Quản lý khóa học', description: 'Tạo và quản lý khóa học', enabled: true, limit: 10, used: 10, category: 'learning' }
		],
		tags: ['NGO', 'Môi trường', 'Xanh', 'HCM'],
		contactPerson: {
			name: 'Lê Thị Hoa',
			title: 'Giám đốc Điều hành',
			email: 'hoa.lt@greentech.org.vn',
			phone: '+84-24-7300-1886',
			department: 'Ban Điều hành',
			isPrimary: true
		},
		socialMedia: {
			website: 'https://greentech.org.vn',
			facebook: 'https://facebook.com/greentechvietnam',
			instagram: 'https://instagram.com/greentechvn'
		},
		settings: {
			timezone: 'Asia/Ho_Chi_Minh',
			language: 'vi',
			dateFormat: 'DD/MM/YYYY',
			currency: 'VND',
			notifications: {
				email: true,
				sms: false,
				push: false,
				marketing: false,
				updates: true,
				security: false
			},
			privacy: {
				dataSharing: false,
				analytics: false,
				marketing: false,
				thirdParty: false
			},
			learning: {
				certificates: true,
				badges: false,
				gamification: false,
				socialLearning: false,
				offlineMode: false
			},
			security: {
				twoFactor: false,
				sso: false,
				passwordPolicy: false,
				sessionTimeout: 480,
				ipWhitelist: false
			}
		},
		createdAt: '2023-06-20T16:00:00Z',
		updatedAt: '2024-01-05T09:45:00Z',
		lastLoginAt: '2024-01-12T14:30:00Z',
		isActive: true,
		isVerified: true,
		isPremium: false,
		verificationStatus: 'verified',
		notes: 'Tổ chức phi lợi nhuận có mục tiêu cao cả về môi trường.'
	},
	{
		id: 'org-7',
		name: 'Công ty TNHH ABC Corp',
		description: 'Công ty thương mại điện tử, chuyên cung cấp các giải pháp thương mại trực tuyến.',
		shortDescription: 'Công ty thương mại điện tử',
		logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face',
		website: 'https://abccorp.vn',
		email: 'contact@abccorp.vn',
		phone: '+84-24-7300-1886',
		address: 'Tầng 10, Tòa nhà ABC, Quận 3',
		city: 'TP. Hồ Chí Minh',
		country: 'Việt Nam',
		postalCode: '700000',
		type: 'corporate',
		status: 'inactive',
		size: 'medium',
		industry: 'Thương mại điện tử',
		foundedYear: 2015,
		revenue: 100000000000,
		currency: 'VND',
		employees: 300,
		departments: 10,
		courses: 30,
		students: 1000,
		instructors: 50,
		admins: 8,
		subscriptionPlan: 'professional',
		subscriptionStatus: 'expired',
		subscriptionExpiry: '2023-12-31',
		features: [
			{ id: 'f1', name: 'Quản lý khóa học', description: 'Tạo và quản lý khóa học', enabled: false, limit: 100, used: 30, category: 'learning' }
		],
		tags: ['Thương mại', 'E-commerce', 'HCM', 'Doanh nghiệp'],
		contactPerson: {
			name: 'Trần Văn Đức',
			title: 'Giám đốc Marketing',
			email: 'duc.tv@abccorp.vn',
			phone: '+84-24-7300-1886',
			department: 'Phòng Marketing',
			isPrimary: true
		},
		socialMedia: {
			website: 'https://abccorp.vn',
			facebook: 'https://facebook.com/abccorpvn'
		},
		settings: {
			timezone: 'Asia/Ho_Chi_Minh',
			language: 'vi',
			dateFormat: 'DD/MM/YYYY',
			currency: 'VND',
			notifications: {
				email: true,
				sms: false,
				push: false,
				marketing: false,
				updates: false,
				security: false
			},
			privacy: {
				dataSharing: false,
				analytics: false,
				marketing: false,
				thirdParty: false
			},
			learning: {
				certificates: false,
				badges: false,
				gamification: false,
				socialLearning: false,
				offlineMode: false
			},
			security: {
				twoFactor: false,
				sso: false,
				passwordPolicy: false,
				sessionTimeout: 480,
				ipWhitelist: false
			}
		},
		createdAt: '2023-07-10T12:00:00Z',
		updatedAt: '2023-12-15T10:20:00Z',
		lastLoginAt: '2023-12-20T15:30:00Z',
		isActive: false,
		isVerified: true,
		isPremium: false,
		verificationStatus: 'verified',
		notes: 'Công ty đã ngừng hoạt động, subscription đã hết hạn.'
	},
	{
		id: 'org-8',
		name: 'Trường Cao đẳng Nghề Công nghệ',
		description: 'Trường cao đẳng nghề chuyên đào tạo các ngành công nghệ và kỹ thuật.',
		shortDescription: 'Trường cao đẳng nghề công nghệ',
		logo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop&crop=face',
		website: 'https://caodangcongnghe.edu.vn',
		email: 'info@caodangcongnghe.edu.vn',
		phone: '+84-24-7300-1886',
		address: 'Số 456 Đường Láng, Đống Đa',
		city: 'Hà Nội',
		country: 'Việt Nam',
		postalCode: '100000',
		type: 'college',
		status: 'pending',
		size: 'medium',
		industry: 'Giáo dục',
		foundedYear: 2010,
		revenue: 30000000000,
		currency: 'VND',
		employees: 180,
		departments: 8,
		courses: 60,
		students: 2500,
		instructors: 120,
		admins: 6,
		subscriptionPlan: 'basic',
		subscriptionStatus: 'pending',
		subscriptionExpiry: '2024-06-30',
		features: [
			{ id: 'f1', name: 'Quản lý khóa học', description: 'Tạo và quản lý khóa học', enabled: false, limit: 50, used: 0, category: 'learning' }
		],
		tags: ['Cao đẳng', 'Nghề', 'Công nghệ', 'Hà Nội'],
		contactPerson: {
			name: 'Hoàng Văn Nam',
			title: 'Hiệu trưởng',
			email: 'nam.hv@caodangcongnghe.edu.vn',
			phone: '+84-24-7300-1886',
			department: 'Ban Giám hiệu',
			isPrimary: true
		},
		socialMedia: {
			website: 'https://caodangcongnghe.edu.vn'
		},
		settings: {
			timezone: 'Asia/Ho_Chi_Minh',
			language: 'vi',
			dateFormat: 'DD/MM/YYYY',
			currency: 'VND',
			notifications: {
				email: true,
				sms: false,
				push: false,
				marketing: false,
				updates: true,
				security: false
			},
			privacy: {
				dataSharing: false,
				analytics: false,
				marketing: false,
				thirdParty: false
			},
			learning: {
				certificates: false,
				badges: false,
				gamification: false,
				socialLearning: false,
				offlineMode: false
			},
			security: {
				twoFactor: false,
				sso: false,
				passwordPolicy: false,
				sessionTimeout: 480,
				ipWhitelist: false
			}
		},
		createdAt: '2024-01-01T08:00:00Z',
		updatedAt: '2024-01-01T08:00:00Z',
		lastLoginAt: '2024-01-01T08:00:00Z',
		isActive: false,
		isVerified: false,
		isPremium: false,
		verificationStatus: 'pending',
		notes: 'Trường mới đăng ký, đang chờ xét duyệt.'
	}
]

// Mock alerts
export const mockOrganizationAlerts: OrganizationAlert[] = [
	{
		id: 'alert-1',
		type: 'subscription_expiry',
		severity: 'medium',
		title: 'Subscription sắp hết hạn',
		message: 'Subscription của FPT Software sẽ hết hạn trong 30 ngày',
		organizationId: 'org-2',
		organizationName: 'FPT Software',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		resolved: false,
		actionRequired: true
	},
	{
		id: 'alert-2',
		type: 'verification_pending',
		severity: 'low',
		title: 'Chờ xác minh tổ chức',
		message: 'Startup TechHub đang chờ xác minh thông tin',
		organizationId: 'org-5',
		organizationName: 'Startup TechHub',
		timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
		resolved: false,
		actionRequired: true
	},
	{
		id: 'alert-3',
		type: 'inactive_user',
		severity: 'low',
		title: 'Tổ chức không hoạt động',
		message: 'ABC Corp đã không đăng nhập trong 30 ngày',
		organizationId: 'org-7',
		organizationName: 'Công ty TNHH ABC Corp',
		timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
		resolved: true,
		actionRequired: false
	}
]

// Mock activities
export const mockOrganizationActivities: OrganizationActivity[] = [
	{
		id: 'act-1',
		type: 'created',
		organizationId: 'org-8',
		organizationName: 'Trường Cao đẳng Nghề Công nghệ',
		userId: 'admin-1',
		userName: 'Admin System',
		description: 'Tổ chức mới được tạo',
		timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
	},
	{
		id: 'act-2',
		type: 'updated',
		organizationId: 'org-1',
		organizationName: 'Đại học Bách Khoa Hà Nội',
		userId: 'admin-2',
		userName: 'Admin User',
		description: 'Cập nhật thông tin liên hệ',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
	},
	{
		id: 'act-3',
		type: 'verified',
		organizationId: 'org-6',
		organizationName: 'Tổ chức Phi lợi nhuận GreenTech',
		userId: 'admin-1',
		userName: 'Admin System',
		description: 'Tổ chức đã được xác minh',
		timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
	}
]

// Mock dashboard data
export const mockOrganizationDashboard: OrganizationDashboard = {
	stats: {
		totalOrganizations: 8,
		activeOrganizations: 6,
		inactiveOrganizations: 1,
		pendingOrganizations: 1,
		verifiedOrganizations: 6,
		premiumOrganizations: 3,
		totalEmployees: 20545,
		totalStudents: 60100,
		totalCourses: 565,
		totalRevenue: 2780000000000,
		averageEmployees: 2568,
		averageStudents: 7513,
		averageCourses: 71,
		topIndustries: [
			{ industry: 'Giáo dục', count: 4 },
			{ industry: 'Công nghệ thông tin', count: 2 },
			{ industry: 'Công nghệ', count: 1 },
			{ industry: 'Môi trường', count: 1 }
		],
		topCountries: [
			{ country: 'Việt Nam', count: 8 }
		],
		subscriptionDistribution: [
			{ plan: 'enterprise', count: 2 },
			{ plan: 'professional', count: 3 },
			{ plan: 'basic', count: 2 },
			{ plan: 'free', count: 1 }
		],
		sizeDistribution: [
			{ size: 'enterprise', count: 1 },
			{ size: 'large', count: 1 },
			{ size: 'medium', count: 4 },
			{ size: 'small', count: 2 }
		],
		monthlyGrowth: [
			{ month: '2023-07', count: 1 },
			{ month: '2023-08', count: 0 },
			{ month: '2023-09', count: 0 },
			{ month: '2023-10', count: 0 },
			{ month: '2023-11', count: 0 },
			{ month: '2023-12', count: 0 },
			{ month: '2024-01', count: 1 }
		]
	},
	recentOrganizations: mockOrganizations.slice(0, 5),
	topOrganizations: mockOrganizations.slice(0, 3),
	expiringSubscriptions: mockOrganizations.filter(org => 
		new Date(org.subscriptionExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
	),
	verificationPending: mockOrganizations.filter(org => org.verificationStatus === 'pending'),
	alerts: mockOrganizationAlerts
}
