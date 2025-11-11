import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { Bell, Settings, LogOut } from 'lucide-react'
import { logoutUser } from '../../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import Logo from '../../../components/atoms/Logo'

export default function Header(): JSX.Element {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { user } = useAppSelector((state) => state.auth)
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

	const handleLogout = () => {
		dispatch(logoutUser())
		navigate('/')
	}

	const handleDropdownToggle = (dropdown: string) => {
		setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
	}

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement
			if (!target.closest('.dropdown-container')) {
				setActiveDropdown(null)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<header
			style={{
				position: 'sticky',
				top: 0,
				zIndex: 10,
				background: 'var(--background)',
				borderBottom: '1px solid var(--border)',
				boxShadow: 'var(--shadow-sm)',
				backdropFilter: 'blur(12px)',
				WebkitBackdropFilter: 'blur(12px)',
				transition: 'all var(--transition-normal)',
				width: '100%',
				boxSizing: 'border-box'
			}}
		>
			<div 
				className="px-6 py-4 flex justify-between items-center"
				style={{
					padding: '16px 24px',
					paddingRight: 'calc(24px + 1rem)',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					boxSizing: 'border-box',
					maxWidth: '100vw'
				}}
			>
				{/* Logo */}
				<Logo text="EduPlatform Admin" />

				{/* Right Side - User Actions */}
				<div className="flex items-center space-x-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
					{/* Notifications */}
					<div className="relative group dropdown-container" style={{ position: 'relative' }}>
						<button 
							aria-label="Notifications" 
							className="icon-btn hover-lift hover-glow"
							style={{
								width: '40px',
								height: '40px',
								background: 'var(--card)',
								border: '1px solid var(--border)',
								borderRadius: 'var(--radius-md)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								color: 'var(--foreground)',
								transition: 'all var(--transition-normal)',
								position: 'relative',
								overflow: 'hidden'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'var(--muted)'
								e.currentTarget.style.borderColor = 'var(--accent)'
								e.currentTarget.style.color = 'var(--accent)'
								e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
								e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'var(--card)'
								e.currentTarget.style.borderColor = 'var(--border)'
								e.currentTarget.style.color = 'var(--foreground)'
								e.currentTarget.style.transform = 'translateY(0) scale(1)'
								e.currentTarget.style.boxShadow = 'none'
							}}
							onClick={() => handleDropdownToggle('notifications')}
						>
							<Bell className="w-5 h-5" style={{ width: '20px', height: '20px' }} />
							<span style={{ 
								position: 'absolute', 
								top: '6px', 
								right: '6px', 
								width: '8px', 
								height: '8px', 
								background: 'var(--destructive)', 
								borderRadius: '50%',
								border: '2px solid var(--background)'
							}} />
						</button>
					</div>

					{/* Settings */}
					<div className="relative group dropdown-container" style={{ position: 'relative' }}>
						<button 
							aria-label="Settings" 
							className="icon-btn hover-lift hover-glow"
							style={{
								width: '40px',
								height: '40px',
								background: 'var(--card)',
								border: '1px solid var(--border)',
								borderRadius: 'var(--radius-md)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								color: 'var(--foreground)',
								transition: 'all var(--transition-normal)',
								position: 'relative',
								overflow: 'hidden'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'var(--muted)'
								e.currentTarget.style.borderColor = 'var(--accent)'
								e.currentTarget.style.color = 'var(--accent)'
								e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
								e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'var(--card)'
								e.currentTarget.style.borderColor = 'var(--border)'
								e.currentTarget.style.color = 'var(--foreground)'
								e.currentTarget.style.transform = 'translateY(0) scale(1)'
								e.currentTarget.style.boxShadow = 'none'
							}}
							onClick={() => handleDropdownToggle('settings')}
						>
							<Settings className="w-5 h-5" style={{ width: '20px', height: '20px' }} />
						</button>
					</div>

					{/* User Info & Logout */}
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<img 
								src={user?.avatar || "https://placehold.co/32x32"} 
								alt="Profile" 
								style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)' }} 
							/>
							<div>
								<span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--foreground)' }}>
									{user?.name || 'Người quản trị'}
								</span>
								<div style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
									{user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
								</div>
							</div>
						</div>
						<button 
							onClick={handleLogout}
							className="px-3 py-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-all duration-300 font-medium rounded-md hover:scale-105 active:scale-95"
							style={{
								padding: '6px 12px',
								background: 'var(--card)',
								border: '1px solid var(--border)',
								cursor: 'pointer',
								fontSize: '14px',
								fontWeight: 500,
								borderRadius: 'var(--radius-md)',
								transition: 'all var(--transition-normal)',
								display: 'flex',
								alignItems: 'center',
								gap: '6px',
								color: 'var(--foreground)'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'var(--muted)'
								e.currentTarget.style.borderColor = 'var(--accent)'
								e.currentTarget.style.color = 'var(--accent)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'var(--card)'
								e.currentTarget.style.borderColor = 'var(--border)'
								e.currentTarget.style.color = 'var(--foreground)'
							}}
						>
							<LogOut className="w-4 h-4" style={{ width: '16px', height: '16px' }} />
							Đăng xuất
						</button>
					</div>
				</div>
			</div>
		</header>
	)
}

