// Mock data cho Certification Management

import { 
	CertificateTemplate, 
	IssuedCertificate, 
	CertificateDashboard, 
	CertificateStats, 
	CertificateAlert, 
	CertificateActivity,
	CertificateCategory,
	CertificateLevel,
	CertificateStatus,
	RequirementType
} from '../types/certification'

// Mock certificate templates
export const mockCertificateTemplates: CertificateTemplate[] = [
	{
		id: 'cert-template-1',
		name: 'Chứng chỉ Hoàn thành Khóa học ReactJS',
		description: 'Chứng chỉ được cấp cho học viên hoàn thành khóa học ReactJS từ cơ bản đến nâng cao',
		category: 'course_completion',
		level: 'intermediate',
		requirements: [
			{
				id: 'req-1',
				type: 'course_completion',
				description: 'Hoàn thành 100% nội dung khóa học',
				value: 100,
				unit: '%',
				isMandatory: true
			},
			{
				id: 'req-2',
				type: 'exam_score',
				description: 'Đạt điểm thi cuối khóa tối thiểu 70%',
				value: 70,
				unit: '%',
				isMandatory: true
			},
			{
				id: 'req-3',
				type: 'assignment_submission',
				description: 'Nộp đủ 5 bài tập thực hành',
				value: 5,
				unit: 'bài',
				isMandatory: true
			}
		],
		validityPeriod: 24,
		issuer: 'EduPlatform',
		issuerLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face',
		templateDesign: {
			layout: 'modern',
			colors: {
				primary: '#3b82f6',
				secondary: '#1e40af',
				accent: '#f59e0b',
				text: '#1f2937',
				background: '#ffffff'
			},
			fonts: {
				title: 'Inter',
				subtitle: 'Inter',
				body: 'Inter',
				details: 'Inter'
			},
			elements: {
				logo: true,
				signature: true,
				seal: true,
				border: true,
				watermark: true,
				qrCode: true
			},
			dimensions: {
				width: 800,
				height: 600,
				unit: 'px'
			}
		},
		metadata: {
			tags: ['ReactJS', 'Frontend', 'JavaScript', 'Web Development'],
			keywords: ['react', 'javascript', 'frontend', 'web'],
			industry: ['Technology', 'Software Development'],
			prerequisites: ['HTML', 'CSS', 'JavaScript cơ bản'],
			benefits: ['Tăng cơ hội việc làm', 'Nâng cao kỹ năng lập trình'],
			recognition: ['Được công nhận bởi các công ty công nghệ'],
			compliance: ['ISO 9001', 'IEEE Standards']
		},
		isActive: true,
		createdAt: '2023-01-15T08:00:00Z',
		updatedAt: '2024-01-15T10:30:00Z'
	},
	{
		id: 'cert-template-2',
		name: 'Chứng chỉ Kỹ năng Lãnh đạo',
		description: 'Chứng chỉ dành cho các nhà lãnh đạo và quản lý cấp trung',
		category: 'leadership',
		level: 'advanced',
		requirements: [
			{
				id: 'req-4',
				type: 'course_completion',
				description: 'Hoàn thành khóa học Leadership',
				value: 100,
				unit: '%',
				isMandatory: true
			},
			{
				id: 'req-5',
				type: 'project_completion',
				description: 'Hoàn thành dự án thực tế',
				value: 1,
				unit: 'dự án',
				isMandatory: true
			},
			{
				id: 'req-6',
				type: 'peer_review',
				description: 'Được đánh giá tích cực từ đồng nghiệp',
				value: 80,
				unit: '%',
				isMandatory: true
			}
		],
		validityPeriod: 36,
		issuer: 'EduPlatform',
		issuerLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face',
		templateDesign: {
			layout: 'classic',
			colors: {
				primary: '#059669',
				secondary: '#047857',
				accent: '#f59e0b',
				text: '#1f2937',
				background: '#ffffff'
			},
			fonts: {
				title: 'Playfair Display',
				subtitle: 'Inter',
				body: 'Inter',
				details: 'Inter'
			},
			elements: {
				logo: true,
				signature: true,
				seal: true,
				border: true,
				watermark: true,
				qrCode: true
			},
			dimensions: {
				width: 800,
				height: 600,
				unit: 'px'
			}
		},
		metadata: {
			tags: ['Leadership', 'Management', 'Soft Skills'],
			keywords: ['leadership', 'management', 'team'],
			industry: ['Business', 'Management'],
			prerequisites: ['Kinh nghiệm quản lý tối thiểu 2 năm'],
			benefits: ['Nâng cao kỹ năng lãnh đạo', 'Tăng cơ hội thăng tiến'],
			recognition: ['Được công nhận bởi các tổ chức quản lý'],
			compliance: ['ISO 9001']
		},
		isActive: true,
		createdAt: '2023-02-20T10:00:00Z',
		updatedAt: '2024-01-14T16:20:00Z'
	},
	{
		id: 'cert-template-3',
		name: 'Chứng chỉ AWS Cloud Practitioner',
		description: 'Chứng chỉ chuyên nghiệp về Amazon Web Services',
		category: 'industry_certification',
		level: 'expert',
		requirements: [
			{
				id: 'req-7',
				type: 'exam_score',
				description: 'Đạt điểm thi AWS Cloud Practitioner',
				value: 70,
				unit: '%',
				isMandatory: true
			},
			{
				id: 'req-8',
				type: 'time_spent',
				description: 'Học tập tối thiểu 40 giờ',
				value: 40,
				unit: 'giờ',
				isMandatory: true
			},
			{
				id: 'req-9',
				type: 'project_completion',
				description: 'Hoàn thành 3 lab thực hành',
				value: 3,
				unit: 'lab',
				isMandatory: true
			}
		],
		validityPeriod: 12,
		issuer: 'EduPlatform',
		issuerLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face',
		templateDesign: {
			layout: 'minimal',
			colors: {
				primary: '#ff9900',
				secondary: '#232f3e',
				accent: '#146eb4',
				text: '#232f3e',
				background: '#ffffff'
			},
			fonts: {
				title: 'Amazon Ember',
				subtitle: 'Amazon Ember',
				body: 'Amazon Ember',
				details: 'Amazon Ember'
			},
			elements: {
				logo: true,
				signature: true,
				seal: false,
				border: false,
				watermark: true,
				qrCode: true
			},
			dimensions: {
				width: 800,
				height: 600,
				unit: 'px'
			}
		},
		metadata: {
			tags: ['AWS', 'Cloud', 'DevOps', 'Infrastructure'],
			keywords: ['aws', 'cloud', 'devops', 'infrastructure'],
			industry: ['Technology', 'Cloud Computing'],
			prerequisites: ['Kiến thức cơ bản về cloud computing'],
			benefits: ['Tăng cơ hội việc làm trong lĩnh vực cloud', 'Nâng cao kỹ năng DevOps'],
			recognition: ['Được công nhận bởi Amazon Web Services'],
			compliance: ['AWS Standards']
		},
		isActive: true,
		createdAt: '2023-03-10T14:00:00Z',
		updatedAt: '2024-01-12T11:15:00Z'
	},
	{
		id: 'cert-template-4',
		name: 'Chứng chỉ Kỹ năng Giao tiếp',
		description: 'Chứng chỉ về kỹ năng giao tiếp và thuyết trình',
		category: 'soft_skills',
		level: 'beginner',
		requirements: [
			{
				id: 'req-10',
				type: 'course_completion',
				description: 'Hoàn thành khóa học Communication Skills',
				value: 100,
				unit: '%',
				isMandatory: true
			},
			{
				id: 'req-11',
				type: 'attendance_rate',
				description: 'Tham gia tối thiểu 80% buổi học',
				value: 80,
				unit: '%',
				isMandatory: true
			},
			{
				id: 'req-12',
				type: 'quiz_score',
				description: 'Đạt điểm quiz tối thiểu 75%',
				value: 75,
				unit: '%',
				isMandatory: true
			}
		],
		validityPeriod: 18,
		issuer: 'EduPlatform',
		issuerLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face',
		templateDesign: {
			layout: 'creative',
			colors: {
				primary: '#8b5cf6',
				secondary: '#7c3aed',
				accent: '#f59e0b',
				text: '#1f2937',
				background: '#ffffff'
			},
			fonts: {
				title: 'Poppins',
				subtitle: 'Poppins',
				body: 'Inter',
				details: 'Inter'
			},
			elements: {
				logo: true,
				signature: true,
				seal: true,
				border: true,
				watermark: false,
				qrCode: true
			},
			dimensions: {
				width: 800,
				height: 600,
				unit: 'px'
			}
		},
		metadata: {
			tags: ['Communication', 'Soft Skills', 'Presentation'],
			keywords: ['communication', 'presentation', 'soft skills'],
			industry: ['General', 'Business'],
			prerequisites: ['Không có yêu cầu đặc biệt'],
			benefits: ['Cải thiện kỹ năng giao tiếp', 'Tăng tự tin trong thuyết trình'],
			recognition: ['Được công nhận rộng rãi'],
			compliance: ['General Standards']
		},
		isActive: true,
		createdAt: '2023-04-05T09:00:00Z',
		updatedAt: '2024-01-10T14:30:00Z'
	},
	{
		id: 'cert-template-5',
		name: 'Chứng chỉ Project Management Professional',
		description: 'Chứng chỉ chuyên nghiệp về quản lý dự án',
		category: 'project_management',
		level: 'master',
		requirements: [
			{
				id: 'req-13',
				type: 'course_completion',
				description: 'Hoàn thành khóa học PMP',
				value: 100,
				unit: '%',
				isMandatory: true
			},
			{
				id: 'req-14',
				type: 'exam_score',
				description: 'Đạt điểm thi PMP tối thiểu 80%',
				value: 80,
				unit: '%',
				isMandatory: true
			},
			{
				id: 'req-15',
				type: 'time_spent',
				description: 'Học tập tối thiểu 120 giờ',
				value: 120,
				unit: 'giờ',
				isMandatory: true
			},
			{
				id: 'req-16',
				type: 'project_completion',
				description: 'Quản lý thành công ít nhất 1 dự án',
				value: 1,
				unit: 'dự án',
				isMandatory: true
			}
		],
		validityPeriod: 60,
		issuer: 'EduPlatform',
		issuerLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face',
		templateDesign: {
			layout: 'classic',
			colors: {
				primary: '#dc2626',
				secondary: '#991b1b',
				accent: '#f59e0b',
				text: '#1f2937',
				background: '#ffffff'
			},
			fonts: {
				title: 'Times New Roman',
				subtitle: 'Times New Roman',
				body: 'Times New Roman',
				details: 'Times New Roman'
			},
			elements: {
				logo: true,
				signature: true,
				seal: true,
				border: true,
				watermark: true,
				qrCode: true
			},
			dimensions: {
				width: 800,
				height: 600,
				unit: 'px'
			}
		},
		metadata: {
			tags: ['Project Management', 'PMP', 'Professional'],
			keywords: ['pmp', 'project management', 'professional'],
			industry: ['Project Management', 'Business'],
			prerequisites: ['Kinh nghiệm quản lý dự án tối thiểu 3 năm'],
			benefits: ['Tăng cơ hội việc làm', 'Nâng cao kỹ năng quản lý'],
			recognition: ['Được công nhận bởi PMI'],
			compliance: ['PMI Standards', 'ISO 21500']
		},
		isActive: false,
		createdAt: '2023-05-15T11:00:00Z',
		updatedAt: '2024-01-08T13:20:00Z'
	}
]

