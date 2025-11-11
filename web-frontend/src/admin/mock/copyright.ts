// Copyright Page Mock Data

import { 
	Document, 
	CopyrightStats, 
	VerificationRecord, 
	DisputeRecord, 
	CopyrightDashboard,
	AuthorStats,
	CategoryStats,
	BlockchainStatus,
	BlockchainInfo
} from '../types/copyright'

// Mock Documents
export const mockDocuments: Document[] = [
	{
		id: 'doc-001',
		title: 'Machine Learning Fundamentals',
		author: 'Dr. Nguyễn Văn An',
		description: 'Comprehensive guide to machine learning algorithms and applications',
		category: 'academic',
		keywords: ['machine learning', 'AI', 'algorithms', 'data science'],
		references: ['https://example.com/ref1', 'https://example.com/ref2'],
		fileType: 'pdf',
		fileSize: 2.5 * 1024 * 1024, // 2.5MB
		hash: 'a1b2c3d4e5f6789012345678901234567890abcd',
		blockchainHash: '0x1234567890abcdef1234567890abcdef12345678',
		transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
		blockNumber: 18456789,
		gasUsed: 125000,
		registrationDate: '2024-01-15T10:30:00Z',
		lastModified: '2024-01-15T10:30:00Z',
		status: 'verified',
		ipfsHash: 'QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx',
		metadata: {
			category: 'academic',
			keywords: ['machine learning', 'AI', 'algorithms', 'data science'],
			language: 'en',
			version: '1.0',
			license: 'copyright',
			originalSource: 'University Research',
			references: ['https://example.com/ref1', 'https://example.com/ref2'],
			doi: '10.1000/182',
			isbn: '978-0-123456-78-9'
		},
		verificationHistory: [
			{
				id: 'ver-001',
				documentId: 'doc-001',
				verifier: 'Blockchain Validator',
				verificationType: 'blockchain_verified',
				status: 'verified',
				timestamp: '2024-01-15T10:35:00Z',
				details: 'Hash verified on Ethereum blockchain',
				confidence: 100,
				evidence: ['blockchain_transaction', 'hash_match']
			}
		],
		disputes: []
	},
	{
		id: 'doc-002',
		title: 'Advanced React Patterns',
		author: 'Trần Thị Lan',
		description: 'Modern React development patterns and best practices',
		category: 'research',
		keywords: ['React', 'JavaScript', 'frontend', 'patterns'],
		references: ['https://reactjs.org/docs', 'https://example.com/react-patterns'],
		fileType: 'docx',
		fileSize: 1.8 * 1024 * 1024, // 1.8MB
		hash: 'b2c3d4e5f6789012345678901234567890abcdef1',
		blockchainHash: '0x234567890abcdef1234567890abcdef123456789',
		transactionHash: '0xbcdef1234567890abcdef1234567890abcdef123',
		blockNumber: 18456790,
		gasUsed: 98000,
		registrationDate: '2024-01-16T14:20:00Z',
		lastModified: '2024-01-16T14:20:00Z',
		status: 'registered',
		ipfsHash: 'QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy',
		metadata: {
			category: 'research',
			keywords: ['react', 'frontend', 'javascript', 'patterns'],
			language: 'en',
			version: '2.1',
			license: 'cc-by',
			originalSource: 'Personal Research',
			references: ['https://reactjs.org/docs', 'https://github.com/facebook/react'],
			doi: '10.1000/183'
		},
		verificationHistory: [
			{
				id: 'ver-002',
				documentId: 'doc-002',
				verifier: 'AI Validator',
				verificationType: 'ai_check',
				status: 'verified',
				timestamp: '2024-01-16T14:25:00Z',
				details: 'Content originality verified by AI',
				confidence: 95,
				evidence: ['ai_analysis', 'plagiarism_check']
			}
		],
		disputes: []
	},
	{
		id: 'doc-003',
		title: 'Blockchain Technology Overview',
		author: 'Lê Minh Tuấn',
		description: 'Introduction to blockchain technology and its applications',
		category: 'presentation',
		keywords: ['blockchain', 'cryptocurrency', 'distributed systems'],
		references: ['https://bitcoin.org', 'https://ethereum.org'],
		fileType: 'ppt',
		fileSize: 3.2 * 1024 * 1024, // 3.2MB
		hash: 'c3d4e5f6789012345678901234567890abcdef12',
		blockchainHash: '0x34567890abcdef1234567890abcdef1234567890',
		transactionHash: '0xcdef1234567890abcdef1234567890abcdef1234',
		blockNumber: 18456791,
		gasUsed: 156000,
		registrationDate: '2024-01-17T09:15:00Z',
		lastModified: '2024-01-17T09:15:00Z',
		status: 'disputed',
		ipfsHash: 'QmZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz',
		metadata: {
			category: 'presentation',
			keywords: ['blockchain', 'cryptocurrency', 'distributed ledger'],
			language: 'vi',
			version: '1.5',
			license: 'cc-by-sa',
			originalSource: 'Conference Presentation',
			references: ['https://ethereum.org', 'https://bitcoin.org']
		},
		verificationHistory: [
			{
				id: 'ver-003',
				documentId: 'doc-003',
				verifier: 'Manual Reviewer',
				verificationType: 'manual_review',
				status: 'verified',
				timestamp: '2024-01-17T09:20:00Z',
				details: 'Manual review completed',
				confidence: 90,
				evidence: ['manual_review', 'expert_opinion']
			}
		],
		disputes: [
			{
				id: 'dispute-001',
				documentId: 'doc-003',
				claimant: 'Dr. Phạm Văn Bình',
				reason: 'plagiarism',
				description: 'Content appears to be copied from my previous work',
				status: 'investigating',
				createdAt: '2024-01-18T16:30:00Z',
				evidence: ['original_document.pdf', 'comparison_analysis.pdf'],
				resolver: 'Admin Team'
			}
		]
	},
	{
		id: 'doc-004',
		title: 'Data Structures and Algorithms',
		author: 'Hoàng Thị Mai',
		description: 'Comprehensive study of data structures and algorithms',
		category: 'textbook',
		keywords: ['data structures', 'algorithms', 'computer science', 'programming'],
		references: ['https://example.com/dsa-guide'],
		fileType: 'pdf',
		fileSize: 4.1 * 1024 * 1024, // 4.1MB
		hash: 'd4e5f6789012345678901234567890abcdef1234',
		blockchainHash: '0x4567890abcdef1234567890abcdef12345678901',
		transactionHash: '0xdef1234567890abcdef1234567890abcdef12345',
		blockNumber: 18456792,
		gasUsed: 189000,
		registrationDate: '2024-01-19T11:45:00Z',
		lastModified: '2024-01-19T11:45:00Z',
		status: 'pending',
		ipfsHash: 'QmWwWwWwWwWwWwWwWwWwWwWwWwWwWwWwWwWwWwWwWwWwWw',
		metadata: {
			category: 'textbook',
			keywords: ['data structures', 'algorithms', 'programming', 'computer science'],
			language: 'en',
			version: '3.0',
			license: 'copyright',
			originalSource: 'Educational Institution',
			references: ['https://algs4.cs.princeton.edu/', 'https://www.coursera.org/learn/algorithms-part1'],
			isbn: '978-0-987654-32-1'
		},
		verificationHistory: [],
		disputes: []
	},
	{
		id: 'doc-005',
		title: 'Web Development Best Practices',
		author: 'Vũ Đức Thành',
		description: 'Modern web development techniques and best practices',
		category: 'article',
		keywords: ['web development', 'best practices', 'frontend', 'backend'],
		references: ['https://web.dev', 'https://developer.mozilla.org'],
		fileType: 'md',
		fileSize: 0.8 * 1024 * 1024, // 0.8MB
		hash: 'e5f6789012345678901234567890abcdef12345',
		blockchainHash: '0x567890abcdef1234567890abcdef123456789012',
		transactionHash: '0xef1234567890abcdef1234567890abcdef123456',
		blockNumber: 18456793,
		gasUsed: 75000,
		registrationDate: '2024-01-20T13:20:00Z',
		lastModified: '2024-01-20T13:20:00Z',
		status: 'verified',
		ipfsHash: 'QmVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVvVv',
		metadata: {
			category: 'article',
			keywords: ['web development', 'frontend', 'backend', 'best practices'],
			language: 'en',
			version: '1.2',
			license: 'cc-by-nc',
			originalSource: 'Tech Blog',
			references: ['https://developer.mozilla.org/', 'https://web.dev/']
		},
		verificationHistory: [
			{
				id: 'ver-004',
				documentId: 'doc-005',
				verifier: 'Hash Validator',
				verificationType: 'hash_match',
				status: 'verified',
				timestamp: '2024-01-20T13:25:00Z',
				details: 'File hash matches blockchain record',
				confidence: 100,
				evidence: ['hash_verification', 'blockchain_confirmation']
			}
		],
		disputes: []
	}
]

