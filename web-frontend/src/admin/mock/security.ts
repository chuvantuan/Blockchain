import { BlockchainModule, ActivityLog, SecurityAlert, TokenInfo, WalletInfo, SecurityDashboard } from '../types/security'

// Mock Blockchain Modules
export const mockBlockchainModules: BlockchainModule[] = [
	{
		id: 'anti-cheat',
		name: 'Hệ thống thi trực tuyến chống gian lận',
		description: 'ReactJS + Node.js + Smart Contract • Camera AI + On-chain scoring',
		type: 'anti_cheat',
		status: 'active',
		blockchain: 'ethereum',
		contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
		lastUpdate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
		totalTransactions: 15420,
		todayTransactions: 234,
		activeUsers: 1250,
		totalValue: 45.6,
		responseTime: 120,
		errorRate: 0.2,
		uptime: 99.8,
		securityScore: 95,
		vulnerabilities: 0,
		lastAudit: '2024-01-15',
		auditScore: 98
	},
	{
		id: 'copyright-protection',
		name: 'Bảo vệ bản quyền tài liệu học thuật',
		description: 'ReactJS + Node.js + Ethereum • Document hash + Immutable proof',
		type: 'copyright_protection',
		status: 'warning',
		blockchain: 'ethereum',
		contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
		lastUpdate: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
		totalTransactions: 8230,
		todayTransactions: 156,
		activeUsers: 890,
		totalValue: 23.4,
		responseTime: 180,
		errorRate: 1.2,
		uptime: 98.5,
		securityScore: 88,
		vulnerabilities: 2,
		lastAudit: '2023-12-20',
		auditScore: 85
	},
	{
		id: 'token-rewards',
		name: 'Hệ thống học trực tuyến thưởng token',
		description: 'ReactJS + Node.js + ERC-20 • Auto-reward + Learning ecosystem',
		type: 'token_rewards',
		status: 'active',
		blockchain: 'ethereum',
		contractAddress: '0x9876543210fedcba9876543210fedcba98765432',
		lastUpdate: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
		totalTransactions: 45670,
		todayTransactions: 892,
		activeUsers: 3200,
		totalValue: 156.8,
		responseTime: 95,
		errorRate: 0.1,
		uptime: 99.9,
		securityScore: 97,
		vulnerabilities: 0,
		lastAudit: '2024-02-01',
		auditScore: 96
	},
	{
		id: 'multisig-wallet',
		name: 'Ví đa chữ ký (Multisig Wallet)',
		description: 'ReactJS UI + Node.js backend • Multi-signature + Secure transactions',
		type: 'multisig_wallet',
		status: 'error',
		blockchain: 'ethereum',
		contractAddress: '0xfedcba0987654321fedcba0987654321fedcba09',
		lastUpdate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		totalTransactions: 3450,
		todayTransactions: 23,
		activeUsers: 45,
		totalValue: 12.7,
		responseTime: 2500,
		errorRate: 5.8,
		uptime: 92.3,
		securityScore: 72,
		vulnerabilities: 4,
		lastAudit: '2023-11-10',
		auditScore: 78
	}
]

// Mock Activity Logs
export const mockActivityLogs: ActivityLog[] = [
	{
		id: 'log-1',
		timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
		module: 'token-rewards',
		type: 'transaction',
		severity: 'info',
		message: 'Auto-reward: Student completed course → received 15 LEARN tokens',
		details: { userId: 'user-123', courseId: 'course-456', amount: '15', tokenType: 'LEARN' },
		transactionHash: '0xabc123...',
		blockNumber: 18456789,
		gasUsed: 45000,
		gasPrice: '20'
	},
	{
		id: 'log-2',
		timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
		module: 'anti-cheat',
		type: 'security_alert',
		severity: 'warning',
		message: 'Camera AI detected suspicious activity → Exam result saved on-chain',
		details: { examId: 'exam-456', userId: 'user-789', violationType: 'multiple_faces', score: 85 }
	},
	{
		id: 'log-3',
		timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
		module: 'copyright-protection',
		type: 'contract_deploy',
		severity: 'info',
		message: 'Academic document hash registered → Immutable proof on Ethereum',
		details: { documentId: 'doc-101', hash: 'sha256:a1b2c3...', owner: 'teacher-456', type: 'research_paper' },
		transactionHash: '0xdef456...',
		blockNumber: 18456787,
		gasUsed: 120000,
		gasPrice: '18'
	},
	{
		id: 'log-4',
		timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
		module: 'multisig-wallet',
		type: 'error',
		severity: 'error',
		message: 'Multisig transaction failed → Insufficient signatures (2/3 required)',
		details: { transactionId: 'tx-789', required: 3, received: 2, amount: '5.5 ETH' }
	},
	{
		id: 'log-5',
		timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
		module: 'token-rewards',
		type: 'system_event',
		severity: 'info',
		message: 'Learning ecosystem reward pool replenished → 1000 LEARN tokens added',
		details: { amount: '1000', tokenType: 'LEARN', source: 'treasury' }
	},
	{
		id: 'log-6',
		timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
		module: 'anti-cheat',
		type: 'user_action',
		severity: 'info',
		message: 'Proctored exam started → Camera AI monitoring + Smart contract logging',
		details: { userId: 'user-456', examId: 'exam-789', sessionId: 'session-123', duration: '60min' }
	},
	{
		id: 'log-7',
		timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
		module: 'multisig-wallet',
		type: 'security_alert',
		severity: 'critical',
		message: 'Unauthorized multisig access attempt → 5 failed signatures detected',
		details: { walletAddress: '0xfedcba...', ipAddress: '192.168.1.100', attemptCount: 5 }
	},
	{
		id: 'log-8',
		timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		module: 'copyright-protection',
		type: 'audit',
		severity: 'warning',
		message: 'Document hash contract audit → 2 medium severity issues found',
		details: { auditId: 'audit-2024-01', issues: 2, severity: 'medium', contract: 'HashRegistry' }
	},
	{
		id: 'log-9',
		timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
		module: 'token-rewards',
		type: 'transaction',
		severity: 'info',
		message: 'Token exchange → Student redeemed 50 LEARN for certificate',
		details: { userId: 'user-789', amount: '50', tokenType: 'LEARN', reward: 'certificate' }
	},
	{
		id: 'log-10',
		timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
		module: 'multisig-wallet',
		type: 'transaction',
		severity: 'info',
		message: 'Multisig transaction approved → 3/3 signatures confirmed',
		details: { transactionId: 'tx-456', amount: '2.3 ETH', recipient: '0x1234...', gasUsed: 21000 }
	}
]

