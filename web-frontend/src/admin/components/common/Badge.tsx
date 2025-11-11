import React from 'react'
import '../../styles/common.css'

interface BadgeProps {
	children: React.ReactNode
	variant?: 'success' | 'warning' | 'danger' | 'info' | 'secondary'
	className?: string
	style?: React.CSSProperties
}

export default function Badge({ 
	children, 
	variant = 'secondary',
	className = '',
	style
}: BadgeProps): JSX.Element {
	
	return (
		<span className={`badge badge-${variant} ${className}`} style={style}>
			{children}
		</span>
	)
}