// Mock issued certificates
export const mockIssuedCertificates: IssuedCertificate[] = [
	{
		id: 'issued-cert-1',
		certificateId: 'cert-template-1',
		certificateName: 'Chứng chỉ Hoàn thành Khóa học ReactJS',
		recipientId: 'user-1',
		recipientName: 'Nguyễn Văn An',
		recipientEmail: 'an.nguyen@email.com',
		organizationId: 'org-1',
		organizationName: 'Đại học Bách Khoa Hà Nội',
		courseId: 'course-1',
		courseName: 'ReactJS từ A đến Z',
		issuedAt: '2024-01-10T10:00:00Z',
		expiresAt: '2026-01-10T10:00:00Z',
		status: 'active',
		verificationCode: 'CERT-2024-001-ABC123',
		blockchainHash: '0x1234567890abcdef1234567890abcdef12345678',
		metadata: {
			score: 85,
			grade: 'A',
			completionDate: '2024-01-08T15:30:00Z',
			issuedBy: 'Dr. Trần Thị Lan',
			issuedByTitle: 'Giảng viên Khoa CNTT',
			verificationUrl: 'https://eduplatform.com/verify/CERT-2024-001-ABC123',
			additionalInfo: {
				projectScore: 90,
				examScore: 80,
				attendanceRate: 95
			}
		},
		downloadUrl: 'https://eduplatform.com/certificates/download/issued-cert-1',
		viewUrl: 'https://eduplatform.com/certificates/view/issued-cert-1'
	},
	{
		id: 'issued-cert-2',
		certificateId: 'cert-template-2',
		certificateName: 'Chứng chỉ Kỹ năng Lãnh đạo',
		recipientId: 'user-2',
		recipientName: 'Lê Thị Bình',
		recipientEmail: 'binh.le@email.com',
		organizationId: 'org-2',
		organizationName: 'FPT Software',
		courseId: 'course-2',
		courseName: 'Leadership Development Program',
		issuedAt: '2024-01-05T14:00:00Z',
		expiresAt: '2027-01-05T14:00:00Z',
		status: 'active',
		verificationCode: 'CERT-2024-002-DEF456',
		blockchainHash: '0xabcdef1234567890abcdef1234567890abcdef12',
		metadata: {
			score: 92,
			grade: 'A+',
			completionDate: '2024-01-03T16:45:00Z',
			issuedBy: 'Mr. Phạm Văn Cường',
			issuedByTitle: 'Giám đốc Đào tạo',
			verificationUrl: 'https://eduplatform.com/verify/CERT-2024-002-DEF456',
			additionalInfo: {
				leadershipScore: 95,
				teamworkScore: 88,
				communicationScore: 90
			}
		},
		downloadUrl: 'https://eduplatform.com/certificates/download/issued-cert-2',
		viewUrl: 'https://eduplatform.com/certificates/view/issued-cert-2'
	},
	{
		id: 'issued-cert-3',
		certificateId: 'cert-template-3',
		certificateName: 'Chứng chỉ AWS Cloud Practitioner',
		recipientId: 'user-3',
		recipientName: 'Hoàng Minh Tuấn',
		recipientEmail: 'tuan.hoang@email.com',
		organizationId: 'org-3',
		organizationName: 'Trung tâm Đào tạo CNTT Aptech',
		courseId: 'course-3',
		courseName: 'AWS Cloud Practitioner Certification',
		issuedAt: '2023-12-20T09:30:00Z',
		expiresAt: '2024-12-20T09:30:00Z',
		status: 'expired',
		verificationCode: 'CERT-2023-003-GHI789',
		blockchainHash: '0x7890abcdef1234567890abcdef1234567890abcd',
		metadata: {
			score: 78,
			grade: 'B+',
			completionDate: '2023-12-18T11:20:00Z',
			issuedBy: 'Mr. Nguyễn Văn Đức',
			issuedByTitle: 'Chuyên gia AWS',
			verificationUrl: 'https://eduplatform.com/verify/CERT-2023-003-GHI789',
			additionalInfo: {
				awsScore: 78,
				labScore: 82,
				examAttempts: 1
			}
		},
		downloadUrl: 'https://eduplatform.com/certificates/download/issued-cert-3',
		viewUrl: 'https://eduplatform.com/certificates/view/issued-cert-3'
	},
	{
		id: 'issued-cert-4',
		certificateId: 'cert-template-4',
		certificateName: 'Chứng chỉ Kỹ năng Giao tiếp',
		recipientId: 'user-4',
		recipientName: 'Phạm Thị Mai',
		recipientEmail: 'mai.pham@email.com',
		organizationId: 'org-4',
		organizationName: 'Trường THPT Chuyên Hà Nội - Amsterdam',
		courseId: 'course-4',
		courseName: 'Communication Skills Workshop',
		issuedAt: '2024-01-15T13:15:00Z',
		expiresAt: '2025-07-15T13:15:00Z',
		status: 'active',
		verificationCode: 'CERT-2024-004-JKL012',
		blockchainHash: '0x0123456789abcdef0123456789abcdef01234567',
		metadata: {
			score: 88,
			grade: 'A',
			completionDate: '2024-01-13T14:30:00Z',
			issuedBy: 'Ms. Trần Thị Hoa',
			issuedByTitle: 'Chuyên gia Giao tiếp',
			verificationUrl: 'https://eduplatform.com/verify/CERT-2024-004-JKL012',
			additionalInfo: {
				presentationScore: 90,
				communicationScore: 86,
				confidenceScore: 88
			}
		},
		downloadUrl: 'https://eduplatform.com/certificates/download/issued-cert-4',
		viewUrl: 'https://eduplatform.com/certificates/view/issued-cert-4'
	},
	{
		id: 'issued-cert-5',
		certificateId: 'cert-template-1',
		certificateName: 'Chứng chỉ Hoàn thành Khóa học ReactJS',
		recipientId: 'user-5',
		recipientName: 'Vũ Minh Khang',
		recipientEmail: 'khang.vu@email.com',
		organizationId: 'org-5',
		organizationName: 'Startup TechHub',
		courseId: 'course-1',
		courseName: 'ReactJS từ A đến Z',
		issuedAt: '2024-01-12T16:45:00Z',
		expiresAt: '2026-01-12T16:45:00Z',
		status: 'pending',
		verificationCode: 'CERT-2024-005-MNO345',
		metadata: {
			score: 75,
			grade: 'B',
			completionDate: '2024-01-10T12:00:00Z',
			issuedBy: 'Mr. Lê Văn Hùng',
			issuedByTitle: 'Giảng viên Frontend',
			verificationUrl: 'https://eduplatform.com/verify/CERT-2024-005-MNO345',
			additionalInfo: {
				projectScore: 80,
				examScore: 70,
				attendanceRate: 90
			}
		},
		downloadUrl: 'https://eduplatform.com/certificates/download/issued-cert-5',
		viewUrl: 'https://eduplatform.com/certificates/view/issued-cert-5'
	}
]