// Mock Security Alerts
export const mockSecurityAlerts: SecurityAlert[] = [
	{
		id: 'alert-1',
		timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		module: 'multisig-wallet',
		type: 'unauthorized_access',
		severity: 'critical',
		title: 'Multisig wallet unauthorized access attempt',
		description: '5 consecutive failed signature attempts detected from suspicious IP address',
		resolved: false
	},
	{
		id: 'alert-2',
		timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
		module: 'copyright-protection',
		type: 'contract_vulnerability',
		severity: 'high',
		title: 'Document hash contract vulnerability detected',
		description: 'Potential reentrancy attack vector in document hash verification system',
		resolved: false
	},
	{
		id: 'alert-3',
		timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
		module: 'token-rewards',
		type: 'gas_price_spike',
		severity: 'medium',
		title: 'ERC-20 token reward gas spike',
		description: 'Gas price increased 300% affecting auto-reward transactions for students',
		resolved: true,
		resolvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
		resolvedBy: 'admin-user'
	},
	{
		id: 'alert-4',
		timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
		module: 'anti-cheat',
		type: 'smart_contract_error',
		severity: 'low',
		title: 'Camera AI smart contract minor error',
		description: 'Non-critical error in exam score logging function - on-chain recording affected',
		resolved: true,
		resolvedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
		resolvedBy: 'dev-team'
	}
]

// Mock Token Info
export const mockTokens: TokenInfo[] = [
	{
		symbol: 'LEARN',
		name: 'Learning Ecosystem Token',
		contractAddress: '0x9876543210fedcba9876543210fedcba98765432',
		decimals: 18,
		totalSupply: '10000000000000000000000000', // 10M tokens
		currentPrice: 0.15,
		marketCap: 1500000,
		holders: 3200,
		transfers24h: 892
	},
	{
		symbol: 'CERT',
		name: 'Certificate Token',
		contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
		decimals: 18,
		totalSupply: '5000000000000000000000000', // 5M tokens
		currentPrice: 0.08,
		marketCap: 400000,
		holders: 890,
		transfers24h: 156
	}
]

// Mock Wallet Info
export const mockWallets: WalletInfo[] = [
	{
		address: '0xfedcba0987654321fedcba0987654321fedcba09',
		type: 'multisig',
		balance: '12.7',
		owners: [
			'0x1234567890abcdef1234567890abcdef12345678', // Admin 1
			'0xabcdef1234567890abcdef1234567890abcdef12', // Admin 2
			'0x9876543210fedcba9876543210fedcba98765432'  // Admin 3
		],
		requiredConfirmations: 2,
		totalConfirmations: 3,
		pendingTransactions: 2,
		lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString()
	},
	{
		address: '0x1111111111111111111111111111111111111111',
		type: 'regular',
		balance: '45.6',
		pendingTransactions: 0,
		lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString()
	}
]

// Complete Security Dashboard
export const mockSecurityDashboard: SecurityDashboard = {
	overview: {
		totalModules: 4,
		activeModules: 2,
		totalTransactions: 72770,
		totalAlerts: 4,
		unresolvedAlerts: 2,
		averageSecurityScore: 88
	},
	modules: mockBlockchainModules,
	recentActivities: mockActivityLogs,
	securityAlerts: mockSecurityAlerts,
	tokens: mockTokens,
	wallets: mockWallets
}

// Helper functions
export function getModuleById(id: string): BlockchainModule | undefined {
	return mockBlockchainModules.find(module => module.id === id)
}

export function getActiveModules(): BlockchainModule[] {
	return mockBlockchainModules.filter(module => module.status === 'active')
}

export function getUnresolvedAlerts(): SecurityAlert[] {
	return mockSecurityAlerts.filter(alert => !alert.resolved)
}

export function getRecentActivities(limit = 10): ActivityLog[] {
	return mockActivityLogs
		.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
		.slice(0, limit)
}