// Mock Copyright Stats
export const mockCopyrightStats: CopyrightStats = {
	totalDocuments: 1247,
	registeredToday: 23,
	pendingVerification: 15,
	verifiedDocuments: 1189,
	disputedDocuments: 8,
	totalHashSize: 2.5 * 1024 * 1024 * 1024, // 2.5GB
	blockchainTransactions: 1247,
	averageGasUsed: 125000,
	successRate: 95.3
}

// Mock Verification Records
export const mockVerificationRecords: VerificationRecord[] = [
	{
		id: 'ver-001',
		documentId: 'doc-001',
		verifier: 'Blockchain Validator',
		verificationType: 'blockchain_verified',
		status: 'verified',
		timestamp: '2024-01-15T10:35:00Z',
		details: 'Hash verified on Ethereum blockchain',
		confidence: 100,
		evidence: ['blockchain_transaction', 'hash_match']
	},
	{
		id: 'ver-002',
		documentId: 'doc-002',
		verifier: 'AI Validator',
		verificationType: 'ai_check',
		status: 'verified',
		timestamp: '2024-01-16T14:25:00Z',
		details: 'Content originality verified by AI',
		confidence: 95,
		evidence: ['ai_analysis', 'plagiarism_check']
	},
	{
		id: 'ver-003',
		documentId: 'doc-003',
		verifier: 'Manual Reviewer',
		verificationType: 'manual_review',
		status: 'verified',
		timestamp: '2024-01-17T09:20:00Z',
		details: 'Manual review completed',
		confidence: 90,
		evidence: ['manual_review', 'expert_opinion']
	},
	{
		id: 'ver-004',
		documentId: 'doc-005',
		verifier: 'Hash Validator',
		verificationType: 'hash_match',
		status: 'verified',
		timestamp: '2024-01-20T13:25:00Z',
		details: 'File hash matches blockchain record',
		confidence: 100,
		evidence: ['hash_verification', 'blockchain_confirmation']
	}
]

