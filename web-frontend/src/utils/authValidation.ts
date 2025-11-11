export const validateEmail = (email: string): string | null => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!email) return 'Email là bắt buộc'
	if (!emailRegex.test(email)) return 'Vui lòng nhập địa chỉ email hợp lệ'
	return null
}

export const validatePassword = (password: string): string | null => {
	if (!password) return 'Mật khẩu là bắt buộc'
	if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự'
	
	// Check for Vietnamese characters (có dấu)
	const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/
	if (vietnameseRegex.test(password)) {
		return 'Mật khẩu không được chứa ký tự tiếng Việt có dấu'
	}
	
	// Check for spaces
	if (password.includes(' ')) {
		return 'Mật khẩu không được chứa khoảng trắng'
	}
	
	return null
}

export const validateName = (name: string): string | null => {
	if (!name) return 'Tên là bắt buộc'
	if (name.length < 2) return 'Tên phải có ít nhất 2 ký tự'
	return null
}

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
	if (!confirmPassword) return 'Vui lòng xác nhận mật khẩu'
	if (password !== confirmPassword) return 'Mật khẩu không khớp'
	return null
}

export const checkPasswordStrength = (password: string): 'weak' | 'fair' | 'good' | 'strong' => {
	if (!password) return 'weak'
	
	let score = 0
	
	// Length check
	if (password.length >= 8) score += 1
	if (password.length >= 12) score += 1
	
	// Character variety checks
	if (/[a-z]/.test(password)) score += 1
	if (/[A-Z]/.test(password)) score += 1
	if (/[0-9]/.test(password)) score += 1
	if (/[^a-zA-Z0-9]/.test(password)) score += 1
	
	// Penalty for Vietnamese characters or spaces
	const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]/
	if (vietnameseRegex.test(password) || password.includes(' ')) {
		score = Math.max(0, score - 2) // Heavy penalty
	}
	
	if (score <= 2) return 'weak'
	if (score <= 4) return 'fair'
	if (score <= 5) return 'good'
	return 'strong'
}
