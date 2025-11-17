// Security utilities for frontend validation and protection

// Generate a unique device fingerprint
export function generateDeviceFingerprint(): string {
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')
	if (ctx) {
		ctx.textBaseline = 'top'
		ctx.font = '14px Arial'
		ctx.fillText('Device fingerprint', 2, 2)
	}

	const fingerprint = [
		navigator.userAgent,
		navigator.language,
		screen.width + 'x' + screen.height,
		new Date().getTimezoneOffset(),
		canvas.toDataURL(),
		navigator.hardwareConcurrency || 0,
		(navigator as any).deviceMemory || 0
	].join('|')

	// Simple hash function
	let hash = 0
	for (let i = 0; i < fingerprint.length; i++) {
		const char = fingerprint.charCodeAt(i)
		hash = ((hash << 5) - hash) + char
		hash = hash & hash // Convert to 32-bit integer
	}

	return Math.abs(hash).toString(36)
}

// Check for common password patterns
export function checkPasswordPatterns(password: string): string[] {
	const issues: string[] = []

	// Common patterns
	const patterns = [
		{ regex: /(.)\1{2,}/, message: 'Không được có quá 2 ký tự giống nhau liên tiếp' },
		{ regex: /123|234|345|456|567|678|789|890/, message: 'Tránh dãy số liên tiếp' },
		{ regex: /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i, message: 'Tránh dãy chữ cái liên tiếp' },
		{ regex: /qwerty|asdf|zxcv|qaz|wsx|edc/i, message: 'Tránh mẫu bàn phím phổ biến' }
	]

	patterns.forEach(pattern => {
		if (pattern.regex.test(password)) {
			issues.push(pattern.message)
		}
	})

	// Check for common passwords
	const commonPasswords = [
		'password', 'password123', '123456', '123456789', 'qwerty',
		'abc123', 'password1', 'admin', 'letmein', 'welcome',
		'monkey', '1234567890', 'dragon', 'master', 'hello'
	]

	if (commonPasswords.some(common => 
		password.toLowerCase().includes(common.toLowerCase())
	)) {
		issues.push('Tránh sử dụng mật khẩu phổ biến')
	}

	return issues
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
	const div = document.createElement('div')
	div.textContent = input
	return div.innerHTML
}

// Check if email domain is suspicious
export function checkEmailDomain(email: string): { valid: boolean; warning?: string } {
	const domain = email.split('@')[1]?.toLowerCase()
	
	if (!domain) {
		return { valid: false }
	}

	// List of suspicious or temporary email domains
	const suspiciousDomains = [
		'10minutemail.com', 'tempmail.org', 'guerrillamail.com',
		'mailinator.com', 'yopmail.com', 'temp-mail.org',
		'throwaway.email', 'getnada.com'
	]

	// List of common typos for popular domains
	const typoMap: Record<string, string> = {
		'gmial.com': 'gmail.com',
		'gmai.com': 'gmail.com',
		'yahooo.com': 'yahoo.com',
		'hotmial.com': 'hotmail.com',
		'outlok.com': 'outlook.com'
	}

	if (suspiciousDomains.includes(domain)) {
		return {
			valid: false,
			warning: 'Email tạm thời không được chấp nhận'
		}
	}

	if (typoMap[domain]) {
		return {
			valid: true,
			warning: `Bạn có ý muốn dùng ${typoMap[domain]} không?`
		}
	}

	return { valid: true }
}

// Generate CSRF token (simple implementation)
export function generateCSRFToken(): string {
	const array = new Uint8Array(32)
	crypto.getRandomValues(array)
	return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Validate CSRF token
export function validateCSRFToken(token: string): boolean {
	const storedToken = sessionStorage.getItem('csrf_token')
	return storedToken === token
}

// Set CSRF token
export function setCSRFToken(): string {
	const token = generateCSRFToken()
	sessionStorage.setItem('csrf_token', token)
	return token
}

// Check for bot-like behavior
export function checkBotBehavior(): { isBot: boolean; confidence: number; checks: string[] } {
	let botScore = 0
	const checks: string[] = []

	// Check for webdriver
	if ('webdriver' in navigator || (window as any).webdriver) {
		botScore += 0.8
		checks.push('webdriver detected')
	}

	// Check for automation tools
	if ((window as any).phantom || (window as any).callPhantom) {
		botScore += 0.9
		checks.push('phantom detected')
	}

	// Check mouse movements (simplified)
	const mouseEvents = (window as any).__mouseEvents || 0
	if (mouseEvents === 0) {
		botScore += 0.3
		checks.push('no mouse events')
	}

	// Check timing patterns (very fast form submission)
	const formStartTime = (window as any).__formStartTime
	if (formStartTime && Date.now() - formStartTime < 2000) {
		botScore += 0.4
		checks.push('too fast submission')
	}

	return {
		isBot: botScore > 0.7,
		confidence: Math.min(botScore, 1),
		checks
	}
}

// Initialize bot detection
export function initBotDetection(): void {
	(window as any).__mouseEvents = 0;
	(window as any).__formStartTime = Date.now()

	document.addEventListener('mousemove', () => {
		(window as any).__mouseEvents++
	})
}

// Password strength with security considerations
export function calculateSecurePasswordStrength(password: string): {
	score: number
	strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong'
	issues: string[]
	suggestions: string[]
} {
	let score = 0
	const issues: string[] = []
	const suggestions: string[] = []

	// Length scoring
	if (password.length >= 8) score += 1
	if (password.length >= 12) score += 1
	if (password.length >= 16) score += 1

	// Character variety
	if (/[a-z]/.test(password)) score += 1
	if (/[A-Z]/.test(password)) score += 1
	if (/[0-9]/.test(password)) score += 1
	if (/[^a-zA-Z0-9]/.test(password)) score += 1

	// Check for patterns and common passwords
	const patternIssues = checkPasswordPatterns(password)
	issues.push(...patternIssues)
	
	// Reduce score for each issue
	score -= patternIssues.length * 0.5
	score = Math.max(0, score)

	// Generate suggestions
	if (password.length < 8) suggestions.push('Tăng độ dài lên ít nhất 8 ký tự')
	if (!/[a-z]/.test(password)) suggestions.push('Thêm chữ thường')
	if (!/[A-Z]/.test(password)) suggestions.push('Thêm chữ hoa')
	if (!/[0-9]/.test(password)) suggestions.push('Thêm số')
	if (!/[^a-zA-Z0-9]/.test(password)) suggestions.push('Thêm ký tự đặc biệt')

	// Determine strength
	let strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong'
	if (score <= 1) strength = 'very-weak'
	else if (score <= 2) strength = 'weak'
	else if (score <= 4) strength = 'fair'
	else if (score <= 6) strength = 'good'
	else strength = 'strong'

	return { score, strength, issues, suggestions }
}