// Mock Dispute Records
export const mockDisputeRecords: DisputeRecord[] = [
	{
		id: 'dispute-001',
		documentId: 'doc-003',
		claimant: 'Dr. Phạm Văn Bình',
		reason: 'plagiarism',
		description: 'Content appears to be copied from my previous work',
		status: 'investigating',
		createdAt: '2024-01-18T16:30:00Z',
		evidence: ['original_document.pdf', 'comparison_analysis.pdf'],
		resolver: 'Admin Team'
	},
	{
		id: 'dispute-002',
		documentId: 'doc-002',
		claimant: 'Nguyễn Thị Hoa',
		reason: 'copyright_infringement',
		description: 'This document contains copyrighted material without permission',
		status: 'open',
		createdAt: '2024-01-19T09:15:00Z',
		evidence: ['copyright_notice.pdf', 'original_work.pdf']
	},
	{
		id: 'dispute-003',
		documentId: 'doc-001',
		claimant: 'Trần Văn Đức',
		reason: 'duplicate',
		description: 'This document is identical to one already registered',
		status: 'resolved',
		createdAt: '2024-01-16T14:20:00Z',
		resolvedAt: '2024-01-17T10:30:00Z',
		evidence: ['duplicate_document.pdf'],
		resolution: 'Dispute dismissed - documents are different versions',
		resolver: 'Copyright Officer'
	}
]

