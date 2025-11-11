import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../../pages/LoginPage'
import RegisterPage from '../../pages/RegisterPage'
import ForgotPasswordPage from '../../pages/ForgotPasswordPage'
import ThemeToggle from '../atoms/ThemeToggle'

export default function AuthLayout(): JSX.Element {
	return (
		<div style={{
			minHeight: '100vh',
			width: '100vw',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: 'var(--background)',
			color: 'var(--foreground)',
			fontFamily: 'var(--font-sans)',
			padding: '2rem',
			boxSizing: 'border-box'
		}}>
			<ThemeToggle />
			<div style={{
				width: '100%',
				maxWidth: '24rem',
				minWidth: '18rem',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center'
			}}>
				<Routes>
					<Route index element={<Navigate to="/auth/login" replace />} />
					<Route path="login" element={<LoginPage />} />
					<Route path="register" element={<RegisterPage />} />
					<Route path="forgot" element={<ForgotPasswordPage />} />
				</Routes>
			</div>
		</div>
	)
}
