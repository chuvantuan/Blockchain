import { useState, useEffect, useCallback } from 'react'
import { 
	AdminUser, 
	SystemHealth, 
	GlobalSettings, 
	AuditLog, 
	SystemAdminDashboard,
	AdminForm,
	AdminFilters,
	AdminStats,
	SystemAlert,
	AdminActivity,
	SecurityEvent,
	PerformanceMetric,
	SystemMaintenance,
	AdminRole,
	AdminStatus,
	AdminPermission,
	SettingsCategory,
	SettingsType,
	AuditAction,
	AuditResult,
	AlertType,
	AlertSeverity,
	SecurityEventType,
	MaintenanceType,
	MaintenanceStatus
} from '../types/admin'
import { 
	mockAdminUsers, 
	mockSystemHealth, 
	mockGlobalSettings, 
	mockAuditLogs,
	mockSystemAdminDashboard,
	mockSystemAlerts,
	mockAdminActivities,
	mockSecurityEvents,
	mockPerformanceMetrics,
	mockSystemMaintenance
} from '../mock/admin'

export default function useSystemAdmin() {
	const [admins, setAdmins] = useState<AdminUser[]>(mockAdminUsers)
	const [systemHealth, setSystemHealth] = useState<SystemHealth>(mockSystemHealth)
	const [settings, setSettings] = useState<GlobalSettings[]>(mockGlobalSettings)
	const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs)
	const [dashboard, setDashboard] = useState<SystemAdminDashboard>(mockSystemAdminDashboard)
	const [alerts, setAlerts] = useState<SystemAlert[]>(mockSystemAlerts)
	const [activities, setActivities] = useState<AdminActivity[]>(mockAdminActivities)
	const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(mockSecurityEvents)
	const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>(mockPerformanceMetrics)
	const [maintenance, setMaintenance] = useState<SystemMaintenance[]>(mockSystemMaintenance)
	
	const [filters, setFilters] = useState<AdminFilters>({
		search: '',
		role: 'all',
		status: 'all',
		permission: 'all',
		department: 'all',
		isActive: 'all',
		hasTwoFactor: 'all'
	})
	const [loading, setLoading] = useState(false)

	// Filtered data
	const filteredAdmins = admins.filter(admin => {
		const matchesSearch = !filters.search || 
			admin.username.toLowerCase().includes(filters.search.toLowerCase()) ||
			admin.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
			admin.email.toLowerCase().includes(filters.search.toLowerCase())
		
		const matchesRole = filters.role === 'all' || admin.role === filters.role
		const matchesStatus = filters.status === 'all' || admin.status === filters.status
		const matchesPermission = filters.permission === 'all' || admin.permissions.includes(filters.permission)
		const matchesDepartment = filters.department === 'all' || admin.metadata.department === filters.department
		const matchesActive = filters.isActive === 'all' || admin.status === 'active' === filters.isActive
		const matchesTwoFactor = filters.hasTwoFactor === 'all' || admin.isTwoFactorEnabled === filters.hasTwoFactor

		return matchesSearch && matchesRole && matchesStatus && matchesPermission && 
			   matchesDepartment && matchesActive && matchesTwoFactor
	})

	// CRUD Operations for Admins
	const addAdmin = useCallback((adminForm: AdminForm) => {
		const newAdmin: AdminUser = {
			id: `admin-${Date.now()}`,
			...adminForm,
			lastLoginAt: new Date().toISOString(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			createdBy: 'current-admin', // In real app, get from auth context
			loginAttempts: 0,
			isTwoFactorEnabled: false,
			preferences: adminForm.preferences || {
				language: 'vi',
				timezone: 'Asia/Ho_Chi_Minh',
				theme: 'light',
				notifications: {
					email: true,
					push: false,
					sms: false
				},
				dashboard: {
					layout: 'grid',
					widgets: ['system_health', 'recent_logs'],
					refreshInterval: 30
				},
				security: {
					sessionTimeout: 240,
					requirePasswordChange: false,
					passwordExpiryDays: 90
				}
			},
			metadata: adminForm.metadata || {
				department: 'IT Department',
				phone: '',
				address: '',
				bio: '',
				skills: [],
				certifications: [],
				notes: '',
				tags: []
			}
		}
		setAdmins(prev => [newAdmin, ...prev])
		updateDashboardStats()
		addAuditLog({
			action: 'create',
			resource: 'admin_user',
			resourceId: newAdmin.id,
			details: {
				description: `Created new admin user: ${newAdmin.username}`,
				affectedUsers: [newAdmin.id]
			},
			result: 'success'
		})
	}, [])

	const updateAdmin = useCallback((adminForm: AdminForm, adminId: string) => {
		setAdmins(prev => prev.map(admin => 
			admin.id === adminId 
				? { ...admin, ...adminForm, updatedAt: new Date().toISOString() }
				: admin
		))
		updateDashboardStats()
		addAuditLog({
			action: 'update',
			resource: 'admin_user',
			resourceId: adminId,
			details: {
				description: `Updated admin user: ${adminForm.username || adminId}`,
				affectedUsers: [adminId]
			},
			result: 'success'
		})
	}, [])

	const deleteAdmin = useCallback((adminId: string) => {
		const admin = admins.find(a => a.id === adminId)
		setAdmins(prev => prev.filter(admin => admin.id !== adminId))
		updateDashboardStats()
		addAuditLog({
			action: 'delete',
			resource: 'admin_user',
			resourceId: adminId,
			details: {
				description: `Deleted admin user: ${admin?.username || adminId}`,
				affectedUsers: [adminId]
			},
			result: 'success'
		})
	}, [admins])

	const toggleAdminStatus = useCallback((adminId: string, newStatus: AdminStatus) => {
		const admin = admins.find(a => a.id === adminId)
		setAdmins(prev => prev.map(admin => 
			admin.id === adminId 
				? { ...admin, status: newStatus, updatedAt: new Date().toISOString() }
				: admin
		))
		updateDashboardStats()
		addAuditLog({
			action: newStatus === 'suspended' ? 'suspend_user' : 'activate_user',
			resource: 'admin_user',
			resourceId: adminId,
			details: {
				description: `${newStatus === 'suspended' ? 'Suspended' : 'Activated'} admin user: ${admin?.username || adminId}`,
				affectedUsers: [adminId]
			},
			result: 'success'
		})
	}, [admins])

	const resetAdminPassword = useCallback((adminId: string) => {
		const admin = admins.find(a => a.id === adminId)
		setAdmins(prev => prev.map(admin => 
			admin.id === adminId 
				? { ...admin, loginAttempts: 0, updatedAt: new Date().toISOString() }
				: admin
		))
		addAuditLog({
			action: 'reset_password',
			resource: 'admin_user',
			resourceId: adminId,
			details: {
				description: `Reset password for admin user: ${admin?.username || adminId}`,
				affectedUsers: [adminId]
			},
			result: 'success'
		})
	}, [admins])

	const toggleTwoFactor = useCallback((adminId: string) => {
		const admin = admins.find(a => a.id === adminId)
		setAdmins(prev => prev.map(admin => 
			admin.id === adminId 
				? { 
					...admin, 
					isTwoFactorEnabled: !admin.isTwoFactorEnabled, 
					updatedAt: new Date().toISOString() 
				}
				: admin
		))
		addAuditLog({
			action: admin?.isTwoFactorEnabled ? 'disable_2fa' : 'enable_2fa',
			resource: 'admin_user',
			resourceId: adminId,
			details: {
				description: `${admin?.isTwoFactorEnabled ? 'Disabled' : 'Enabled'} 2FA for admin user: ${admin?.username || adminId}`,
				affectedUsers: [adminId]
			},
			result: 'success'
		})
	}, [admins])

	// Settings operations
	const updateSetting = useCallback((settingId: string, value: any) => {
		setSettings(prev => prev.map(setting => 
			setting.id === settingId 
				? { 
					...setting, 
					value, 
					updatedAt: new Date().toISOString(),
					updatedBy: 'current-admin',
					version: setting.version + 1
				}
				: setting
		))
		addAuditLog({
			action: 'configure',
			resource: 'system_settings',
			resourceId: settingId,
			details: {
				description: `Updated system setting: ${settingId}`,
				changes: { value: { old: settings.find(s => s.id === settingId)?.value, new: value } }
			},
			result: 'success'
		})
	}, [settings])

	const addSetting = useCallback((setting: Partial<GlobalSettings>) => {
		const newSetting: GlobalSettings = {
			id: `setting-${Date.now()}`,
			category: setting.category || 'general',
			name: setting.name || '',
			key: setting.key || '',
			value: setting.value || '',
			type: setting.type || 'string',
			description: setting.description || '',
			isRequired: setting.isRequired || false,
			isPublic: setting.isPublic || false,
			updatedBy: 'current-admin',
			updatedAt: new Date().toISOString(),
			version: 1
		}
		setSettings(prev => [newSetting, ...prev])
		addAuditLog({
			action: 'create',
			resource: 'system_settings',
			resourceId: newSetting.id,
			details: {
				description: `Added new system setting: ${newSetting.name}`,
			},
			result: 'success'
		})
	}, [])

	const deleteSetting = useCallback((settingId: string) => {
		const setting = settings.find(s => s.id === settingId)
		setSettings(prev => prev.filter(setting => setting.id !== settingId))
		addAuditLog({
			action: 'delete',
			resource: 'system_settings',
			resourceId: settingId,
			details: {
				description: `Deleted system setting: ${setting?.name || settingId}`,
			},
			result: 'success'
		})
	}, [settings])

	const resetSetting = useCallback((settingId: string) => {
		const setting = settings.find(s => s.id === settingId)
		if (setting) {
			// Reset to default value (in real app, get from config)
			const defaultValue = getDefaultSettingValue(setting.key)
			updateSetting(settingId, defaultValue)
		}
	}, [updateSetting, settings])

	// Audit log operations
	const addAuditLog = useCallback((logData: Partial<AuditLog>) => {
		const newLog: AuditLog = {
			id: `audit-${Date.now()}`,
			timestamp: new Date().toISOString(),
			userId: 'current-admin',
			userName: 'Current Admin',
			userRole: 'super_admin',
			action: logData.action || 'read',
			resource: logData.resource || 'unknown',
			resourceId: logData.resourceId,
			details: logData.details || { description: 'No description' },
			ipAddress: '192.168.1.100',
			userAgent: navigator.userAgent,
			sessionId: 'current-session',
			result: logData.result || 'success',
			metadata: logData.metadata
		}
		setAuditLogs(prev => [newLog, ...prev.slice(0, 999)]) // Keep last 1000 logs
	}, [])

	// System health operations
	const refreshSystemHealth = useCallback(() => {
		setLoading(true)
		// Simulate API call
		setTimeout(() => {
			// Simulate some changes in system health
			setSystemHealth(prev => ({
				...prev,
				lastChecked: new Date().toISOString(),
				performance: {
					...prev.performance,
					cpu: {
						...prev.performance.cpu,
						usage: Math.random() * 100,
						temperature: 60 + Math.random() * 20
					},
					memory: {
						...prev.performance.memory,
						used: prev.performance.memory.total * (0.5 + Math.random() * 0.3)
					}
				}
			}))
			setLoading(false)
		}, 1000)
	}, [])

	// Filter operations
	const updateFilter = useCallback((key: keyof AdminFilters, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}, [])

	const clearFilters = useCallback(() => {
		setFilters({
			search: '',
			role: 'all',
			status: 'all',
			permission: 'all',
			department: 'all',
			isActive: 'all',
			hasTwoFactor: 'all'
		})
	}, [])

	// Dashboard stats update
	const updateDashboardStats = useCallback(() => {
		const stats: AdminStats = {
			totalAdmins: admins.length,
			activeAdmins: admins.filter(a => a.status === 'active').length,
			suspendedAdmins: admins.filter(a => a.status === 'suspended').length,
			pendingAdmins: admins.filter(a => a.status === 'pending').length,
			lockedAdmins: admins.filter(a => a.status === 'locked').length,
			totalRoles: new Set(admins.map(a => a.role)).size,
			totalPermissions: new Set(admins.flatMap(a => a.permissions)).size,
			recentLogins: auditLogs.filter(log => 
				log.action === 'login' && 
				new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
			).length,
			failedLogins: auditLogs.filter(log => 
				log.action === 'login' && log.result === 'failure'
			).length,
			twoFactorEnabled: admins.filter(a => a.isTwoFactorEnabled).length,
			lastActivity: auditLogs[0]?.timestamp || new Date().toISOString(),
			adminByRole: getAdminByRole(),
			adminByStatus: getAdminByStatus(),
			loginTrends: getLoginTrends(),
			permissionUsage: getPermissionUsage()
		}

		setDashboard(prev => ({
			...prev,
			stats
		}))
	}, [admins, auditLogs])

	// Helper functions for stats
	const getAdminByRole = () => {
		const roleCount: Record<string, number> = {}
		admins.forEach(admin => {
			roleCount[admin.role] = (roleCount[admin.role] || 0) + 1
		})
		return Object.entries(roleCount).map(([role, count]) => ({ role: role as AdminRole, count }))
	}

	const getAdminByStatus = () => {
		const statusCount: Record<string, number> = {}
		admins.forEach(admin => {
			statusCount[admin.status] = (statusCount[admin.status] || 0) + 1
		})
		return Object.entries(statusCount).map(([status, count]) => ({ status: status as AdminStatus, count }))
	}

	const getLoginTrends = () => {
		const trends: Array<{ date: string; logins: number; failures: number }> = []
		for (let i = 6; i >= 0; i--) {
			const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
			const dateStr = date.toISOString().split('T')[0]
			const dayLogs = auditLogs.filter(log => 
				log.timestamp.startsWith(dateStr) && log.action === 'login'
			)
			trends.push({
				date: dateStr,
				logins: dayLogs.filter(log => log.result === 'success').length,
				failures: dayLogs.filter(log => log.result === 'failure').length
			})
		}
		return trends
	}

	const getPermissionUsage = () => {
		const permissionCount: Record<string, number> = {}
		admins.forEach(admin => {
			admin.permissions.forEach(permission => {
				permissionCount[permission] = (permissionCount[permission] || 0) + 1
			})
		})
		return Object.entries(permissionCount)
			.map(([permission, count]) => ({ permission: permission as AdminPermission, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10)
	}

	const getDefaultSettingValue = (key: string) => {
		// In real app, get from configuration
		const defaults: Record<string, any> = {
			'site.name': 'EduPlatform',
			'security.password_policy': {
				minLength: 8,
				requireUppercase: true,
				requireLowercase: true,
				requireNumbers: true,
				requireSpecialChars: true,
				maxAge: 90
			},
			'email.smtp.host': 'smtp.gmail.com',
			'storage.max_file_size': 10485760,
			'api.rate_limit': 1000,
			'notification.push.enabled': true,
			'backup.schedule': '0 2 * * *',
			'maintenance.enabled': false
		}
		return defaults[key] || ''
	}

	// Real-time data simulation
	useEffect(() => {
		const interval = setInterval(() => {
			// Simulate new audit logs
			if (Math.random() < 0.1) { // 10% chance every 5 seconds
				const actions: AuditAction[] = ['login', 'logout', 'create', 'update', 'delete']
				const randomAction = actions[Math.floor(Math.random() * actions.length)]
				const randomAdmin = admins[Math.floor(Math.random() * admins.length)]
				
				addAuditLog({
					userId: randomAdmin.id,
					userName: randomAdmin.fullName,
					userRole: randomAdmin.role,
					action: randomAction,
					resource: 'system',
					details: {
						description: `Simulated ${randomAction} action`,
						duration: Math.random() * 5
					},
					result: Math.random() > 0.1 ? 'success' : 'failure'
				})
			}

			// Simulate system health updates
			if (Math.random() < 0.05) { // 5% chance every 5 seconds
				setSystemHealth(prev => ({
					...prev,
					lastChecked: new Date().toISOString(),
					performance: {
						...prev.performance,
						cpu: {
							...prev.performance.cpu,
							usage: Math.max(0, Math.min(100, prev.performance.cpu.usage + (Math.random() - 0.5) * 10))
						}
					}
				}))
			}

			// Simulate new alerts
			if (Math.random() < 0.02) { // 2% chance every 5 seconds
				const alertTypes: AlertType[] = ['security', 'performance', 'storage', 'network']
				const severities: AlertSeverity[] = ['low', 'medium', 'high', 'critical']
				const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
				const randomSeverity = severities[Math.floor(Math.random() * severities.length)]
				
				const newAlert: SystemAlert = {
					id: `alert-${Date.now()}`,
					type: randomType,
					severity: randomSeverity,
					title: `Simulated ${randomType} alert`,
					message: `This is a simulated ${randomSeverity} ${randomType} alert`,
					source: 'System Monitor',
					timestamp: new Date().toISOString(),
					resolved: false,
					acknowledged: false,
					metadata: {
						simulated: true
					}
				}
				
				setAlerts(prev => [newAlert, ...prev.slice(0, 99)]) // Keep last 100 alerts
			}
		}, 5000)

		return () => clearInterval(interval)
	}, [admins, addAuditLog])

	// Update dashboard stats when data changes
	useEffect(() => {
		updateDashboardStats()
	}, [admins, auditLogs, updateDashboardStats])

	return {
		// Data
		admins: filteredAdmins,
		allAdmins: admins,
		systemHealth,
		settings,
		auditLogs,
		dashboard,
		alerts,
		activities,
		securityEvents,
		performanceMetrics,
		maintenance,
		filters,
		
		// Admin operations
		addAdmin,
		updateAdmin,
		deleteAdmin,
		toggleAdminStatus,
		resetAdminPassword,
		toggleTwoFactor,
		
		// Settings operations
		updateSetting,
		addSetting,
		deleteSetting,
		resetSetting,
		
		// System operations
		refreshSystemHealth,
		
		// Filter operations
		updateFilter,
		clearFilters,
		
		// State
		loading,
		totalAdmins: admins.length,
		filteredAdminsCount: filteredAdmins.length
	}
}
