// Mock data cho System Administration

import { 
	AdminUser, 
	SystemHealth, 
	GlobalSettings, 
	AuditLog, 
	SystemAdminDashboard,
	AdminStats,
	SystemAlert,
	AdminActivity,
	SecurityEvent,
	PerformanceMetric,
	SystemMaintenance,
	AdminRole,
	AdminStatus,
	AdminPermission,
	HealthStatus,
	SettingsCategory,
	AuditAction,
	AuditResult,
	AlertType,
	AlertSeverity,
	SecurityEventType,
	MaintenanceType,
	MaintenanceStatus
} from '../types/admin'

// Mock admin users
export const mockAdminUsers: AdminUser[] = [
	{
		id: 'admin-1',
		username: 'superadmin',
		email: 'superadmin@eduplatform.com',
		fullName: 'Nguyễn Văn Admin',
		avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
		role: 'super_admin',
		permissions: [
			'user_management', 'content_management', 'system_settings', 'security_settings',
			'audit_logs', 'backup_restore', 'database_management', 'api_management',
			'notification_management', 'report_generation', 'certificate_management',
			'organization_management', 'course_management', 'exam_management',
			'proctoring_management', 'blockchain_management', 'token_management',
			'analytics_access', 'export_data', 'import_data'
		],
		status: 'active',
		lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		createdAt: '2023-01-01T00:00:00Z',
		updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		createdBy: 'system',
		loginAttempts: 0,
		isTwoFactorEnabled: true,
		preferences: {
			language: 'vi',
			timezone: 'Asia/Ho_Chi_Minh',
			theme: 'dark',
			notifications: {
				email: true,
				push: true,
				sms: false
			},
			dashboard: {
				layout: 'grid',
				widgets: ['system_health', 'recent_logs', 'security_alerts', 'performance'],
				refreshInterval: 30
			},
			security: {
				sessionTimeout: 480,
				requirePasswordChange: true,
				passwordExpiryDays: 90
			}
		},
		metadata: {
			department: 'IT Department',
			phone: '+84 123 456 789',
			address: 'Hà Nội, Việt Nam',
			bio: 'System Administrator với 10 năm kinh nghiệm',
			skills: ['System Administration', 'Security', 'Database Management'],
			certifications: ['AWS Certified Solutions Architect', 'CISSP'],
			notes: 'Primary system administrator',
			tags: ['senior', 'security', 'leadership']
		}
	},
	{
		id: 'admin-2',
		username: 'contentadmin',
		email: 'content@eduplatform.com',
		fullName: 'Trần Thị Content',
		avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
		role: 'content_admin',
		permissions: [
			'content_management', 'course_management', 'certificate_management',
			'organization_management', 'notification_management', 'analytics_access'
		],
		status: 'active',
		lastLoginAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
		createdAt: '2023-02-15T10:00:00Z',
		updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		createdBy: 'admin-1',
		loginAttempts: 0,
		isTwoFactorEnabled: false,
		preferences: {
			language: 'vi',
			timezone: 'Asia/Ho_Chi_Minh',
			theme: 'light',
			notifications: {
				email: true,
				push: false,
				sms: false
			},
			dashboard: {
				layout: 'list',
				widgets: ['content_stats', 'recent_activities'],
				refreshInterval: 60
			},
			security: {
				sessionTimeout: 240,
				requirePasswordChange: false,
				passwordExpiryDays: 180
			}
		},
		metadata: {
			department: 'Content Department',
			phone: '+84 987 654 321',
			address: 'TP.HCM, Việt Nam',
			bio: 'Content Manager chuyên về giáo dục trực tuyến',
			skills: ['Content Management', 'Educational Technology', 'Course Design'],
			certifications: ['Instructional Design Certificate'],
			notes: 'Manages all educational content',
			tags: ['content', 'education', 'creative']
		}
	},
	{
		id: 'admin-3',
		username: 'securityadmin',
		email: 'security@eduplatform.com',
		fullName: 'Lê Văn Security',
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
		role: 'security_admin',
		permissions: [
			'security_settings', 'audit_logs', 'user_management', 'api_management',
			'blockchain_management', 'analytics_access'
		],
		status: 'active',
		lastLoginAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		createdAt: '2023-03-10T14:30:00Z',
		updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		createdBy: 'admin-1',
		loginAttempts: 0,
		isTwoFactorEnabled: true,
		preferences: {
			language: 'en',
			timezone: 'UTC',
			theme: 'dark',
			notifications: {
				email: true,
				push: true,
				sms: true
			},
			dashboard: {
				layout: 'grid',
				widgets: ['security_alerts', 'audit_logs', 'threat_detection'],
				refreshInterval: 15
			},
			security: {
				sessionTimeout: 120,
				requirePasswordChange: true,
				passwordExpiryDays: 30
			}
		},
		metadata: {
			department: 'Security Department',
			phone: '+84 555 123 456',
			address: 'Đà Nẵng, Việt Nam',
			bio: 'Cybersecurity Expert với chuyên môn về blockchain',
			skills: ['Cybersecurity', 'Blockchain', 'Penetration Testing', 'Incident Response'],
			certifications: ['CISSP', 'CEH', 'CISM'],
			notes: 'Handles all security-related operations',
			tags: ['security', 'blockchain', 'expert']
		}
	},
	{
		id: 'admin-4',
		username: 'useradmin',
		email: 'users@eduplatform.com',
		fullName: 'Phạm Thị Users',
		avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
		role: 'user_admin',
		permissions: [
			'user_management', 'organization_management', 'notification_management',
			'analytics_access', 'export_data', 'import_data'
		],
		status: 'active',
		lastLoginAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
		createdAt: '2023-04-05T09:15:00Z',
		updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
		createdBy: 'admin-1',
		loginAttempts: 0,
		isTwoFactorEnabled: false,
		preferences: {
			language: 'vi',
			timezone: 'Asia/Ho_Chi_Minh',
			theme: 'auto',
			notifications: {
				email: true,
				push: true,
				sms: false
			},
			dashboard: {
				layout: 'grid',
				widgets: ['user_stats', 'organization_stats', 'recent_registrations'],
				refreshInterval: 45
			},
			security: {
				sessionTimeout: 360,
				requirePasswordChange: false,
				passwordExpiryDays: 120
			}
		},
		metadata: {
			department: 'User Management',
			phone: '+84 333 777 999',
			address: 'Cần Thơ, Việt Nam',
			bio: 'User Experience Manager với focus vào customer success',
			skills: ['User Management', 'Customer Success', 'Data Analysis'],
			certifications: ['Customer Success Manager'],
			notes: 'Manages user accounts and organizations',
			tags: ['users', 'customer-success', 'data']
		}
	},
	{
		id: 'admin-5',
		username: 'supportadmin',
		email: 'support@eduplatform.com',
		fullName: 'Hoàng Minh Support',
		avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
		role: 'support_admin',
		permissions: [
			'user_management', 'notification_management', 'analytics_access',
			'export_data', 'audit_logs'
		],
		status: 'suspended',
		lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
		createdAt: '2023-05-20T16:45:00Z',
		updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
		createdBy: 'admin-1',
		loginAttempts: 3,
		isTwoFactorEnabled: false,
		preferences: {
			language: 'vi',
			timezone: 'Asia/Ho_Chi_Minh',
			theme: 'light',
			notifications: {
				email: true,
				push: false,
				sms: false
			},
			dashboard: {
				layout: 'list',
				widgets: ['support_tickets', 'user_issues'],
				refreshInterval: 30
			},
			security: {
				sessionTimeout: 180,
				requirePasswordChange: true,
				passwordExpiryDays: 60
			}
		},
		metadata: {
			department: 'Support Department',
			phone: '+84 444 888 111',
			address: 'Hải Phòng, Việt Nam',
			bio: 'Technical Support Specialist',
			skills: ['Technical Support', 'Troubleshooting', 'Customer Service'],
			certifications: ['ITIL Foundation'],
			notes: 'Suspended due to policy violation',
			tags: ['support', 'technical', 'suspended']
		}
	}
]

