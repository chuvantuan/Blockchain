import React from 'react'
import { SystemHealth, ServiceHealth, DatabaseHealth, HealthStatus } from '../../types/admin'
import { 
	Server, 
	Database, 
	HardDrive, 
	Network, 
	Shield, 
	Cpu, 
	Activity,
	AlertTriangle,
	CheckCircle,
	XCircle,
	Clock,
	TrendingUp,
	TrendingDown,
	Minus
} from 'lucide-react'
import Badge from '../common/Badge'

interface SystemHealthWidgetProps {
	systemHealth: SystemHealth
	onRefresh?: () => void
	loading?: boolean
}

export default function SystemHealthWidget({
	systemHealth,
	onRefresh,
	loading = false
}: SystemHealthWidgetProps): JSX.Element {
	const getStatusIcon = (status: HealthStatus) => {
		switch (status) {
			case 'healthy':
				return <CheckCircle size={16} className="text-green-500" />
			case 'warning':
				return <AlertTriangle size={16} className="text-yellow-500" />
			case 'critical':
				return <XCircle size={16} className="text-red-500" />
			default:
				return <Minus size={16} className="text-gray-500" />
		}
	}

	const getStatusColor = (status: HealthStatus) => {
		switch (status) {
			case 'healthy':
				return 'var(--success)'
			case 'warning':
				return 'var(--warning)'
			case 'critical':
				return 'var(--danger)'
			default:
				return 'var(--muted-foreground)'
		}
	}

	const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
		switch (trend) {
			case 'up':
				return <TrendingUp size={12} className="text-green-500" />
			case 'down':
				return <TrendingDown size={12} className="text-red-500" />
			default:
				return <Minus size={12} className="text-gray-500" />
		}
	}

	const formatBytes = (bytes: number) => {
		if (bytes >= 1000000000000) return `${(bytes / 1000000000000).toFixed(1)}TB`
		if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)}GB`
		if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)}MB`
		if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)}KB`
		return `${bytes}B`
	}

	const formatPercentage = (value: number) => {
		return `${value.toFixed(1)}%`
	}

	const formatUptime = (uptime: number) => {
		return `${uptime.toFixed(1)}%`
	}

	if (loading) {
		return (
			<div className="system-health-widget loading">
				<div className="loading-spinner"></div>
				<p>Đang tải thông tin hệ thống...</p>
			</div>
		)
	}

	return (
		<div className="system-health-widget">
			<div className="widget-header">
				<div className="widget-title">
					<Activity size={20} />
					<span>Tình trạng Hệ thống</span>
				</div>
				<div className="widget-actions">
					<Badge 
						variant="secondary" 
						style={{ backgroundColor: getStatusColor(systemHealth.overall) }}
					>
						{getStatusIcon(systemHealth.overall)}
						{systemHealth.overall.toUpperCase()}
					</Badge>
					{onRefresh && (
						<button 
							className="btn btn-sm btn-outline"
							onClick={onRefresh}
							title="Làm mới"
						>
							<Clock size={14} />
						</button>
					)}
				</div>
			</div>

			<div className="widget-content">
				{/* Overall Status */}
				<div className="overall-status">
					<div className="status-item">
						<span className="status-label">Tổng quan:</span>
						<span className="status-value" style={{ color: getStatusColor(systemHealth.overall) }}>
							{systemHealth.overall === 'healthy' ? 'Khỏe mạnh' : 
							 systemHealth.overall === 'warning' ? 'Cảnh báo' : 
							 systemHealth.overall === 'critical' ? 'Nguy hiểm' : 'Không xác định'}
						</span>
					</div>
					<div className="status-item">
						<span className="status-label">Uptime:</span>
						<span className="status-value">{formatUptime(systemHealth.uptime.current)}</span>
					</div>
					<div className="status-item">
						<span className="status-label">Cập nhật:</span>
						<span className="status-value">
							{new Date(systemHealth.lastChecked).toLocaleTimeString('vi-VN')}
						</span>
					</div>
				</div>

				{/* Services Status */}
				<div className="services-section">
					<h4>Dịch vụ</h4>
					<div className="services-grid">
						{systemHealth.services.map((service) => (
							<div key={service.name} className="service-item">
								<div className="service-header">
									<div className="service-name">
										<Server size={14} />
										<span>{service.name}</span>
									</div>
									<Badge 
										variant="secondary" 
										style={{ backgroundColor: getStatusColor(service.status) }}
									>
										{getStatusIcon(service.status)}
									</Badge>
								</div>
								<div className="service-details">
									<div className="service-metric">
										<span>Uptime:</span>
										<span>{formatUptime(service.uptime)}</span>
									</div>
									<div className="service-metric">
										<span>Response:</span>
										<span>{service.responseTime}ms</span>
									</div>
									<div className="service-metric">
										<span>Errors:</span>
										<span>{service.errorRate}%</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Database Status */}
				<div className="databases-section">
					<h4>Cơ sở dữ liệu</h4>
					<div className="databases-grid">
						{systemHealth.databases.map((db) => (
							<div key={db.name} className="database-item">
								<div className="database-header">
									<div className="database-name">
										<Database size={14} />
										<span>{db.name}</span>
									</div>
									<Badge 
										variant="secondary" 
										style={{ backgroundColor: getStatusColor(db.status) }}
									>
										{getStatusIcon(db.status)}
									</Badge>
								</div>
								<div className="database-details">
									<div className="database-metric">
										<span>Connections:</span>
										<span>{db.connections.active}/{db.connections.max}</span>
									</div>
									<div className="database-metric">
										<span>Size:</span>
										<span>{formatBytes(db.size.current)}</span>
									</div>
									<div className="database-metric">
										<span>Growth:</span>
										<span>{formatPercentage(db.size.growth)}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Storage Status */}
				<div className="storage-section">
					<h4>Lưu trữ</h4>
					<div className="storage-item">
						<div className="storage-header">
							<div className="storage-name">
								<HardDrive size={14} />
								<span>Disk Usage</span>
							</div>
							<div className="storage-percentage">
								{formatPercentage((systemHealth.storage.used / systemHealth.storage.total) * 100)}
							</div>
						</div>
						<div className="storage-bar">
							<div 
								className="storage-bar-fill"
								style={{ 
									width: `${(systemHealth.storage.used / systemHealth.storage.total) * 100}%`,
									backgroundColor: (systemHealth.storage.used / systemHealth.storage.total) > 0.8 ? 'var(--danger)' : 'var(--success)'
								}}
							></div>
						</div>
						<div className="storage-details">
							<div className="storage-metric">
								<span>Used:</span>
								<span>{formatBytes(systemHealth.storage.used)}</span>
							</div>
							<div className="storage-metric">
								<span>Available:</span>
								<span>{formatBytes(systemHealth.storage.available)}</span>
							</div>
							<div className="storage-metric">
								<span>Total:</span>
								<span>{formatBytes(systemHealth.storage.total)}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Performance Status */}
				<div className="performance-section">
					<h4>Hiệu suất</h4>
					<div className="performance-grid">
						<div className="performance-item">
							<div className="performance-header">
								<Cpu size={14} />
								<span>CPU</span>
							</div>
							<div className="performance-value">
								{formatPercentage(systemHealth.performance.cpu.usage)}
							</div>
							<div className="performance-details">
								<span>{systemHealth.performance.cpu.cores} cores</span>
								<span>{systemHealth.performance.cpu.temperature}°C</span>
							</div>
						</div>
						<div className="performance-item">
							<div className="performance-header">
								<Activity size={14} />
								<span>Memory</span>
							</div>
							<div className="performance-value">
								{formatPercentage((systemHealth.performance.memory.used / systemHealth.performance.memory.total) * 100)}
							</div>
							<div className="performance-details">
								<span>{formatBytes(systemHealth.performance.memory.used)}</span>
								<span>{formatBytes(systemHealth.performance.memory.total)}</span>
							</div>
						</div>
						<div className="performance-item">
							<div className="performance-header">
								<TrendingUp size={14} />
								<span>Load</span>
							</div>
							<div className="performance-value">
								{systemHealth.performance.load.average1m.toFixed(1)}
							</div>
							<div className="performance-details">
								<span>1m: {systemHealth.performance.load.average1m.toFixed(1)}</span>
								<span>5m: {systemHealth.performance.load.average5m.toFixed(1)}</span>
								<span>15m: {systemHealth.performance.load.average15m.toFixed(1)}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Network Status */}
				<div className="network-section">
					<h4>Mạng</h4>
					<div className="network-item">
						<div className="network-header">
							<Network size={14} />
							<span>Bandwidth</span>
						</div>
						<div className="network-details">
							<div className="network-metric">
								<span>Incoming:</span>
								<span>{systemHealth.network.bandwidth.incoming} Mbps</span>
							</div>
							<div className="network-metric">
								<span>Outgoing:</span>
								<span>{systemHealth.network.bandwidth.outgoing} Mbps</span>
							</div>
							<div className="network-metric">
								<span>Latency:</span>
								<span>{systemHealth.network.latency.average}ms</span>
							</div>
							<div className="network-metric">
								<span>Connections:</span>
								<span>{systemHealth.network.connections.active}/{systemHealth.network.connections.max}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Security Status */}
				<div className="security-section">
					<h4>Bảo mật</h4>
					<div className="security-item">
						<div className="security-header">
							<Shield size={14} />
							<span>Threats</span>
						</div>
						<div className="security-details">
							<div className="security-metric">
								<span>Blocked:</span>
								<span>{systemHealth.security.threats.blocked}</span>
							</div>
							<div className="security-metric">
								<span>Detected:</span>
								<span>{systemHealth.security.threats.detected}</span>
							</div>
							<div className="security-metric">
								<span>Resolved:</span>
								<span>{systemHealth.security.threats.resolved}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