// Mock Author Stats
export const mockAuthorStats: AuthorStats[] = [
	{
		author: 'Dr. Nguyễn Văn An',
		documentCount: 45,
		totalSize: 125.5 * 1024 * 1024, // 125.5MB
		verifiedCount: 42,
		disputedCount: 1,
		lastActivity: '2024-01-20T15:30:00Z'
	},
	{
		author: 'Trần Thị Lan',
		documentCount: 38,
		totalSize: 89.2 * 1024 * 1024, // 89.2MB
		verifiedCount: 36,
		disputedCount: 0,
		lastActivity: '2024-01-19T11:45:00Z'
	},
	{
		author: 'Lê Minh Tuấn',
		documentCount: 32,
		totalSize: 156.8 * 1024 * 1024, // 156.8MB
		verifiedCount: 28,
		disputedCount: 2,
		lastActivity: '2024-01-18T16:30:00Z'
	},
	{
		author: 'Hoàng Thị Mai',
		documentCount: 28,
		totalSize: 98.4 * 1024 * 1024, // 98.4MB
		verifiedCount: 25,
		disputedCount: 1,
		lastActivity: '2024-01-17T09:15:00Z'
	},
	{
		author: 'Vũ Đức Thành',
		documentCount: 22,
		totalSize: 67.3 * 1024 * 1024, // 67.3MB
		verifiedCount: 20,
		disputedCount: 0,
		lastActivity: '2024-01-16T14:20:00Z'
	}
]

// Mock Category Stats
export const mockCategoryStats: CategoryStats[] = [
	{
		category: 'academic',
		count: 456,
		percentage: 36.6,
		averageSize: 2.8 * 1024 * 1024, // 2.8MB
		verifiedCount: 432
	},
	{
		category: 'research',
		count: 312,
		percentage: 25.0,
		averageSize: 3.2 * 1024 * 1024, // 3.2MB
		verifiedCount: 298
	},
	{
		category: 'textbook',
		count: 234,
		percentage: 18.8,
		averageSize: 4.1 * 1024 * 1024, // 4.1MB
		verifiedCount: 221
	},
	{
		category: 'article',
		count: 156,
		percentage: 12.5,
		averageSize: 1.2 * 1024 * 1024, // 1.2MB
		verifiedCount: 148
	},
	{
		category: 'presentation',
		count: 67,
		percentage: 5.4,
		averageSize: 2.5 * 1024 * 1024, // 2.5MB
		verifiedCount: 62
	},
	{
		category: 'thesis',
		count: 22,
		percentage: 1.8,
		averageSize: 5.8 * 1024 * 1024, // 5.8MB
		verifiedCount: 20
	}
]

// Mock Blockchain Status
export const mockBlockchainStatus: BlockchainStatus = {
	isConnected: true,
	lastBlock: 18456793,
	pendingTransactions: 3,
	averageGasPrice: 25.5, // Gwei
	networkCongestion: 'medium',
	estimatedConfirmationTime: 2.5 // minutes
}

// Mock Blockchain Info
export const mockBlockchainInfo: BlockchainInfo = {
	network: 'mainnet',
	contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
	gasPrice: 25.5,
	gasLimit: 200000,
	estimatedCost: 0.0051, // ETH
	transactionFee: 0.0005 // ETH
}

// Mock Copyright Dashboard
export const mockCopyrightDashboard: CopyrightDashboard = {
	stats: mockCopyrightStats,
	recentDocuments: mockDocuments.slice(0, 5),
	recentVerifications: mockVerificationRecords.slice(0, 3),
	recentDisputes: mockDisputeRecords.slice(0, 2),
	topAuthors: mockAuthorStats.slice(0, 5),
	popularCategories: mockCategoryStats,
	blockchainStatus: mockBlockchainStatus
}

// Helper functions for mock data
export const getDocumentById = (id: string): Document | undefined => {
	return mockDocuments.find(doc => doc.id === id)
}

export const getDocumentsByStatus = (status: Document['status']): Document[] => {
	return mockDocuments.filter(doc => doc.status === status)
}

export const getDocumentsByAuthor = (author: string): Document[] => {
	return mockDocuments.filter(doc => doc.author.toLowerCase().includes(author.toLowerCase()))
}

export const getDocumentsByCategory = (category: Document['metadata']['category']): Document[] => {
	return mockDocuments.filter(doc => doc.metadata.category === category)
}

export const getVerificationHistory = (documentId: string): VerificationRecord[] => {
	return mockVerificationRecords.filter(ver => ver.documentId === documentId)
}

export const getDisputesByDocument = (documentId: string): DisputeRecord[] => {
	return mockDisputeRecords.filter(dispute => dispute.documentId === documentId)
}

export const getActiveDisputes = (): DisputeRecord[] => {
	return mockDisputeRecords.filter(dispute => dispute.status === 'open' || dispute.status === 'investigating')
}

export const getPendingVerifications = (): VerificationRecord[] => {
	return mockVerificationRecords.filter(ver => ver.status === 'pending')
}