// Mock system health
export const mockSystemHealth: SystemHealth = {
	overall: 'healthy',
	services: [
		{
			name: 'Web Server',
			status: 'healthy',
			uptime: 99.9,
			responseTime: 45,
			errorRate: 0.1,
			version: '2.4.41',
			port: 80,
			protocol: 'HTTP'
		},
		{
			name: 'API Gateway',
			status: 'healthy',
			uptime: 99.8,
			responseTime: 120,
			errorRate: 0.2,
			version: '1.2.3',
			port: 8080,
			protocol: 'HTTPS'
		},
		{
			name: 'Database',
			status: 'warning',
			uptime: 99.5,
			responseTime: 250,
			errorRate: 0.5,
			lastError: 'Connection timeout',
			version: '13.4',
			port: 5432,
			protocol: 'TCP'
		},
		{
			name: 'Redis Cache',
			status: 'healthy',
			uptime: 99.9,
			responseTime: 5,
			errorRate: 0.0,
			version: '6.2.6',
			port: 6379,
			protocol: 'TCP'
		},
		{
			name: 'Blockchain Node',
			status: 'healthy',
			uptime: 99.7,
			responseTime: 300,
			errorRate: 0.3,
			version: '1.0.0',
			port: 8545,
			protocol: 'HTTP'
		}
	],
	databases: [
		{
			name: 'PostgreSQL Main',
			status: 'warning',
			connections: {
				active: 45,
				max: 100,
				idle: 15
			},
			queries: {
				total: 125000,
				slow: 250,
				failed: 12
			},
			size: {
				current: 50000000000, // 50GB
				max: 100000000000, // 100GB
				growth: 5.2
			},
			backup: {
				lastBackup: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
				nextBackup: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
				status: 'healthy'
			}
		},
		{
			name: 'MongoDB Analytics',
			status: 'healthy',
			connections: {
				active: 20,
				max: 50,
				idle: 5
			},
			queries: {
				total: 45000,
				slow: 50,
				failed: 3
			},
			size: {
				current: 15000000000, // 15GB
				max: 50000000000, // 50GB
				growth: 2.1
			},
			backup: {
				lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
				nextBackup: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
				status: 'healthy'
			}
		}
	],
	storage: {
		total: 2000000000000, // 2TB
		used: 800000000000, // 800GB
		available: 1200000000000, // 1.2TB
		usage: {
			files: 300000000000, // 300GB
			databases: 65000000000, // 65GB
			logs: 50000000000, // 50GB
			backups: 200000000000, // 200GB
			cache: 185000000000 // 185GB
		},
		performance: {
			readSpeed: 500, // MB/s
			writeSpeed: 300, // MB/s
			latency: 2 // ms
		}
	},
	network: {
		bandwidth: {
			incoming: 150, // Mbps
			outgoing: 200, // Mbps
			max: 1000 // Mbps
		},
		latency: {
			average: 25, // ms
			min: 15, // ms
			max: 45 // ms
		},
		connections: {
			active: 1250,
			max: 2000,
			failed: 5
		},
		ssl: {
			status: 'healthy',
			expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
			issuer: 'Let\'s Encrypt'
		}
	},
	security: {
		threats: {
			blocked: 1250,
			detected: 45,
			resolved: 40
		},
		firewall: {
			status: 'healthy',
			rules: 150,
			blocked: 2500
		},
		antivirus: {
			status: 'healthy',
			lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
			threatsFound: 0
		},
		encryption: {
			status: 'healthy',
			algorithms: ['AES-256', 'RSA-2048', 'SHA-256'],
			keyRotation: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
		}
	},
	performance: {
		cpu: {
			usage: 45, // %
			cores: 8,
			temperature: 65 // °C
		},
		memory: {
			total: 32000000000, // 32GB
			used: 20000000000, // 20GB
			available: 12000000000, // 12GB
			swap: 2000000000 // 2GB
		},
		load: {
			average1m: 1.2,
			average5m: 1.5,
			average15m: 1.8
		},
		cache: {
			hitRate: 95.5, // %
			size: 2000000000, // 2GB
			evictions: 150
		}
	},
	uptime: {
		current: 99.8, // %
		average: 99.5, // %
		best: 99.9, // %
		worst: 98.5, // %
		incidents: 3,
		lastIncident: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
	},
	lastChecked: new Date().toISOString()
}