// Mock alerts
export const mockCertificateAlerts: CertificateAlert[] = [
	{
		id: 'alert-1',
		type: 'expiry_warning',
		severity: 'medium',
		title: 'Chứng chỉ sắp hết hạn',
		message: 'Chứng chỉ AWS Cloud Practitioner của Hoàng Minh Tuấn sẽ hết hạn trong 30 ngày',
		certificateId: 'issued-cert-3',
		organizationId: 'org-3',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		resolved: false,
		actionRequired: true
	},
	{
		id: 'alert-2',
		type: 'bulk_issue',
		severity: 'low',
		title: 'Cấp hàng loạt chứng chỉ',
		message: 'Đã cấp thành công 50 chứng chỉ ReactJS cho học viên',
		organizationId: 'org-1',
		timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
		resolved: true,
		actionRequired: false
	},
	{
		id: 'alert-3',
		type: 'verification_failed',
		severity: 'high',
		title: 'Xác minh chứng chỉ thất bại',
		message: 'Không thể xác minh chứng chỉ CERT-2024-001-ABC123',
		certificateId: 'issued-cert-1',
		timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
		resolved: false,
		actionRequired: true
	}
]

// Mock activities
export const mockCertificateActivities: CertificateActivity[] = [
	{
		id: 'act-1',
		type: 'issued',
		certificateId: 'issued-cert-5',
		certificateName: 'Chứng chỉ Hoàn thành Khóa học ReactJS',
		recipientId: 'user-5',
		recipientName: 'Vũ Minh Khang',
		organizationId: 'org-5',
		organizationName: 'Startup TechHub',
		userId: 'admin-1',
		userName: 'Admin System',
		description: 'Cấp chứng chỉ ReactJS cho học viên',
		timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
	},
	{
		id: 'act-2',
		type: 'verified',
		certificateId: 'issued-cert-2',
		certificateName: 'Chứng chỉ Kỹ năng Lãnh đạo',
		recipientId: 'user-2',
		recipientName: 'Lê Thị Bình',
		organizationId: 'org-2',
		organizationName: 'FPT Software',
		userId: 'user-10',
		userName: 'Nguyễn Văn X',
		description: 'Xác minh chứng chỉ thành công',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
	},
	{
		id: 'act-3',
		type: 'downloaded',
		certificateId: 'issued-cert-1',
		certificateName: 'Chứng chỉ Hoàn thành Khóa học ReactJS',
		recipientId: 'user-1',
		recipientName: 'Nguyễn Văn An',
		organizationId: 'org-1',
		organizationName: 'Đại học Bách Khoa Hà Nội',
		userId: 'user-1',
		userName: 'Nguyễn Văn An',
		description: 'Tải xuống chứng chỉ PDF',
		timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
	}
]

