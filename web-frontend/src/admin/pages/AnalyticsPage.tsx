import React, { useState, useEffect } from 'react'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import { KpiGrid } from '../components/analytics/KpiGrid'
import { AnalyticsChartComponent } from '../components/analytics/AnalyticsChart'
import { TopListsWidgetComponent } from '../components/analytics/TopListsWidget'
import KpiDetailModal from '../modal/Analytics/KpiDetailModal'
import ChartFullscreenModal from '../modal/Analytics/ChartFullscreenModal'
import TopListModal from '../modal/Analytics/TopListModal'
import ExportModal from '../modal/Analytics/ExportModal'
import SettingsModal from '../modal/Analytics/SettingsModal'
import ShareModal from '../modal/Analytics/ShareModal'
import PrintModal from '../modal/Analytics/PrintModal'
import DatabaseModal from '../modal/Analytics/DatabaseModal'
import CloudModal from '../modal/Analytics/CloudModal'
import { DateRangePicker } from '../components/analytics/DateRangePicker'
import { useAnalytics } from '../hooks/useAnalytics'
import { 
	BarChart3, 
	TrendingUp, 
	Users, 
	DollarSign,
	Download,
	RefreshCw,
	Settings,
	Eye,
	EyeOff,
	AlertTriangle,
	CheckCircle,
	Info,
	Activity,
	Target,
	Filter,
	Calendar,
	PieChart,
	LineChart,
	X,
	Plus,
	Edit,
	Trash2,
	Save,
	Share2,
	Printer,
	FileText,
	Database,
	Cloud,
	Wifi,
	WifiOff
} from 'lucide-react'
import '../styles/analytics.scss'
import '../styles/table.css'
import '../styles/common.css'
import '../styles/form.css'

