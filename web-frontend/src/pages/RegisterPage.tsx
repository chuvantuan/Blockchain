import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import AuthForm from '../components/molecules/AuthForm'
import Input from '../components/atoms/Input'
import PasswordStrength from '../components/atoms/PasswordStrength'
import SocialAuthButtons from '../components/molecules/SocialAuthButtons'
import { validateEmail, validatePassword, validateName, validateConfirmPassword, checkPasswordStrength } from '../utils/authValidation'
import { registerUser, clearError } from '../store/slices/authSlice'

export default function RegisterPage(): JSX.Element {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { loading, error } = useAppSelector((state) => state.auth)

	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: ''
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// Validate form
		const usernameError = validateName(formData.username)
		const emailError = validateEmail(formData.email)
		const passwordError = validatePassword(formData.password)
		const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword)
		const firstNameError = validateName(formData.firstName)
		const lastNameError = validateName(formData.lastName)

		if (usernameError || emailError || passwordError || confirmPasswordError || firstNameError || lastNameError) {
			setErrors({
				username: usernameError || '',
				email: emailError || '',
				password: passwordError || '',
				confirmPassword: confirmPasswordError || '',
				firstName: firstNameError || '',
				lastName: lastNameError || ''
			})
			return
		}

		// Dispatch register action
		const result = await dispatch(registerUser({
			username: formData.username,
			email: formData.email,
			password: formData.password,
			firstName: formData.firstName,
			lastName: formData.lastName
		}))

		if (registerUser.fulfilled.match(result)) {
			// Registration success, redirect to login
			alert('Registration successful! Please log in.')
			navigate('/auth/login')
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value
		}))

		// Clear errors when user starts typing
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}))
		}

		// Update password strength
		if (name === 'password') {
			setPasswordStrength(checkPasswordStrength(value))
		}
	}

	const handleGoogleAuth = () => {
		console.log('Google authentication')
		// TODO: Implement Google OAuth
	}

	const handleGitHubAuth = () => {
		console.log('GitHub authentication')
		// TODO: Implement GitHub OAuth
	}

	return (
		<AuthForm
			title="Tạo tài khoản"
			subtitle="Đăng ký để bắt đầu với EduPlatform"
			onSubmit={handleSubmit}
			buttonText="Tạo tài khoản"
			loading={loading}
			error={error}
			afterButton={
				<div>
					<SocialAuthButtons
						onGoogleAuth={handleGoogleAuth}
						onGitHubAuth={handleGitHubAuth}
					/>
				</div>
			}
			footer={
				<p style={{ margin: 0 }}>
					Đã có tài khoản?{' '}
					<Link 
						to="/auth/login"
						style={{
							background: 'none',
							border: 'none',
							color: 'var(--primary)',
							cursor: 'pointer',
							textDecoration: 'underline',
							fontSize: 'inherit',
							fontFamily: 'inherit'
						}}
					>
						Đăng nhập
					</Link>
				</p>
			}
		>
			<Input
				id="username"
				name="username"
				type="text"
				value={formData.username}
				onChange={handleInputChange}
				placeholder="Nhập tên đăng nhập"
				error={errors.username}
				required
			/>

			<Input
				id="firstName"
				name="firstName"
				type="text"
				value={formData.firstName}
				onChange={handleInputChange}
				placeholder="Nhập họ"
				error={errors.firstName}
				required
			/>

			<Input
				id="lastName"
				name="lastName"
				type="text"
				value={formData.lastName}
				onChange={handleInputChange}
				placeholder="Nhập tên"
				error={errors.lastName}
				required
			/>

			<Input
				id="email"
				name="email"
				type="email"
				value={formData.email}
				onChange={handleInputChange}
				placeholder="Nhập email của bạn"
				error={errors.email}
				required
			/>
			
			<div>
				<Input
					id="password"
					name="password"
					type="password"
					value={formData.password}
					onChange={handleInputChange}
					placeholder="Tạo mật khẩu"
					error={errors.password}
					required
				/>
				<PasswordStrength strength={passwordStrength} />
			</div>
			
			<Input
				id="confirmPassword"
				name="confirmPassword"
				type="password"
				value={formData.confirmPassword}
				onChange={handleInputChange}
				placeholder="Xác nhận mật khẩu"
				error={errors.confirmPassword}
				required
			/>
		</AuthForm>
	)
}