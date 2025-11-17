import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../../pages/LoginPage'
import RegisterPage from '../../pages/RegisterPage'
import ForgotPasswordPage from '../../pages/ForgotPasswordPage'
import ThemeToggle from '../atoms/ThemeToggle'
import styles from '../../assets/css/AuthLayout.module.css'

export default function AuthLayout(): JSX.Element {
	return (
		<div className={styles.layout}>
			<ThemeToggle />
			<div className={styles.contentContainer}>
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
