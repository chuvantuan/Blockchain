import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import AuthForm from '../components/molecules/AuthForm'
import Input from '../components/atoms/Input'
import { IDENTITY_API } from '../config/api'
import Checkbox from '../components/atoms/Checkbox'
import SocialAuthButtons from '../components/molecules/SocialAuthButtons'
import { validateEmail, validatePassword } from '../utils/authValidation'
import { loginUser, clearError } from '../store/slices/authSlice'

export default function LoginPage(): JSX.Element {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [rememberMe, setRememberMe] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [webAuthnLoading, setWebAuthnLoading] = useState(false)

	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const { loading, error, loggedIn, role } = useAppSelector((state) => state.auth)

	// Redirect based on role after successful login
	useEffect(() => {
		if (loggedIn) {
			if (role === 'admin') {
				navigate('/admin/dashboard')
			} else if (role === 'user') {
				navigate('/user')
			}
		}
	}, [loggedIn, role, navigate])

	// Clear error when component mounts
	useEffect(() => {
		dispatch(clearError())
	}, [dispatch])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		
		// Validate form
		const emailError = validateEmail(formData.email)
		const passwordError = validatePassword(formData.password)
		
		if (emailError || passwordError) {
			setErrors({
				email: emailError || '',
				password: passwordError || ''
			})
			return
		}

		// Dispatch login action
		dispatch(loginUser({
			usernameOrEmail: formData.email,
			password: formData.password
		}))
	}

	const handleGoogleAuth = () => {
		console.log('Google authentication')
		// TODO: Implement Google OAuth
	}

	const handleFacebookAuth = () => {
		console.log('Facebook authentication')
		// TODO: Implement Facebook OAuth
	}

	const handleGitHubAuth = () => {
		console.log('GitHub authentication')
		// TODO: Implement GitHub OAuth
	}

	// WebAuthn Authentication
	const startWebAuthnAuthentication = async () => {
		if (!formData.email) {
            setErrors(prev => ({ ...prev, email: 'Please enter your email to use WebAuthn.' }));
            return;
        }

		setWebAuthnLoading(true)
		try {
			// Step 1: Get assertion options from server (qua API Gateway - localhost:8080)
			const response = await fetch(`${IDENTITY_API}/webauthn/assertion/options`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username: formData.email // Use email as username for WebAuthn
				})
			})

			if (!response.ok) {
					const errorData = await response.json();
				throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
			}

			            const raw = await response.json()
			            // Support both direct and wrapped shapes
			            const options = (raw && (raw.publicKeyCredentialRequestOptions || raw.data?.publicKeyCredentialRequestOptions)) || raw
			            console.log('Assertion options:', options)
			
			            // Step 2: Get assertion from authenticator
            const allowCredentials = (options.allowCredentials || []).map((cred: any) => {
			                const mapped: any = {
			                    type: cred.type || 'public-key',
			                    id: base64UrlToArrayBuffer(cred.id)
			                }
                // Force platform authenticator during login
                mapped.transports = ['internal']
			                return mapped
			            })

            const publicKeyOptions: any = {
                challenge: base64UrlToArrayBuffer(options.challenge),
                rpId: options.rpId,
                userVerification: options.userVerification || 'required',
                timeout: options.timeout || 60000
            }
            // Prefer discoverable credentials: omit allowCredentials so platform passkey can be found
            if (allowCredentials.length > 0) {
                publicKeyOptions.allowCredentials = allowCredentials
            }

            const assertion = await navigator.credentials.get({
                publicKey: publicKeyOptions
            }) as PublicKeyCredential
			console.log('Got assertion:', assertion)

			// Step 3: Send assertion to server in Yubico's expected JSON format
			const rawIdB64u = arrayBufferToBase64Url(assertion.rawId)
			const assertionJSON = {
				id: rawIdB64u,
				rawId: rawIdB64u,
				type: assertion.type,
				response: {
					clientDataJSON: arrayBufferToBase64Url((assertion.response as any).clientDataJSON),
					authenticatorData: arrayBufferToBase64Url((assertion.response as any).authenticatorData),
					signature: arrayBufferToBase64Url((assertion.response as any).signature),
					userHandle: arrayBufferToBase64Url(new TextEncoder().encode(formData.email).buffer)
				},
				clientExtensionResults: (assertion as any).getClientExtensionResults ? (assertion as any).getClientExtensionResults() : {}
			}

			const response2 = await fetch(`${IDENTITY_API}/webauthn/assertion/result`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(assertionJSON)
			})

			if (!response2.ok) {
				const msg = await response2.text()
				throw new Error(`Finish assertion failed ${response2.status}: ${msg}`)
			}

			            const result = await response2.json()
						console.log('Authentication result:', result)
			
						if (result.success && result.data) {
							// WebAuthn authentication successful
							alert('Đăng nhập WebAuthn thành công!')
			
							const { accessToken, refreshToken, user: backendUser } = result.data;
			
							const user = {
								id: backendUser.id.toString(),
								email: backendUser.email,
								name: `${backendUser.firstName} ${backendUser.lastName}`.trim(),
								role: backendUser.roles[0]?.toLowerCase(),
								avatar: backendUser.avatarUrl
							};
			
							localStorage.setItem('accessToken', accessToken);
							localStorage.setItem('refreshToken', refreshToken);
							localStorage.setItem('user', JSON.stringify(user));
			
							dispatch({
								type: 'auth/loginUser/fulfilled',
								payload: user,
							});
						} else {
							alert('Đăng nhập WebAuthn thất bại: ' + (result.message || 'Unknown error'))
						}
		} catch (error: any) {
			console.error('WebAuthn authentication error:', error)
			alert('Lỗi đăng nhập WebAuthn: ' + error.message)
		} finally {
			setWebAuthnLoading(false)
		}
	}

	// Utility functions for WebAuthn
	function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
		const bytes = new Uint8Array(buffer)
		let binary = ''
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i])
		}
		return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
	}

	function base64UrlToArrayBuffer(base64Url: string): ArrayBuffer {
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
		const binary = atob(padded)
		const buffer = new ArrayBuffer(binary.length)
		const bytes = new Uint8Array(buffer)
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i)
		}
		return buffer
	}

	// Check WebAuthn support (runtime check)
	const isWebAuthnSupported = typeof window !== 'undefined' &&
									window.navigator &&
									'credentials' in window.navigator &&
									typeof window.navigator.credentials.create === 'function' &&
									typeof window.navigator.credentials.get === 'function'

	return (
		<AuthForm
			title="Chào mừng trở lại"
			subtitle="Đăng nhập vào tài khoản của bạn để tiếp tục"
			onSubmit={handleSubmit}
			buttonText="Đăng nhập"
			loading={loading}
			error={error}
			afterButton={
				<div>
					<SocialAuthButtons
						onGoogleAuth={handleGoogleAuth}
						onGitHubAuth={handleGitHubAuth}
					/>
					{isWebAuthnSupported && (
						<div style={{ marginTop: '1rem', textAlign: 'center' }}>
							<button
								type="button"
								onClick={startWebAuthnAuthentication}
								disabled={webAuthnLoading}
								style={{
									width: '100%',
									padding: '0.75rem',
									backgroundColor: webAuthnLoading ? '#ccc' : '#28a745',
									color: 'white',
									border: 'none',
									borderRadius: '0.375rem',
									fontSize: '1rem',
									cursor: webAuthnLoading ? 'not-allowed' : 'pointer'
								}}
							>
								{webAuthnLoading ? '⏳ Đang xác thực...' : '🔐 Đăng nhập không mật khẩu (WebAuthn)'}
							</button>
						</div>
					)}
				</div>
			}
			footer={
				<p style={{ margin: 0 }}>
					Chưa có tài khoản?{' '}
					<Link 
						to="/auth/register"
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
						Đăng ký
					</Link>
				</p>
			}
		>
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
			
			<Input
				id="password"
				name="password"
				type="password"
				value={formData.password}
				onChange={handleInputChange}
				placeholder="Nhập mật khẩu của bạn"
				error={errors.password}
				required
			/>
			
			<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				marginTop: '-0.5rem'
			}}>
				<Checkbox
					id="remember"
					label="Ghi nhớ đăng nhập"
					checked={rememberMe}
					onChange={setRememberMe}
				/>
				<Link 
					to="/auth/forgot"
					style={{
						background: 'none',
						border: 'none',
						color: 'var(--primary)',
						cursor: 'pointer',
						fontSize: '0.875rem',
						textDecoration: 'none'
					}}
				>
					Quên mật khẩu?
				</Link>
			</div>
		</AuthForm>
	)
}