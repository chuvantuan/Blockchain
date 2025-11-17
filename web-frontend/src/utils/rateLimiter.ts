interface RateLimitConfig {
	maxAttempts: number
	windowMs: number
	blockDurationMs: number
}

interface AttemptRecord {
	count: number
	firstAttempt: number
	blockedUntil?: number
}

class RateLimiter {
	private attempts: Map<string, AttemptRecord> = new Map()
	private config: RateLimitConfig

	constructor(config: RateLimitConfig) {
		this.config = config
	}

	// Check if action is allowed
	isAllowed(identifier: string): { allowed: boolean; remainingAttempts?: number; retryAfter?: number } {
		const now = Date.now()
		const record = this.attempts.get(identifier)

		// No previous attempts
		if (!record) {
			return { allowed: true, remainingAttempts: this.config.maxAttempts - 1 }
		}

		// Check if still blocked
		if (record.blockedUntil && now < record.blockedUntil) {
			return {
				allowed: false,
				retryAfter: Math.ceil((record.blockedUntil - now) / 1000)
			}
		}

		// Check if window has expired
		if (now - record.firstAttempt > this.config.windowMs) {
			// Reset the window
			this.attempts.delete(identifier)
			return { allowed: true, remainingAttempts: this.config.maxAttempts - 1 }
		}

		// Check if max attempts reached
		if (record.count >= this.config.maxAttempts) {
			// Block the identifier
			record.blockedUntil = now + this.config.blockDurationMs
			return {
				allowed: false,
				retryAfter: Math.ceil(this.config.blockDurationMs / 1000)
			}
		}

		return {
			allowed: true,
			remainingAttempts: this.config.maxAttempts - record.count - 1
		}
	}

	// Record an attempt
	recordAttempt(identifier: string): void {
		const now = Date.now()
		const record = this.attempts.get(identifier)

		if (!record) {
			this.attempts.set(identifier, {
				count: 1,
				firstAttempt: now
			})
		} else {
			// Check if window has expired
			if (now - record.firstAttempt > this.config.windowMs) {
				// Reset the window
				this.attempts.set(identifier, {
					count: 1,
					firstAttempt: now
				})
			} else {
				record.count++
			}
		}
	}

	// Reset attempts for identifier
	reset(identifier: string): void {
		this.attempts.delete(identifier)
	}

	// Clean up expired records
	cleanup(): void {
		const now = Date.now()
		for (const [identifier, record] of this.attempts.entries()) {
			// Remove expired records
			if (now - record.firstAttempt > this.config.windowMs && 
				(!record.blockedUntil || now > record.blockedUntil)) {
				this.attempts.delete(identifier)
			}
		}
	}
}

// Create rate limiters for different actions
export const loginRateLimiter = new RateLimiter({
	maxAttempts: 5,
	windowMs: 15 * 60 * 1000, // 15 minutes
	blockDurationMs: 30 * 60 * 1000 // 30 minutes
})

export const registerRateLimiter = new RateLimiter({
	maxAttempts: 3,
	windowMs: 60 * 60 * 1000, // 1 hour
	blockDurationMs: 2 * 60 * 60 * 1000 // 2 hours
})

// Cleanup expired records every 5 minutes
setInterval(() => {
	loginRateLimiter.cleanup()
	registerRateLimiter.cleanup()
}, 5 * 60 * 1000)

export { RateLimiter }