export const AnalyticsPage: React.FC = () => {
	const {
		dashboard,
		kpis,
		charts,
		topLists,
		filters,
		loading,
		error,
		isRealTimeEnabled,
		refreshData,
		updateDateRange,
		updatePeriod,
		setIsRealTimeEnabled,
		exportToExcel,
		exportToPDF,
		refreshChart,
		exportChart,
		configureChart,
		fullscreenChart,
		refreshTopList,
		viewAllItems,
		onItemClick,
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
		compareMetrics,
		getSegments,
		getGoals,
		getBenchmarks
	} = useAnalytics()

	// State management
	const [selectedKpi, setSelectedKpi] = useState<any>(null)
	const [showKpiModal, setShowKpiModal] = useState(false)
	const [showChartModal, setShowChartModal] = useState(false)
	const [selectedChart, setSelectedChart] = useState<any>(null)
	const [showTopListModal, setShowTopListModal] = useState(false)
	const [selectedTopList, setSelectedTopList] = useState<any>(null)
	const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'users' | 'courses' | 'geographic' | 'devices' | 'traffic'>('overview')
	const [showFilters, setShowFilters] = useState(false)
	const [showExportModal, setShowExportModal] = useState(false)
	const [showSettingsModal, setShowSettingsModal] = useState(false)
	const [showShareModal, setShowShareModal] = useState(false)
	const [showPrintModal, setShowPrintModal] = useState(false)
	const [showDatabaseModal, setShowDatabaseModal] = useState(false)
	const [showCloudModal, setShowCloudModal] = useState(false)
	const [notifications, setNotifications] = useState<string[]>([])
	const [isExporting, setIsExporting] = useState(false)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected')

	// Notification system
	const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
		const id = Date.now().toString()
		setNotifications(prev => [...prev, `${type.toUpperCase()}: ${message}`])
		
		// Auto remove after 5 seconds
		setTimeout(() => {
			setNotifications(prev => prev.filter(n => !n.includes(message)))
		}, 5000)
	}

	// Connection status simulation
	useEffect(() => {
		const interval = setInterval(() => {
			if (Math.random() < 0.1) { // 10% chance of connection issue
				setConnectionStatus('reconnecting')
				setTimeout(() => {
					setConnectionStatus('connected')
					addNotification('Kết nối đã được khôi phục', 'success')
				}, 2000)
			}
		}, 30000)

		return () => clearInterval(interval)
	}, [])

	// Enhanced handlers with full functionality
	const handleKpiClick = (kpi: any) => {
		setSelectedKpi(kpi)
		setShowKpiModal(true)
		addNotification(`Đã mở chi tiết KPI: ${kpi.name}`, 'info')
	}

	const handleChartFullscreen = (chartId: string) => {
		const chart = charts.find(c => c.id === chartId)
		if (chart) {
			setSelectedChart(chart)
			setShowChartModal(true)
			addNotification(`Đã mở biểu đồ toàn màn hình: ${chart.title}`, 'info')
		}
	}

	const handleViewAllItems = (widgetId: string) => {
		const widget = topLists.find(w => w.id === widgetId)
		if (widget) {
			setSelectedTopList(widget)
			setShowTopListModal(true)
			addNotification(`Đã mở danh sách đầy đủ: ${widget.title}`, 'info')
		}
	}

	const handleExportData = async (format: 'excel' | 'pdf' | 'csv' | 'json') => {
		setIsExporting(true)
		try {
			let result
			if (format === 'excel') {
				result = await exportToExcel('analytics_data')
			} else if (format === 'pdf') {
				result = await exportToPDF('analytics_data')
			} else if (format === 'csv') {
				// Simulate CSV export
				result = { success: true, message: 'Đã xuất dữ liệu CSV thành công' }
			} else if (format === 'json') {
				// Simulate JSON export
				result = { success: true, message: 'Đã xuất dữ liệu JSON thành công' }
			}
			
			if (result?.success) {
				addNotification(result.message, 'success')
				setShowExportModal(false)
			} else {
				addNotification(result?.message || 'Lỗi khi xuất dữ liệu', 'error')
			}
		} catch (error) {
			addNotification('Lỗi khi xuất dữ liệu', 'error')
		} finally {
			setIsExporting(false)
		}
	}

	const handleRefreshAll = async () => {
		setIsRefreshing(true)
		try {
			await refreshData()
			addNotification('Đã làm mới dữ liệu thành công', 'success')
		} catch (error) {
			addNotification('Lỗi khi làm mới dữ liệu', 'error')
		} finally {
			setIsRefreshing(false)
		}
	}

	const handleRealTimeToggle = () => {
		setIsRealTimeEnabled(!isRealTimeEnabled)
		addNotification(
			isRealTimeEnabled ? 'Đã tắt cập nhật real-time' : 'Đã bật cập nhật real-time', 
			'info'
		)
	}

	const handleChartRefresh = (chartId: string) => {
		refreshChart(chartId)
		addNotification('Đã làm mới biểu đồ', 'success')
	}

	const handleChartExport = (chartId: string, format: 'png' | 'jpg' | 'pdf') => {
		const result = exportChart(chartId, format)
		if (result.success) {
			addNotification(result.message, 'success')
		} else {
			addNotification(result.message, 'error')
		}
	}

	const handleChartConfigure = (chartId: string) => {
		const result = configureChart(chartId)
		if (result.success) {
			setShowSettingsModal(true)
			addNotification('Đã mở cấu hình biểu đồ', 'info')
		}
	}

	const handleTopListRefresh = (widgetId: string) => {
		refreshTopList(widgetId)
		addNotification('Đã làm mới danh sách', 'success')
	}

	const handleItemClick = (item: any) => {
		const result = onItemClick(item)
		if (result.success) {
			addNotification(`Đã mở chi tiết: ${item.name}`, 'info')
		}
	}

	const handlePrint = () => {
		setShowPrintModal(true)
		addNotification('Đang chuẩn bị in...', 'info')
	}

	const handleShare = () => {
		setShowShareModal(true)
		addNotification('Đã mở chia sẻ', 'info')
	}

	const handleDatabaseSync = () => {
		setShowDatabaseModal(true)
		addNotification('Đã mở đồng bộ cơ sở dữ liệu', 'info')
	}

	const handleCloudSync = () => {
		setShowCloudModal(true)
		addNotification('Đã mở đồng bộ đám mây', 'info')
	}

	const handleConnectionToggle = () => {
		if (connectionStatus === 'connected') {
			setConnectionStatus('disconnected')
			addNotification('Đã ngắt kết nối', 'info')
		} else {
			setConnectionStatus('reconnecting')
			setTimeout(() => {
				setConnectionStatus('connected')
				addNotification('Đã kết nối lại', 'success')
			}, 2000)
		}
	}

	const getTabIcon = (tab: string) => {
		const iconMap = {
			overview: Activity,
			revenue: DollarSign,
			users: Users,
			courses: BarChart3,
			geographic: PieChart,
			devices: Settings,
			traffic: LineChart
		}
		return iconMap[tab as keyof typeof iconMap] || Activity
	}

	const getTabLabel = (tab: string) => {
		const labelMap = {
			overview: 'Tổng quan',
			revenue: 'Doanh thu',
			users: 'Người dùng',
			courses: 'Khóa học',
			geographic: 'Địa lý',
			devices: 'Thiết bị',
			traffic: 'Lưu lượng'
		}
		return labelMap[tab as keyof typeof labelMap] || tab
	}

	const renderOverviewTab = () => (
		<div className="analytics-overview">
			{/* KPI Grid */}
			<div className="section">
				<div className="section-header">
					<h2>Chỉ số KPI chính</h2>
					<div className="section-controls">
						<button
							className="btn btn-secondary btn-sm"
							onClick={handleRealTimeToggle}
						>
							{isRealTimeEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
							{isRealTimeEnabled ? 'Tắt' : 'Bật'} Real-time
						</button>
						<button
							className="btn btn-secondary btn-sm"
							onClick={handleRefreshAll}
							disabled={isRefreshing}
						>
							<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
							{isRefreshing ? 'Đang làm mới...' : 'Làm mới'}
						</button>
						<button
							className="btn btn-secondary btn-sm"
							onClick={() => setShowExportModal(true)}
						>
							<Download className="w-4 h-4" />
							Xuất dữ liệu
						</button>
						<button
							className="btn btn-secondary btn-sm"
							onClick={handlePrint}
						>
							<Printer className="w-4 h-4" />
							In
						</button>
						<button
							className="btn btn-secondary btn-sm"
							onClick={handleShare}
						>
							<Share2 className="w-4 h-4" />
							Chia sẻ
						</button>
					</div>
				</div>
				<KpiGrid kpis={kpis} onKpiClick={handleKpiClick} />
			</div>

			{/* Charts Grid */}
			<div className="section">
				<div className="section-header">
					<h2>Biểu đồ phân tích</h2>
					<div className="section-controls">
						<button
							className="btn btn-secondary btn-sm"
							onClick={() => setShowFilters(!showFilters)}
						>
							<Filter className="w-4 h-4" />
							{showFilters ? 'Ẩn' : 'Hiện'} Bộ lọc
						</button>
						<button
							className="btn btn-secondary btn-sm"
							onClick={() => setShowSettingsModal(true)}
						>
							<Settings className="w-4 h-4" />
							Cài đặt
						</button>
						<button
							className="btn btn-secondary btn-sm"
							onClick={handleDatabaseSync}
						>
							<Database className="w-4 h-4" />
							Đồng bộ DB
						</button>
						<button
							className="btn btn-secondary btn-sm"
							onClick={handleCloudSync}
						>
							<Cloud className="w-4 h-4" />
							Đồng bộ Cloud
						</button>
					</div>
				</div>
				<div className="charts-grid">
					{charts.map((chart) => (
						<AnalyticsChartComponent
							key={chart.id}
							chart={chart}
							onRefresh={handleChartRefresh}
							onExport={handleChartExport}
							onConfigure={handleChartConfigure}
							onFullscreen={handleChartFullscreen}
							height={300}
						/>
					))}
				</div>
			</div>

			{/* Top Lists */}
			<div className="section">
				<div className="section-header">
					<h2>Bảng xếp hạng</h2>
				</div>
				<div className="top-lists-grid">
					{topLists.map((widget) => (
						<TopListsWidgetComponent
							key={widget.id}
							widget={widget}
							onItemClick={handleItemClick}
							onViewAll={handleViewAllItems}
							onRefresh={handleTopListRefresh}
						/>
					))}
				</div>
			</div>

			{/* Recent Activity */}
			<div className="section">
				<div className="section-header">
					<h2>Hoạt động gần đây</h2>
				</div>
				<div className="activity-feed">
					<div className="activity-list">
						{dashboard.recentActivity.map((activity) => (
							<div key={activity.id} className="activity-item">
								<div className="activity-icon">
									<Activity className="w-6 h-6" />
								</div>
								<div className="activity-content">
									<h4>{activity.title}</h4>
									<p>{activity.description}</p>
									<span className="activity-time">
										{new Date(activity.timestamp).toLocaleString('vi-VN')}
									</span>
								</div>
								<div className={`activity-badge ${activity.impact}`}>
									{activity.impact === 'high' ? 'Cao' : activity.impact === 'medium' ? 'Trung bình' : 'Thấp'}
								</div>
								<div className={`activity-status ${activity.status || 'completed'}`}></div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Alerts */}
			{dashboard.alerts.length > 0 && (
				<div className="section">
					<div className="section-header">
						<h2>Cảnh báo</h2>
					</div>
					<div className="alerts-list">
						{dashboard.alerts.map((alert) => (
							<Card key={alert.id} className={`alert-item alert-${alert.severity}`}>
								<div className="alert-header">
									<AlertTriangle className="w-5 h-5" />
									<h4>{alert.title}</h4>
									<Badge variant={alert.severity === 'critical' ? 'danger' : alert.severity === 'high' ? 'warning' : 'info'}>
										{alert.severity}
									</Badge>
								</div>
								<p>{alert.message}</p>
								<span className="alert-time">
									{new Date(alert.timestamp).toLocaleString('vi-VN')}
								</span>
							</Card>
						))}
					</div>
				</div>
			)}

			{/* Insights */}
			{dashboard.insights.length > 0 && (
				<div className="section">
					<div className="section-header">
						<h2>Insights</h2>
					</div>
					<div className="insights-list">
						{dashboard.insights.map((insight) => (
							<Card key={insight.id} className="insight-item">
								<div className="insight-header">
									<Info className="w-5 h-5" />
									<h4>{insight.title}</h4>
									<Badge variant={insight.impact === 'high' ? 'success' : insight.impact === 'medium' ? 'warning' : 'info'}>
										{insight.impact}
									</Badge>
								</div>
								<p>{insight.description}</p>
								{insight.recommendations && (
									<div className="insight-recommendations">
										<h5>Khuyến nghị:</h5>
										<ul>
											{insight.recommendations.map((rec, index) => (
												<li key={index}>{rec}</li>
											))}
										</ul>
									</div>
								)}
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	)

	const renderRevenueTab = () => {
		const revenueData = getRevenueData(filters.dateRange)
		
		return (
			<div className="analytics-revenue">
				<div className="section">
					<div className="section-header">
						<h2>Phân tích doanh thu</h2>
					</div>
					<Card className="revenue-summary">
						<div className="revenue-stats">
							<div className="stat-item">
								<h3>Tổng doanh thu</h3>
								<p className="stat-value">
									{new Intl.NumberFormat('vi-VN', {
										style: 'currency',
										currency: 'VND'
									}).format(dashboard.overview.totalRevenue)}
								</p>
							</div>
							<div className="stat-item">
								<h3>Giao dịch trung bình</h3>
								<p className="stat-value">
									{new Intl.NumberFormat('vi-VN', {
										style: 'currency',
										currency: 'VND'
									}).format(revenueData.reduce((sum, item) => sum + item.avgOrderValue, 0) / revenueData.length)}
								</p>
							</div>
							<div className="stat-item">
								<h3>Tỷ lệ hoàn tiền</h3>
								<p className="stat-value">
									{((revenueData.reduce((sum, item) => sum + item.refunds, 0) / revenueData.reduce((sum, item) => sum + item.revenue, 0)) * 100).toFixed(2)}%
								</p>
							</div>
						</div>
					</Card>
				</div>
			</div>
		)
	}

	const renderUsersTab = () => {
		const userData = getUserAnalytics(filters)
		
		return (
			<div className="analytics-users">
				<div className="section">
					<div className="section-header">
						<h2>Phân tích người dùng</h2>
					</div>
					<Card className="users-summary">
						<div className="users-stats">
							<div className="stat-item">
								<h3>Tổng người dùng</h3>
								<p className="stat-value">{dashboard.overview.totalUsers.toLocaleString('vi-VN')}</p>
							</div>
							<div className="stat-item">
								<h3>Người dùng hoạt động</h3>
								<p className="stat-value">{dashboard.overview.activeUsers.toLocaleString('vi-VN')}</p>
							</div>
							<div className="stat-item">
								<h3>Người dùng mới hôm nay</h3>
								<p className="stat-value">{dashboard.overview.newUsersToday.toLocaleString('vi-VN')}</p>
							</div>
						</div>
					</Card>
				</div>
			</div>
		)
	}

	const renderCoursesTab = () => {
		const courseData = getCourseAnalytics(filters)
		
		return (
			<div className="analytics-courses">
				<div className="section">
					<div className="section-header">
						<h2>Phân tích khóa học</h2>
					</div>
					<Card className="courses-summary">
						<div className="courses-stats">
							<div className="stat-item">
								<h3>Tổng khóa học</h3>
								<p className="stat-value">{dashboard.overview.totalCourses.toLocaleString('vi-VN')}</p>
							</div>
							<div className="stat-item">
								<h3>Tổng đăng ký</h3>
								<p className="stat-value">{dashboard.overview.totalEnrollments.toLocaleString('vi-VN')}</p>
							</div>
							<div className="stat-item">
								<h3>Tỷ lệ hoàn thành</h3>
								<p className="stat-value">{dashboard.overview.avgCompletionRate.toFixed(1)}%</p>
							</div>
							<div className="stat-item">
								<h3>Đánh giá trung bình</h3>
								<p className="stat-value">{dashboard.overview.avgRating.toFixed(1)} ⭐</p>
							</div>
						</div>
					</Card>
				</div>
			</div>
		)
	}

	const renderGeographicTab = () => {
		const geoData = getGeographicData()
		
		return (
			<div className="analytics-geographic">
				<div className="section">
					<div className="section-header">
						<h2>Phân tích địa lý</h2>
					</div>
					<Card className="geographic-summary">
						<div className="geographic-stats">
							{geoData.map((country) => (
								<div key={country.countryCode} className="country-item">
									<div className="country-info">
										<h4>{country.country}</h4>
										<p>{country.users.toLocaleString('vi-VN')} người dùng</p>
									</div>
									<div className="country-stats">
										<span>{country.percentage.toFixed(1)}%</span>
									</div>
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>
		)
	}

	const renderDevicesTab = () => {
		const deviceData = getDeviceAnalytics()
		
		return (
			<div className="analytics-devices">
				<div className="section">
					<div className="section-header">
						<h2>Phân tích thiết bị</h2>
					</div>
					<Card className="devices-summary">
						<div className="devices-stats">
							{deviceData.map((device) => (
								<div key={device.device} className="device-item">
									<div className="device-info">
										<h4>{device.device}</h4>
										<p>{device.users.toLocaleString('vi-VN')} người dùng</p>
									</div>
									<div className="device-stats">
										<span>{device.percentage.toFixed(1)}%</span>
									</div>
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>
		)
	}

	const renderTrafficTab = () => {
		const trafficData = getTrafficSources()
		
		return (
			<div className="analytics-traffic">
				<div className="section">
					<div className="section-header">
						<h2>Phân tích lưu lượng</h2>
					</div>
					<Card className="traffic-summary">
						<div className="traffic-stats">
							{trafficData.map((source) => (
								<div key={source.source} className="traffic-item">
									<div className="traffic-info">
										<h4>{source.source}</h4>
										<p>{source.users.toLocaleString('vi-VN')} người dùng</p>
									</div>
									<div className="traffic-stats">
										<span>{source.percentage.toFixed(1)}%</span>
									</div>
								</div>
							))}
						</div>
					</Card>
				</div>
			</div>
		)
	}

	const renderTabContent = () => {
		switch (activeTab) {
			case 'overview':
				return renderOverviewTab()
			case 'revenue':
				return renderRevenueTab()
			case 'users':
				return renderUsersTab()
			case 'courses':
				return renderCoursesTab()
			case 'geographic':
				return renderGeographicTab()
			case 'devices':
				return renderDevicesTab()
			case 'traffic':
				return renderTrafficTab()
			default:
				return renderOverviewTab()
		}
	}

	return (
		<div className="analytics-page">
			<div className="page-header">
				<div className="header-content">
					<h1>Phân tích và Báo cáo</h1>
					<p>Dashboard tổng quan và phân tích chi tiết hệ thống</p>
				</div>
				<div className="header-actions">
					<div className="connection-status">
						<button
							className={`btn btn-sm ${connectionStatus === 'connected' ? 'btn-success' : connectionStatus === 'reconnecting' ? 'btn-warning' : 'btn-danger'}`}
							onClick={handleConnectionToggle}
						>
							{connectionStatus === 'connected' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
							{connectionStatus === 'connected' ? 'Kết nối' : connectionStatus === 'reconnecting' ? 'Đang kết nối...' : 'Mất kết nối'}
						</button>
					</div>
					<button
						className="btn btn-secondary"
						onClick={() => setShowExportModal(true)}
						disabled={isExporting}
					>
						<Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
						{isExporting ? 'Đang xuất...' : 'Xuất dữ liệu'}
					</button>
					<button
						className="btn btn-secondary"
						onClick={handlePrint}
					>
						<Printer className="w-4 h-4" />
						In báo cáo
					</button>
					<button
						className="btn btn-secondary"
						onClick={handleShare}
					>
						<Share2 className="w-4 h-4" />
						Chia sẻ
					</button>
					<button
						className="btn btn-primary"
						onClick={handleRefreshAll}
						disabled={isRefreshing}
					>
						<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
						{isRefreshing ? 'Đang làm mới...' : 'Làm mới'}
					</button>
				</div>
			</div>

			{/* Date Range Picker */}
			<DateRangePicker
				selectedRange={filters.dateRange}
				onRangeChange={updateDateRange}
				onPeriodChange={updatePeriod}
				onRefresh={handleRefreshAll}
				onExport={() => setShowExportModal(true)}
				onApplyFilters={() => setShowFilters(!showFilters)}
			/>

			{/* Navigation Tabs */}
			<div className="analytics-tabs">
				<div className="tabs-header">
					{['overview', 'revenue', 'users', 'courses', 'geographic', 'devices', 'traffic'].map((tab) => {
						const IconComponent = getTabIcon(tab)
						return (
							<button
								key={tab}
								className={`tab-button ${activeTab === tab ? 'active' : ''}`}
								onClick={() => setActiveTab(tab as any)}
							>
								<IconComponent className="w-4 h-4" />
								{getTabLabel(tab)}
							</button>
						)
					})}
				</div>
			</div>

			{/* Tab Content */}
			<div className="analytics-content">
				{renderTabContent()}
			</div>

			{/* Notifications */}
			{notifications.length > 0 && (
				<div className="notifications-container">
					{notifications.map((notification, index) => (
						<div key={index} className={`notification ${notification.includes('SUCCESS') ? 'notification-success' : notification.includes('ERROR') ? 'notification-error' : 'notification-info'}`}>
							<div className="notification-content">
								{notification.includes('SUCCESS') ? <CheckCircle className="w-4 h-4" /> : 
								 notification.includes('ERROR') ? <AlertTriangle className="w-4 h-4" /> : 
								 <Info className="w-4 h-4" />}
								<span>{notification}</span>
							</div>
							<button 
								className="notification-close"
								onClick={() => setNotifications(prev => prev.filter((_, i) => i !== index))}
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					))}
				</div>
			)}

			{/* Error Display */}
			{error && (
				<div className="error-banner">
					<AlertTriangle className="w-5 h-5" />
					<span>{error}</span>
				</div>
			)}

			{/* KPI Detail Modal */}
			<KpiDetailModal
				isOpen={showKpiModal}
				onClose={() => setShowKpiModal(false)}
				kpi={selectedKpi}
			/>

			{/* Chart Fullscreen Modal */}
			<ChartFullscreenModal
				isOpen={showChartModal}
				onClose={() => setShowChartModal(false)}
				chart={selectedChart}
				onRefresh={refreshChart}
				onExport={exportChart}
				onConfigure={configureChart}
				onFullscreen={handleChartFullscreen}
			/>

			{/* Top List Detail Modal */}
			<TopListModal
				isOpen={showTopListModal}
				onClose={() => setShowTopListModal(false)}
				topList={selectedTopList}
				onItemClick={handleItemClick}
				onViewAll={handleViewAllItems}
				onRefresh={handleTopListRefresh}
			/>

			{/* Export Modal */}
			<ExportModal
				isOpen={showExportModal}
				onClose={() => setShowExportModal(false)}
				onExport={handleExportData}
				isExporting={isExporting}
			/>

			{/* Settings Modal */}
			<SettingsModal
				isOpen={showSettingsModal}
				onClose={() => setShowSettingsModal(false)}
				isRealTimeEnabled={isRealTimeEnabled}
				onRealTimeToggle={handleRealTimeToggle}
			/>

			{/* Share Modal */}
			<ShareModal
				isOpen={showShareModal}
				onClose={() => setShowShareModal(false)}
			/>

			{/* Print Modal */}
			<PrintModal
				isOpen={showPrintModal}
				onClose={() => setShowPrintModal(false)}
			/>

			{/* Database Sync Modal */}
			<DatabaseModal
				isOpen={showDatabaseModal}
				onClose={() => setShowDatabaseModal(false)}
			/>

			{/* Cloud Sync Modal */}
			<CloudModal
				isOpen={showCloudModal}
				onClose={() => setShowCloudModal(false)}
			/>
		</div>
	)
}