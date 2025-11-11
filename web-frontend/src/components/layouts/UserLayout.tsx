import React from 'react'
import { Outlet } from 'react-router-dom'
import UserHeader from './UserHeader'

export default function UserLayout(): JSX.Element {
	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100vh',
			background: 'var(--background)',
			color: 'var(--foreground)',
			fontFamily: 'var(--font-sans)'
		}}>
			<UserHeader />
			<main style={{ flex: 1, paddingTop: '80px' }}>
				<Outlet />
			</main>
		</div>
	)
}