// Mock dashboard data
export const mockCertificateDashboard: CertificateDashboard = {
	stats: {
		totalTemplates: 5,
		activeTemplates: 4,
		totalIssued: 5,
		activeCertificates: 3,
		expiredCertificates: 1,
		revokedCertificates: 0,
		pendingCertificates: 1,
		totalRecipients: 5,
		totalOrganizations: 5,
		averageValidityPeriod: 30,
		mostPopularCategory: 'course_completion',
		mostPopularLevel: 'intermediate',
		certificatesByCategory: [
			{ category: 'course_completion', count: 2 },
			{ category: 'leadership', count: 1 },
			{ category: 'industry_certification', count: 1 },
			{ category: 'soft_skills', count: 1 }
		],
		certificatesByLevel: [
			{ level: 'intermediate', count: 2 },
			{ level: 'advanced', count: 1 },
			{ level: 'expert', count: 1 },
			{ level: 'beginner', count: 1 }
		],
		certificatesByStatus: [
			{ status: 'active', count: 3 },
			{ status: 'expired', count: 1 },
			{ status: 'pending', count: 1 }
		],
		monthlyIssuance: [
			{ month: '2023-12', count: 1 },
			{ month: '2024-01', count: 4 }
		],
		topOrganizations: [
			{ organizationId: 'org-1', organizationName: 'Đại học Bách Khoa Hà Nội', count: 1 },
			{ organizationId: 'org-2', organizationName: 'FPT Software', count: 1 },
			{ organizationId: 'org-3', organizationName: 'Trung tâm Đào tạo CNTT Aptech', count: 1 },
			{ organizationId: 'org-4', organizationName: 'Trường THPT Chuyên Hà Nội - Amsterdam', count: 1 },
			{ organizationId: 'org-5', organizationName: 'Startup TechHub', count: 1 }
		],
		topCourses: [
			{ courseId: 'course-1', courseName: 'ReactJS từ A đến Z', count: 2 },
			{ courseId: 'course-2', courseName: 'Leadership Development Program', count: 1 },
			{ courseId: 'course-3', courseName: 'AWS Cloud Practitioner Certification', count: 1 },
			{ courseId: 'course-4', courseName: 'Communication Skills Workshop', count: 1 }
		]
	},
	recentCertificates: mockIssuedCertificates.slice(0, 3),
	expiringCertificates: mockIssuedCertificates.filter(cert => 
		new Date(cert.expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
	),
	pendingCertificates: mockIssuedCertificates.filter(cert => cert.status === 'pending'),
	popularTemplates: mockCertificateTemplates.slice(0, 3),
	alerts: mockCertificateAlerts
}