// Mock global settings
export const mockGlobalSettings: GlobalSettings[] = [
	{
		id: 'setting-1',
		category: 'general',
		name: 'Site Name',
		key: 'site.name',
		value: 'EduPlatform',
		type: 'string',
		description: 'Tên của website',
		isRequired: true,
		isPublic: true,
		validation: {
			required: true,
			min: 3,
			max: 50
		},
		updatedBy: 'admin-1',
		updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		version: 3
	},
	{
		id: 'setting-2',
		category: 'security',
		name: 'Password Policy',
		key: 'security.password_policy',
		value: {
			minLength: 8,
			requireUppercase: true,
			requireLowercase: true,
			requireNumbers: true,
			requireSpecialChars: true,
			maxAge: 90
		},
		type: 'object',
		description: 'Chính sách mật khẩu',
		isRequired: true,
		isPublic: false,
		updatedBy: 'admin-3',
		updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		version: 2
	},
	{
		id: 'setting-3',
		category: 'email',
		name: 'SMTP Server',
		key: 'email.smtp.host',
		value: 'smtp.gmail.com',
		type: 'string',
		description: 'SMTP server cho gửi email',
		isRequired: true,
		isPublic: false,
		validation: {
			required: true,
			pattern: '^[a-zA-Z0-9.-]+$'
		},
		updatedBy: 'admin-1',
		updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
		version: 1
	},
	{
		id: 'setting-4',
		category: 'storage',
		name: 'Max File Size',
		key: 'storage.max_file_size',
		value: 10485760, // 10MB
		type: 'number',
		description: 'Kích thước file tối đa (bytes)',
		isRequired: true,
		isPublic: true,
		validation: {
			min: 1048576, // 1MB
			max: 104857600 // 100MB
		},
		updatedBy: 'admin-2',
		updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
		version: 2
	},
	{
		id: 'setting-5',
		category: 'api',
		name: 'Rate Limit',
		key: 'api.rate_limit',
		value: 1000,
		type: 'number',
		description: 'Số request tối đa per minute',
		isRequired: true,
		isPublic: false,
		validation: {
			min: 100,
			max: 10000
		},
		updatedBy: 'admin-3',
		updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
		version: 1
	},
	{
		id: 'setting-6',
		category: 'notification',
		name: 'Enable Push Notifications',
		key: 'notification.push.enabled',
		value: true,
		type: 'boolean',
		description: 'Bật/tắt push notifications',
		isRequired: false,
		isPublic: true,
		updatedBy: 'admin-2',
		updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
		version: 1
	},
	{
		id: 'setting-7',
		category: 'backup',
		name: 'Backup Schedule',
		key: 'backup.schedule',
		value: '0 2 * * *', // Daily at 2 AM
		type: 'string',
		description: 'Lịch backup tự động (cron format)',
		isRequired: true,
		isPublic: false,
		validation: {
			pattern: '^[0-9*,\\/\\-\\s]+$'
		},
		updatedBy: 'admin-1',
		updatedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
		version: 1
	},
	{
		id: 'setting-8',
		category: 'maintenance',
		name: 'Maintenance Mode',
		key: 'maintenance.enabled',
		value: false,
		type: 'boolean',
		description: 'Bật/tắt chế độ bảo trì',
		isRequired: false,
		isPublic: true,
		updatedBy: 'admin-1',
		updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
		version: 1
	}
]

