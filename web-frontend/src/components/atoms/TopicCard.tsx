import React from 'react'
import { LucideIcon } from 'lucide-react'

interface TopicCardProps {
	icon: LucideIcon
	title: string
	onClick?: () => void
}

export default function TopicCard({ icon: Icon, title, onClick }: TopicCardProps): JSX.Element {
	return (
		<div 
			className="card p-5 text-center"
			onClick={onClick}
			style={{
				padding: '20px',
				textAlign: 'center',
				cursor: 'pointer',
				background: 'var(--card)',
				border: '1px solid oklch(0.25 0 0)',
				borderRadius: 'var(--radius-lg)',
				transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out'
			}}
		>
			<Icon 
				className="w-10 h-10 mx-auto mb-3 text-[var(--accent)]"
				style={{ 
					width: '40px', 
					height: '40px', 
					margin: '0 auto 12px', 
					color: 'var(--accent)' 
				}} 
			/>
			<h3 
				className="font-semibold"
				style={{ fontWeight: 600, margin: 0 }}
			>
				{title}
			</h3>
		</div>
	)
}
