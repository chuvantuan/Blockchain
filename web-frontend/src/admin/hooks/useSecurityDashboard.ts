import { useState, useMemo, useCallback, useEffect } from 'react'
import { 
	BlockchainModule, 
	ActivityLog, 
	SecurityAlert, 
	SecurityFilters, 
	SecurityDashboard 
} from '../types/security'
import { 
	mockSecurityDashboard,
	mockBlockchainModules,
	mockActivityLogs,
	mockSecurityAlerts
} from '../mock/security'

export default function useSecurityDashboard() {
	const [dashboard, setDashboard] = useState<SecurityDashboard>(mockSecurityDashboard)
	const [filters, setFilters] = useState<SecurityFilters>({
		search: '',
		module: 'all',
		status: 'all',
		severity: 'all',
		timeRange: 'today'
	})
	const [autoRefresh, setAutoRefresh] = useState(true)

	// Filter modules
	const filteredModules = useMemo(() => {
		let result = [...dashboard.modules]

		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			result = result.filter(module =>
				module.name.toLowerCase().includes(searchLower) ||
				module.description.toLowerCase().includes(searchLower) ||
				module.type.toLowerCase().includes(searchLower)
			)
		}

		// Module type filter
		if (filters.module !== 'all') {
			result = result.filter(module => module.type === filters.module)
		}

		// Status filter
		if (filters.status !== 'all') {
			result = result.filter(module => module.status === filters.status)
		}

		return result
	}, [dashboard.modules, filters])

	// Filter activities
	const filteredActivities = useMemo(() => {
		let result = [...dashboard.recentActivities]

		// Module filter
		if (filters.module !== 'all') {
			const moduleId = filters.module === 'anti_cheat' ? 'anti-cheat' :
							filters.module === 'copyright_protection' ? 'copyright-protection' :
							filters.module === 'token_rewards' ? 'token-rewards' :
							filters.module === 'multisig_wallet' ? 'multisig-wallet' : filters.module
			result = result.filter(activity => activity.module === moduleId)
		}

		// Severity filter
		if (filters.severity !== 'all') {
			result = result.filter(activity => activity.severity === filters.severity)
		}

		// Time range filter
		const now = new Date()
		const timeFilter = {
			today: 24 * 60 * 60 * 1000,
			week: 7 * 24 * 60 * 60 * 1000,
			month: 30 * 24 * 60 * 60 * 1000,
			all: Infinity
		}

		if (filters.timeRange !== 'all') {
			const timeLimit = timeFilter[filters.timeRange]
			result = result.filter(activity => {
				const activityTime = new Date(activity.timestamp).getTime()
				return (now.getTime() - activityTime) <= timeLimit
			})
		}

		return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
	}, [dashboard.recentActivities, filters])

	// Filter alerts
	const filteredAlerts = useMemo(() => {
		let result = [...dashboard.securityAlerts]

		// Module filter
		if (filters.module !== 'all') {
			const moduleId = filters.module === 'anti_cheat' ? 'anti-cheat' :
							filters.module === 'copyright_protection' ? 'copyright-protection' :
							filters.module === 'token_rewards' ? 'token-rewards' :
							filters.module === 'multisig_wallet' ? 'multisig-wallet' : filters.module
			result = result.filter(alert => alert.module === moduleId)
		}

		// Severity filter
		if (filters.severity !== 'all') {
			result = result.filter(alert => alert.severity === filters.severity)
		}

		return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
	}, [dashboard.securityAlerts, filters])

	// Update filter
	const updateFilter = useCallback((key: keyof SecurityFilters, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}, [])

	// Simulate real-time updates
	useEffect(() => {
		if (!autoRefresh) return

		const interval = setInterval(() => {
			setDashboard(prev => {
				const newModules = prev.modules.map(module => {
					if (module.status === 'offline') return module

					// Simulate random updates
					const random = Math.random()

					// Update response time
					if (random < 0.3) {
						const newResponseTime = Math.max(50, module.responseTime + (Math.random() - 0.5) * 100)
						return { ...module, responseTime: Math.round(newResponseTime) }
					}

					// Update transaction count
					if (random < 0.5 && random > 0.3) {
						const newTodayTransactions = module.todayTransactions + Math.floor(Math.random() * 3)
						return { ...module, todayTransactions: newTodayTransactions }
					}

					// Update security score (gradual changes)
					if (random < 0.7 && random > 0.5) {
						const scoreChange = (Math.random() - 0.5) * 2
						const newScore = Math.max(0, Math.min(100, module.securityScore + scoreChange))
						return { ...module, securityScore: Math.round(newScore) }
					}

					// Update last update time
					return { ...module, lastUpdate: new Date().toISOString() }
				})

				// Simulate new activities
				const shouldAddActivity = Math.random() < 0.1 // 10% chance
				let newActivities = [...prev.recentActivities]
				
				if (shouldAddActivity) {
					const modules = ['anti-cheat', 'copyright-protection', 'token-rewards', 'multisig-wallet']
					const types = ['transaction', 'user_action', 'system_event']
					const severities = ['info', 'warning']
					
					const newActivity: ActivityLog = {
						id: `log-${Date.now()}`,
						timestamp: new Date().toISOString(),
						module: modules[Math.floor(Math.random() * modules.length)],
						type: types[Math.floor(Math.random() * types.length)] as any,
						severity: severities[Math.floor(Math.random() * severities.length)] as any,
						message: 'Hoạt động mới được ghi nhận',
						details: { simulated: true }
					}
					
					newActivities = [newActivity, ...newActivities].slice(0, 50) // Keep last 50
				}

				return {
					...prev,
					modules: newModules,
					recentActivities: newActivities,
					overview: {
						...prev.overview,
						totalTransactions: newModules.reduce((sum, m) => sum + m.totalTransactions, 0),
						averageSecurityScore: Math.round(
							newModules.reduce((sum, m) => sum + m.securityScore, 0) / newModules.length
						)
					}
				}
			})
		}, 5000) // Update every 5 seconds

		return () => clearInterval(interval)
	}, [autoRefresh])

	// Actions
	const resolveAlert = useCallback((alertId: string) => {
		setDashboard(prev => ({
			...prev,
			securityAlerts: prev.securityAlerts.map(alert =>
				alert.id === alertId
					? {
						...alert,
						resolved: true,
						resolvedAt: new Date().toISOString(),
						resolvedBy: 'admin-user'
					}
					: alert
			)
		}))
	}, [])

	const addCustomActivity = useCallback((activity: Partial<ActivityLog>) => {
		const newActivity: ActivityLog = {
			id: `log-${Date.now()}`,
			timestamp: new Date().toISOString(),
			module: 'system',
			type: 'system_event',
			severity: 'info',
			message: 'Hoạt động tùy chỉnh',
			...activity
		}

		setDashboard(prev => ({
			...prev,
			recentActivities: [newActivity, ...prev.recentActivities].slice(0, 50)
		}))
	}, [])

	const getModuleById = useCallback((id: string) => {
		return dashboard.modules.find(module => module.id === id)
	}, [dashboard.modules])

	const getUnresolvedAlerts = useCallback(() => {
		return dashboard.securityAlerts.filter(alert => !alert.resolved)
	}, [dashboard.securityAlerts])

	const getActiveModules = useCallback(() => {
		return dashboard.modules.filter(module => module.status === 'active')
	}, [dashboard.modules])

	const getModulesByStatus = useCallback((status: string) => {
		return dashboard.modules.filter(module => module.status === status)
	}, [dashboard.modules])

	return {
		dashboard,
		modules: filteredModules,
		activities: filteredActivities,
		alerts: filteredAlerts,
		filters,
		updateFilter,
		autoRefresh,
		setAutoRefresh,
		resolveAlert,
		addCustomActivity,
		getModuleById,
		getUnresolvedAlerts,
		getActiveModules,
		getModulesByStatus
	}
}