// Mock audit logs
export const mockAuditLogs: AuditLog[] = [
	{
		id: 'audit-1',
		timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		userId: 'admin-1',
		userName: 'Nguyễn Văn Admin',
		userRole: 'super_admin',
		action: 'update',
		resource: 'system_settings',
		resourceId: 'setting-2',
		details: {
			description: 'Updated password policy settings',
			changes: {
				'minLength': { old: 6, new: 8 },
				'maxAge': { old: 180, new: 90 }
			}
		},
		ipAddress: '192.168.1.100',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		sessionId: 'sess_abc123',
		result: 'success',
		metadata: {
			userAgentParsed: {
				browser: 'Chrome',
				os: 'Windows 10',
				device: 'Desktop'
			}
		}
	},
	{
		id: 'audit-2',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		userId: 'admin-3',
		userName: 'Lê Văn Security',
		userRole: 'security_admin',
		action: 'login',
		resource: 'authentication',
		details: {
			description: 'Successful login with 2FA',
			duration: 2.5
		},
		ipAddress: '192.168.1.105',
		userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
		sessionId: 'sess_def456',
		result: 'success',
		metadata: {
			loginMethod: 'password_2fa',
			location: 'Ho Chi Minh City, Vietnam'
		}
	},
	{
		id: 'audit-3',
		timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
		userId: 'admin-2',
		userName: 'Trần Thị Content',
		userRole: 'content_admin',
		action: 'create',
		resource: 'course',
		resourceId: 'course-123',
		details: {
			description: 'Created new course: ReactJS Fundamentals',
			affectedUsers: ['user-1', 'user-2', 'user-3']
		},
		ipAddress: '192.168.1.110',
		userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
		sessionId: 'sess_ghi789',
		result: 'success',
		metadata: {
			courseCategory: 'programming',
			courseLevel: 'beginner'
		}
	},
	{
		id: 'audit-4',
		timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
		userId: 'admin-5',
		userName: 'Hoàng Minh Support',
		userRole: 'support_admin',
		action: 'login',
		resource: 'authentication',
		details: {
			description: 'Failed login attempt - wrong password',
			error: 'Invalid credentials'
		},
		ipAddress: '192.168.1.115',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		sessionId: 'sess_jkl012',
		result: 'failure',
		metadata: {
			loginAttempts: 3,
			accountLocked: true
		}
	},
	{
		id: 'audit-5',
		timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
		userId: 'admin-1',
		userName: 'Nguyễn Văn Admin',
		userRole: 'super_admin',
		action: 'suspend_user',
		resource: 'admin_user',
		resourceId: 'admin-5',
		details: {
			description: 'Suspended admin user due to policy violation',
			affectedUsers: ['admin-5']
		},
		ipAddress: '192.168.1.100',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		sessionId: 'sess_mno345',
		result: 'success',
		metadata: {
			suspensionReason: 'policy_violation',
			suspensionDuration: 'indefinite'
		}
	}
]

