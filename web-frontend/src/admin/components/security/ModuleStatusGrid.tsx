import React from 'react'
import { BlockchainModule } from '../../types/security'
import ModuleStatusCard from './ModuleStatusCard'

interface ModuleStatusGridProps {
	modules: BlockchainModule[]
	onModuleClick?: (module: BlockchainModule) => void
	loading?: boolean
}

export default function ModuleStatusGrid({ modules, onModuleClick, loading = false }: ModuleStatusGridProps): JSX.Element {
	
	if (loading) {
		return (
			<div className="admin-table-empty">
				<div className="admin-table-empty-icon">⏳</div>
				<div className="admin-table-empty-text">Đang tải dữ liệu...</div>
			</div>
		)
	}

	if (modules.length === 0) {
		return (
			<div className="admin-table-empty">
				<div className="admin-table-empty-icon">🔒</div>
				<div className="admin-table-empty-text">Không có module blockchain nào</div>
			</div>
		)
	}

	return (
		<div style={{
			display: 'grid',
			gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
			gap: '24px',
			animation: 'fadeIn 0.3s ease-in'
		}}>
			{modules.map(module => (
				<ModuleStatusCard
					key={module.id}
					module={module}
					onClick={onModuleClick}
				/>
			))}
		</div>
	)
}
