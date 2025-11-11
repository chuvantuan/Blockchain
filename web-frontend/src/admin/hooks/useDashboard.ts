import { useState, useEffect, useCallback } from 'react'
import { DashboardData, DashboardFilters, DashboardSettings, RecentActivity, ActivityType, ActivityStatus } from '../types/dashboard'
import { mockDashboardData } from '../mock/dashboard'

export default function useDashboard() {
	const [data, setData] = useState<DashboardData>(mockDashboardData)
	const [loading, setLoading] = useState(false)
	const [filters, setFilters] = useState<DashboardFilters>({
		timeRange: '30d',
		activityType: 'all',
		status: 'all'
	})
	const [settings, setSettings] = useState<DashboardSettings>({
		refreshInterval: 30,
		autoRefresh: true,
		showCharts: true,
		showActivities: true,
		showSystemHealth: true,
		chartType: 'line',
		theme: 'light'
	})

	// Simulate real-time updates
	useEffect(() => {
		if (!settings.autoRefresh) return

		const interval = setInterval(() => {
			// Simulate new activities
			const newActivity: RecentActivity = {
				id: `act-${Date.now()}`,
				type: ['user_registration', 'course_enrollment', 'course_completion', 'payment_received'][Math.floor(Math.random() * 4)] as ActivityType,
				title: 'Hoạt động mới',
				description: 'Một hoạt động mới vừa được thêm vào hệ thống',
				timestamp: new Date().toISOString(),
				status: 'success' as ActivityStatus
			}

			setData(prev => ({
				...prev,
				recentActivities: [newActivity, ...prev.recentActivities.slice(0, 9)],
				stats: {
					...prev.stats,
					todayEnrollments: prev.stats.todayEnrollments + Math.floor(Math.random() * 5),
					todayRevenue: prev.stats.todayRevenue + Math.floor(Math.random() * 100000)
				}
			}))
		}, settings.refreshInterval * 1000)

		return () => clearInterval(interval)
	}, [settings.autoRefresh, settings.refreshInterval])

	// Filter activities based on current filters
	const filteredActivities = data.recentActivities.filter(activity => {
		if (filters.activityType !== 'all' && activity.type !== filters.activityType) {
			return false
		}
		if (filters.status !== 'all' && activity.status !== filters.status) {
			return false
		}
		return true
	})

	// Update filters
	const updateFilter = useCallback((key: keyof DashboardFilters, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}, [])

	// Clear all filters
	const clearFilters = useCallback(() => {
		setFilters({
			timeRange: '30d',
			activityType: 'all',
			status: 'all'
		})
	}, [])

	// Update settings
	const updateSettings = useCallback((key: keyof DashboardSettings, value: any) => {
		setSettings(prev => ({ ...prev, [key]: value }))
	}, [])

	// Refresh data
	const refreshData = useCallback(async () => {
		setLoading(true)
		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000))
			
			// Update stats with some random changes
			setData(prev => ({
				...prev,
				stats: {
					...prev.stats,
					totalUsers: prev.stats.totalUsers + Math.floor(Math.random() * 10),
					totalEnrollments: prev.stats.totalEnrollments + Math.floor(Math.random() * 50),
					todayEnrollments: Math.floor(Math.random() * 100) + 200,
					todayRevenue: Math.floor(Math.random() * 1000000) + 2000000
				}
			}))
		} catch (error) {
			console.error('Error refreshing data:', error)
		} finally {
			setLoading(false)
		}
	}, [])

	// Get chart data based on filters
	const getChartData = useCallback(() => {
		const { timeRange } = filters
		
		// Filter data based on time range
		let filteredData = data.userGrowth
		if (timeRange !== 'all') {
			const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
			const cutoffDate = new Date()
			cutoffDate.setDate(cutoffDate.getDate() - days)
			
			filteredData = data.userGrowth.filter(d => new Date(d.date) >= cutoffDate)
		}

		return {
			userGrowth: {
				labels: filteredData.map(d => new Date(d.date).toLocaleDateString()),
				datasets: [
					{
						label: 'Tổng người dùng',
						data: filteredData.map(d => d.users),
						backgroundColor: 'rgba(59, 130, 246, 0.1)',
						borderColor: 'rgba(59, 130, 246, 1)',
						borderWidth: 2,
						fill: true,
						tension: 0.4
					},
					{
						label: 'Người dùng mới',
						data: filteredData.map(d => d.newUsers),
						backgroundColor: 'rgba(16, 185, 129, 0.1)',
						borderColor: 'rgba(16, 185, 129, 1)',
						borderWidth: 2,
						fill: false,
						tension: 0.4
					}
				]
			},
			courseCategories: data.chartData.courseCategories,
			revenueTrend: {
				labels: filteredData.map(d => new Date(d.date).toLocaleDateString()),
				datasets: [
					{
						label: 'Doanh thu (LEARN)',
						data: filteredData.map(() => Math.floor(Math.random() * 5000000) + 2000000),
						backgroundColor: 'rgba(245, 158, 11, 0.1)',
						borderColor: 'rgba(245, 158, 11, 1)',
						borderWidth: 2,
						fill: true,
						tension: 0.4
					}
				]
			}
		}
	}, [data, filters])

	// Get top performers
	const getTopPerformers = useCallback((limit: number = 5) => {
		return data.topPerformers.slice(0, limit)
	}, [data.topPerformers])

	// Get system health status
	const getSystemHealth = useCallback(() => {
		return data.systemHealth
	}, [data.systemHealth])

	// Get activity summary
	const getActivitySummary = useCallback(() => {
		const summary = {
			total: data.recentActivities.length,
			byType: {} as Record<ActivityType, number>,
			byStatus: {} as Record<ActivityStatus, number>
		}

		data.recentActivities.forEach(activity => {
			summary.byType[activity.type] = (summary.byType[activity.type] || 0) + 1
			summary.byStatus[activity.status] = (summary.byStatus[activity.status] || 0) + 1
		})

		return summary
	}, [data.recentActivities])

	return {
		// Data
		data,
		stats: data.stats,
		userGrowth: data.userGrowth,
		courseCategories: data.courseCategories,
		recentActivities: filteredActivities,
		topPerformers: data.topPerformers,
		systemHealth: data.systemHealth,
		chartData: getChartData(),
		
		// State
		loading,
		filters,
		settings,
		
		// Actions
		updateFilter,
		clearFilters,
		updateSettings,
		refreshData,
		
		// Computed
		getTopPerformers,
		getSystemHealth,
		getActivitySummary
	}
}