// Mock system alerts
export const mockSystemAlerts: SystemAlert[] = [
	{
		id: 'alert-1',
		type: 'database',
		severity: 'high',
		title: 'Database Connection Pool Near Limit',
		message: 'PostgreSQL connection pool is at 90% capacity',
		source: 'Database Monitor',
		timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
		resolved: false,
		acknowledged: true,
		acknowledgedBy: 'admin-1',
		acknowledgedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
		metadata: {
			currentConnections: 90,
			maxConnections: 100,
			recommendedAction: 'Increase connection pool size'
		}
	},
	{
		id: 'alert-2',
		type: 'security',
		severity: 'critical',
		title: 'Multiple Failed Login Attempts',
		message: 'Detected 5 failed login attempts from IP 192.168.1.115',
		source: 'Security Monitor',
		timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		resolved: true,
		resolvedBy: 'admin-3',
		resolvedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
		acknowledged: true,
		acknowledgedBy: 'admin-3',
		acknowledgedAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
		metadata: {
			blockedIP: '192.168.1.115',
			attempts: 5,
			action: 'IP blocked for 1 hour'
		}
	},
	{
		id: 'alert-3',
		type: 'storage',
		severity: 'medium',
		title: 'Storage Usage High',
		message: 'Storage usage is at 80% capacity',
		source: 'Storage Monitor',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		resolved: false,
		acknowledged: false,
		metadata: {
			currentUsage: '800GB',
			totalCapacity: '1TB',
			recommendedAction: 'Clean up old files or expand storage'
		}
	}
]

// Mock admin activities
export const mockAdminActivities: AdminActivity[] = [
	{
		id: 'activity-1',
		adminId: 'admin-1',
		adminName: 'Nguyễn Văn Admin',
		action: 'System Configuration',
		description: 'Updated system security settings',
		timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		duration: 5,
		status: 'completed',
		metadata: {
			settingsUpdated: 3,
			impact: 'high'
		}
	},
	{
		id: 'activity-2',
		adminId: 'admin-2',
		adminName: 'Trần Thị Content',
		action: 'Content Management',
		description: 'Created new course template',
		timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		duration: 15,
		status: 'completed',
		metadata: {
			templateType: 'certificate',
			templateName: 'ReactJS Certificate'
		}
	},
	{
		id: 'activity-3',
		adminId: 'admin-3',
		adminName: 'Lê Văn Security',
		action: 'Security Scan',
		description: 'Performed security vulnerability scan',
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
		duration: 45,
		status: 'completed',
		metadata: {
			vulnerabilitiesFound: 2,
			severity: 'medium'
		}
	}
]

