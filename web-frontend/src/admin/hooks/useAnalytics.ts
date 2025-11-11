import { useState, useEffect, useCallback } from 'react'
import {
	AnalyticsDashboard,
	KPIMetric,
	AnalyticsChart,
	TopListsWidget,
	AnalyticsFilters,
	DateRange,
	AnalyticsPeriod,
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
	AnalyticsComparison,
	AnalyticsSegment,
	AnalyticsGoal,
	AnalyticsBenchmark
} from '../types/analytics'

import {
	mockAnalyticsDashboard,
	mockKPIMetrics,
	mockAnalyticsCharts,
	mockTopLists,
	mockRevenueData,
	mockUserGrowthData,
	mockCourseAnalytics,
	mockUserAnalytics,
	mockOrganizationAnalytics,
	mockInstructorAnalytics,
	mockCertificateAnalytics,
	mockAnalyticsActivities,
	mockAnalyticsAlerts,
	mockAnalyticsInsights,
	mockGeographicData,
	mockDeviceAnalytics,
	mockTrafficSources
} from '../mock/analytics'

export const useAnalytics = () => {
	// State management
	const [dashboard, setDashboard] = useState<AnalyticsDashboard>(mockAnalyticsDashboard)
	const [kpis, setKpis] = useState<KPIMetric[]>(mockKPIMetrics)
	const [charts, setCharts] = useState<AnalyticsChart[]>(mockAnalyticsCharts)
	const [topLists, setTopLists] = useState<TopListsWidget[]>(mockTopLists)
	const [filters, setFilters] = useState<AnalyticsFilters>({
		dateRange: {
			start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
			end: new Date().toISOString().split('T')[0],
			label: '30 ngày qua'
		},
		period: 'last_30_days'
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	
	// Real-time data simulation
	const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
	
	// Data refresh
	const refreshData = useCallback(async () => {
		setLoading(true)
		setError(null)
		
		try {
			// Simulate API call delay
			await new Promise(resolve => setTimeout(resolve, 1000))
			
			// Update KPIs with slight variations
			const updatedKpis = kpis.map(kpi => ({
				...kpi,
				value: kpi.value + (Math.random() - 0.5) * kpi.value * 0.05, // ±2.5% variation
				change: kpi.change + (Math.random() - 0.5) * 2, // ±1% change variation
				trend: kpi.trend.map(value => value + (Math.random() - 0.5) * value * 0.03)
			}))
			
			setKpis(updatedKpis)
			
			// Update dashboard overview
			setDashboard(prev => ({
				...prev,
				overview: {
					...prev.overview,
					totalUsers: prev.overview.totalUsers + Math.floor(Math.random() * 10),
					activeUsers: prev.overview.activeUsers + Math.floor(Math.random() * 5),
					newUsersToday: prev.overview.newUsersToday + Math.floor(Math.random() * 3)
				},
				kpis: updatedKpis,
				lastUpdated: new Date().toISOString()
			}))
			
		} catch (err) {
			setError('Không thể làm mới dữ liệu')
		} finally {
			setLoading(false)
		}
	}, [kpis])
	
	// Real-time updates
	useEffect(() => {
		if (!isRealTimeEnabled) return
		
		const interval = setInterval(() => {
			// Simulate real-time updates every 30 seconds
			const updatedKpis = kpis.map(kpi => ({
				...kpi,
				value: kpi.value + (Math.random() - 0.5) * kpi.value * 0.01, // ±0.5% variation
				trend: [...kpi.trend.slice(1), kpi.value + (Math.random() - 0.5) * kpi.value * 0.02]
			}))
			
			setKpis(updatedKpis)
			
			// Update recent activities
			const newActivity: AnalyticsActivity = {
				id: `activity-${Date.now()}`,
				type: 'course_completion',
				title: 'Hoàn thành khóa học mới',
				description: `Người dùng đã hoàn thành khóa học ${Math.floor(Math.random() * 100)}`,
				timestamp: new Date().toISOString(),
				impact: 'medium'
			}
			
			setDashboard(prev => ({
				...prev,
				kpis: updatedKpis,
				recentActivity: [newActivity, ...prev.recentActivity.slice(0, 9)]
			}))
		}, 30000)
		
		return () => clearInterval(interval)
	}, [isRealTimeEnabled, kpis])
	
	// Filter functions
	const updateFilters = useCallback((newFilters: Partial<AnalyticsFilters>) => {
		setFilters(prev => ({ ...prev, ...newFilters }))
	}, [])
	
	const updateDateRange = useCallback((dateRange: DateRange) => {
		setFilters(prev => ({ ...prev, dateRange }))
	}, [])
	
	const updatePeriod = useCallback((period: AnalyticsPeriod) => {
		setFilters(prev => ({ ...prev, period }))
	}, [])
	
	// Data export functions
	const exportToExcel = useCallback(async (dataType: string) => {
		try {
			// Simulate Excel export
			const data = {
				kpis,
				charts,
				topLists,
				revenueData: mockRevenueData,
				userGrowthData: mockUserGrowthData,
				courseAnalytics: mockCourseAnalytics,
				userAnalytics: mockUserAnalytics,
				organizationAnalytics: mockOrganizationAnalytics,
				instructorAnalytics: mockInstructorAnalytics,
				certificateAnalytics: mockCertificateAnalytics
			}
			
			// In real implementation, this would generate and download Excel file
			console.log(`Exporting ${dataType} to Excel:`, data)
			
			return { success: true, message: `Đã xuất ${dataType} thành công` }
		} catch (error) {
			return { success: false, message: 'Lỗi khi xuất dữ liệu' }
		}
	}, [kpis, charts, topLists])
	
	const exportToPDF = useCallback(async (dataType: string) => {
		try {
			// Simulate PDF export
			console.log(`Exporting ${dataType} to PDF`)
			return { success: true, message: `Đã xuất ${dataType} thành công` }
		} catch (error) {
			return { success: false, message: 'Lỗi khi xuất dữ liệu' }
		}
	}, [])
	
	// Chart functions
	const refreshChart = useCallback((chartId: string) => {
		setCharts(prev => prev.map(chart => 
			chart.id === chartId 
				? { ...chart, lastUpdated: new Date().toISOString() }
				: chart
		))
	}, [])
	
	const exportChart = useCallback((chartId: string, format: 'png' | 'jpg' | 'pdf') => {
		const chart = charts.find(c => c.id === chartId)
		if (chart) {
			console.log(`Exporting chart ${chartId} as ${format}`)
			return { success: true, message: `Đã xuất biểu đồ ${chart.title} thành công` }
		}
		return { success: false, message: 'Không tìm thấy biểu đồ' }
	}, [charts])
	
	const configureChart = useCallback((chartId: string) => {
		console.log(`Configuring chart ${chartId}`)
		return { success: true, message: 'Mở cấu hình biểu đồ' }
	}, [])
	
	const fullscreenChart = useCallback((chartId: string) => {
		console.log(`Fullscreen chart ${chartId}`)
		return { success: true, message: 'Mở biểu đồ toàn màn hình' }
	}, [])
	
	// Top lists functions
	const refreshTopList = useCallback((widgetId: string) => {
		setTopLists(prev => prev.map(widget => 
			widget.id === widgetId 
				? { ...widget, lastUpdated: new Date().toISOString() }
				: widget
		))
	}, [])
	
	const viewAllItems = useCallback((widgetId: string) => {
		const widget = topLists.find(w => w.id === widgetId)
		if (widget) {
			console.log(`Viewing all items for ${widget.title}`)
			return { success: true, message: `Mở danh sách đầy đủ ${widget.title}` }
		}
		return { success: false, message: 'Không tìm thấy widget' }
	}, [topLists])
	
	const onItemClick = useCallback((item: any) => {
		console.log('Item clicked:', item)
		return { success: true, message: `Mở chi tiết ${item.name}` }
	}, [])
	
	// Analytics functions
	const getRevenueData = useCallback((dateRange?: DateRange) => {
		return mockRevenueData.filter(data => {
			if (!dateRange) return true
			return data.date >= dateRange.start && data.date <= dateRange.end
		})
	}, [])
	
	const getUserGrowthData = useCallback((dateRange?: DateRange) => {
		return mockUserGrowthData.filter(data => {
			if (!dateRange) return true
			return data.date >= dateRange.start && data.date <= dateRange.end
		})
	}, [])
	
	const getCourseAnalytics = useCallback((filters?: Partial<AnalyticsFilters>) => {
		let data = mockCourseAnalytics
		
		if (filters?.category) {
			data = data.filter(course => course.category === filters.category)
		}
		
		if (filters?.instructor) {
			data = data.filter(course => course.instructor === filters.instructor)
		}
		
		return data
	}, [])
	
	const getUserAnalytics = useCallback((filters?: Partial<AnalyticsFilters>) => {
		let data = mockUserAnalytics
		
		if (filters?.organization) {
			data = data.filter(user => user.organization === filters.organization)
		}
		
		return data
	}, [])
	
	const getOrganizationAnalytics = useCallback((filters?: Partial<AnalyticsFilters>) => {
		return mockOrganizationAnalytics
	}, [])
	
	const getInstructorAnalytics = useCallback((filters?: Partial<AnalyticsFilters>) => {
		return mockInstructorAnalytics
	}, [])
	
	const getCertificateAnalytics = useCallback((filters?: Partial<AnalyticsFilters>) => {
		return mockCertificateAnalytics
	}, [])
	
	const getGeographicData = useCallback(() => {
		return mockGeographicData
	}, [])
	
	const getDeviceAnalytics = useCallback(() => {
		return mockDeviceAnalytics
	}, [])
	
	const getTrafficSources = useCallback(() => {
		return mockTrafficSources
	}, [])
	
	// Comparison functions
	const compareMetrics = useCallback((metric: string, currentPeriod: string, previousPeriod: string) => {
		// Mock comparison data
		const current = Math.random() * 1000
		const previous = Math.random() * 1000
		const change = current - previous
		const changePercentage = (change / previous) * 100
		
		return {
			metric,
			current,
			previous,
			change,
			changePercentage,
			trend: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'stable' as const,
			period: `${previousPeriod} vs ${currentPeriod}`
		}
	}, [])
	
	// Segment functions
	const createSegment = useCallback((criteria: any) => {
		console.log('Creating segment with criteria:', criteria)
		return { success: true, message: 'Đã tạo phân khúc thành công' }
	}, [])
	
	const getSegments = useCallback(() => {
		// Mock segments
		return [
			{
				id: 'segment-1',
				name: 'Người dùng tích cực',
				description: 'Người dùng hoàn thành > 5 khóa học',
				criteria: { completion: { min: 5 } },
				userCount: 1250,
				percentage: 8.1,
				avgValue: 450000,
				lastUpdated: new Date().toISOString()
			},
			{
				id: 'segment-2',
				name: 'Người dùng mới',
				description: 'Người dùng đăng ký trong 30 ngày qua',
				criteria: { joinDate: { min: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() } },
				userCount: 850,
				percentage: 5.5,
				avgValue: 120000,
				lastUpdated: new Date().toISOString()
			}
		]
	}, [])
	
	// Goal functions
	const createGoal = useCallback((goal: any) => {
		console.log('Creating goal:', goal)
		return { success: true, message: 'Đã tạo mục tiêu thành công' }
	}, [])
	
	const getGoals = useCallback(() => {
		// Mock goals
		return [
			{
				id: 'goal-1',
				name: 'Tăng doanh thu 20%',
				description: 'Tăng doanh thu tháng này lên 20% so với tháng trước',
				target: 1500000000,
				current: 1250000000,
				unit: 'VND',
				deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
				status: 'on_track' as const,
				progress: 83.3,
				trend: [1000000000, 1100000000, 1200000000, 1250000000],
				lastUpdated: new Date().toISOString()
			}
		]
	}, [])
	
	// Benchmark functions
	const getBenchmarks = useCallback(() => {
		// Mock benchmarks
		return [
			{
				metric: 'completion_rate',
				industry: 'E-Learning',
				average: 65.2,
				median: 68.5,
				topQuartile: 78.3,
				ourValue: 78.5,
				percentile: 85,
				lastUpdated: new Date().toISOString()
			}
		]
	}, [])
	
	return {
		// State
		dashboard,
		kpis,
		charts,
		topLists,
		filters,
		loading,
		error,
		isRealTimeEnabled,
		
		// Actions
		refreshData,
		updateFilters,
		updateDateRange,
		updatePeriod,
		setIsRealTimeEnabled,
		
		// Export functions
		exportToExcel,
		exportToPDF,
		
		// Chart functions
		refreshChart,
		exportChart,
		configureChart,
		fullscreenChart,
		
		// Top lists functions
		refreshTopList,
		viewAllItems,
		onItemClick,
		
		// Data getters
		getRevenueData,
		getUserGrowthData,
		getCourseAnalytics,
		getUserAnalytics,
		getOrganizationAnalytics,
		getInstructorAnalytics,
		getCertificateAnalytics,
		getGeographicData,
		getDeviceAnalytics,
		getTrafficSources,
		
		// Analytics functions
		compareMetrics,
		createSegment,
		getSegments,
		createGoal,
		getGoals,
		getBenchmarks
	}
}
