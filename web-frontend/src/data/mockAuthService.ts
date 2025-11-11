// Mock authentication service for development
export interface User {
	id: string
	email: string
	name: string
	role: 'admin' | 'user'
	avatar?: string
}

export interface LoginCredentials {
	usernameOrEmail: string
	password: string
}

export interface AuthResponse {
	success: boolean
	user?: User
	message?: string
}

// Mock users database
const mockUsers: User[] = [
	{
		id: '1',
		email: 'a@gmail.com',
		name: 'Admin User',
		role: 'admin',
		avatar: 'https://avatars.githubusercontent.com/u/1?v=4'
	},
	{
		id: '2',
		email: 'b@gmail.com',
		name: 'Regular User',
		role: 'user',
		avatar: 'https://avatars.githubusercontent.com/u/2?v=4'
	}
]

const ADMIN_PASSWORD = 'Quyet2004#'
const USER_PASSWORD = 'Quyet2004#'

export class MockAuthService {
	// Simulate login
	static async login(credentials: LoginCredentials): Promise<AuthResponse> {
		// Simulate network delay
		await new Promise(resolve => setTimeout(resolve, 1000))

		const { usernameOrEmail, password } = credentials

		// Find user by email (since usernameOrEmail can be email)
		const user = mockUsers.find(u => u.email === usernameOrEmail)

		if (!user) {
			return {
				success: false,
				message: 'User not found'
			}
		}

		// Check password based on role
		const correctPassword = user.role === 'admin' ? ADMIN_PASSWORD : USER_PASSWORD

		if (password !== correctPassword) {
			return {
				success: false,
				message: 'Invalid password'
			}
		}

		// Store user in localStorage for persistence
		localStorage.setItem('auth_user', JSON.stringify(user))
		localStorage.setItem('auth_token', 'mock_token_' + user.id)

		return {
			success: true,
			user
		}
	}

	// Simulate logout
	static async logout(): Promise<void> {
		// Simulate network delay
		await new Promise(resolve => setTimeout(resolve, 500))

		localStorage.removeItem('auth_user')
		localStorage.removeItem('auth_token')
	}

	// Get current user from localStorage
	static getCurrentUser(): User | null {
		const userStr = localStorage.getItem('auth_user')
		if (!userStr) return null

		try {
			return JSON.parse(userStr)
		} catch {
			return null
		}
	}

	// Check if user is authenticated
	static isAuthenticated(): boolean {
		return !!localStorage.getItem('auth_token')
	}

	// Simulate register (for demo purposes)
	static async register(userData: {
		username: string
		email: string
		password: string
		firstName: string
		lastName: string
		phoneNumber?: string
	}): Promise<AuthResponse> {
		// Simulate network delay
		await new Promise(resolve => setTimeout(resolve, 1000))

		const { username, email, firstName, lastName, password } = userData

		// Check if user already exists
		const existingUser = mockUsers.find(u => u.email === email)
		if (existingUser) {
			return {
				success: false,
				message: 'User already exists'
			}
		}

		// Create new user (default role: user)
		const newUser: User = {
			id: (mockUsers.length + 1).toString(),
			email,
			name: `${firstName} ${lastName}`.trim(),
			role: 'user',
			avatar: `https://avatars.githubusercontent.com/u/${mockUsers.length + 1}?v=4`
		}

		// Add to mock database
		mockUsers.push(newUser)

		// Store user in localStorage
		localStorage.setItem('auth_user', JSON.stringify(newUser))
		localStorage.setItem('auth_token', 'mock_token_' + newUser.id)

		return {
			success: true,
			user: newUser
		}
	}

	// Get all users (admin only)
	static async getAllUsers(): Promise<User[]> {
		await new Promise(resolve => setTimeout(resolve, 500))
		return [...mockUsers]
	}
}

export default MockAuthService