// Mock security events
export const mockSecurityEvents: SecurityEvent[] = [
	{
		id: 'security-1',
		type: 'brute_force',
		severity: 'high',
		description: 'Multiple failed login attempts detected',
		source: '192.168.1.115',
		target: 'admin-5',
		timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		resolved: true,
		details: {
			attempts: 5,
			timeWindow: '5 minutes',
			action: 'IP blocked'
		}
	},
	{
		id: 'security-2',
		type: 'unauthorized_access',
		severity: 'critical',
		description: 'Attempted access to restricted admin panel',
		source: '203.0.113.42',
		target: 'admin_panel',
		timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		resolved: true,
		details: {
			userAgent: 'curl/7.68.0',
			action: 'Request blocked by firewall'
		}
	}
]

// Mock performance metrics
export const mockPerformanceMetrics: PerformanceMetric[] = [
	{
		name: 'Response Time',
		value: 250,
		unit: 'ms',
		trend: 'stable',
		threshold: {
			warning: 500,
			critical: 1000
		},
		timestamp: new Date().toISOString()
	},
	{
		name: 'CPU Usage',
		value: 45,
		unit: '%',
		trend: 'up',
		threshold: {
			warning: 70,
			critical: 90
		},
		timestamp: new Date().toISOString()
	},
	{
		name: 'Memory Usage',
		value: 62,
		unit: '%',
		trend: 'down',
		threshold: {
			warning: 80,
			critical: 95
		},
		timestamp: new Date().toISOString()
	}
]

// Mock admin stats
export const mockAdminStats: AdminStats = {
	totalAdmins: 5,
	activeAdmins: 4,
	suspendedAdmins: 1,
	pendingAdmins: 0,
	lockedAdmins: 0,
	totalRoles: 7,
	totalPermissions: 20,
	recentLogins: 12,
	failedLogins: 3,
	twoFactorEnabled: 2,
	lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
	adminByRole: [
		{ role: 'super_admin', count: 1 },
		{ role: 'content_admin', count: 1 },
		{ role: 'security_admin', count: 1 },
		{ role: 'user_admin', count: 1 },
		{ role: 'support_admin', count: 1 }
	],
	adminByStatus: [
		{ status: 'active', count: 4 },
		{ status: 'suspended', count: 1 }
	],
	loginTrends: [
		{ date: '2024-01-15', logins: 8, failures: 1 },
		{ date: '2024-01-16', logins: 12, failures: 2 },
		{ date: '2024-01-17', logins: 10, failures: 0 },
		{ date: '2024-01-18', logins: 15, failures: 1 },
		{ date: '2024-01-19', logins: 9, failures: 2 }
	],
	permissionUsage: [
		{ permission: 'user_management', count: 3 },
		{ permission: 'content_management', count: 2 },
		{ permission: 'security_settings', count: 2 },
		{ permission: 'audit_logs', count: 3 },
		{ permission: 'analytics_access', count: 4 }
	]
}

// Mock system maintenance
export const mockSystemMaintenance: SystemMaintenance[] = [
	{
		id: 'maintenance-1',
		title: 'Database Optimization',
		description: 'Scheduled database optimization and cleanup',
		type: 'scheduled',
		scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
		duration: 120, // 2 hours
		status: 'scheduled',
		affectedServices: ['Database', 'API Gateway'],
		createdBy: 'admin-1',
		createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		notes: 'This maintenance will improve database performance'
	},
	{
		id: 'maintenance-2',
		title: 'Security Patch Update',
		description: 'Apply critical security patches',
		type: 'security',
		scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
		duration: 30, // 30 minutes
		status: 'scheduled',
		affectedServices: ['Web Server', 'API Gateway'],
		createdBy: 'admin-3',
		createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
		notes: 'Critical security update - requires immediate attention'
	}
]

// Mock dashboard data
export const mockSystemAdminDashboard: SystemAdminDashboard = {
	stats: mockAdminStats,
	systemHealth: mockSystemHealth,
	recentAuditLogs: mockAuditLogs.slice(0, 5),
	criticalAlerts: mockSystemAlerts.filter(alert => alert.severity === 'critical'),
	recentActivities: mockAdminActivities.slice(0, 3),
	topAdmins: [
		{ adminId: 'admin-1', adminName: 'Nguyễn Văn Admin', activityCount: 25 },
		{ adminId: 'admin-2', adminName: 'Trần Thị Content', activityCount: 18 },
		{ adminId: 'admin-3', adminName: 'Lê Văn Security', activityCount: 15 }
	],
	securityEvents: mockSecurityEvents.slice(0, 3),
	performanceMetrics: mockPerformanceMetrics
}
