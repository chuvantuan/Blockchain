import { 
  DocumentCopyright, 
  CopyrightStats, 
  CopyrightAnalytics,
  DocumentCategory,
  CopyrightActivity,
  CopyrightSearchResult
} from '../types/copyright';

// Mock document data
export const mockDocuments: DocumentCopyright[] = [
  {
    documentHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    owner: '0x742d35Cc6635C0532925a3b8D7A4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3',
    title: 'Nghiên cứu về Blockchain trong Giáo dục',
    description: 'Luận văn nghiên cứu về ứng dụng công nghệ blockchain trong lĩnh vực giáo dục và đào tạo trực tuyến.',
    category: 'research',
    fileExtension: '.pdf',
    fileSize: 2048576, // 2MB
    timestamp: 1704067200, // 2024-01-01
    isVerified: true,
    isActive: true,
    ipfsHash: 'QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx',
    tags: ['blockchain', 'education', 'research', 'technology']
  },
  {
    documentHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    owner: '0x8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3',
    title: 'Phương pháp học máy cho nhận dạng chữ viết tay',
    description: 'Báo cáo khoa học về ứng dụng machine learning trong việc nhận dạng chữ viết tay tiếng Việt.',
    category: 'paper',
    fileExtension: '.docx',
    fileSize: 1536000, // 1.5MB
    timestamp: 1704153600, // 2024-01-02
    isVerified: false,
    isActive: true,
    ipfsHash: 'QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy',
    tags: ['machine-learning', 'ocr', 'vietnamese', 'handwriting']
  },
  {
    documentHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    owner: '0x742d35Cc6635C0532925a3b8D7A4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3',
    title: 'Luận văn tốt nghiệp: Hệ thống quản lý sinh viên',
    description: 'Luận văn tốt nghiệp về xây dựng hệ thống quản lý sinh viên sử dụng công nghệ web hiện đại.',
    category: 'thesis',
    fileExtension: '.pdf',
    fileSize: 3072000, // 3MB
    timestamp: 1704240000, // 2024-01-03
    isVerified: true,
    isActive: true,
    ipfsHash: 'QmZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz',
    tags: ['web-development', 'student-management', 'graduation', 'thesis']
  },
  {
    documentHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    owner: '0x9d5A8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b',
    title: 'Báo cáo thực tập: Phát triển ứng dụng mobile',
    description: 'Báo cáo thực tập về quá trình phát triển ứng dụng mobile sử dụng React Native.',
    category: 'report',
    fileExtension: '.pdf',
    fileSize: 1024000, // 1MB
    timestamp: 1704326400, // 2024-01-04
    isVerified: false,
    isActive: true,
    ipfsHash: 'QmAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAa',
    tags: ['mobile-development', 'react-native', 'internship', 'report']
  },
  {
    documentHash: '0x1111111111111111111111111111111111111111111111111111111111111111',
    owner: '0x742d35Cc6635C0532925a3b8D7A4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3',
    title: 'Slide thuyết trình: Giới thiệu về AI',
    description: 'Slide thuyết trình về trí tuệ nhân tạo và ứng dụng trong cuộc sống hiện đại.',
    category: 'presentation',
    fileExtension: '.pptx',
    fileSize: 5120000, // 5MB
    timestamp: 1704412800, // 2024-01-05
    isVerified: true,
    isActive: true,
    ipfsHash: 'QmBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBb',
    tags: ['ai', 'presentation', 'slides', 'artificial-intelligence']
  }
];

// Mock statistics
export const mockStats: CopyrightStats = {
  totalDocuments: 1247,
  totalVerified: 892,
  totalOwners: 156,
  contractBalance: '12.45',
  registrationFee: '0.001',
  verificationFee: '0.002'
};

// Mock analytics
export const mockAnalytics: CopyrightAnalytics = {
  totalRegistrations: 1247,
  totalVerifications: 892,
  categoryDistribution: {
    thesis: 234,
    research: 456,
    paper: 234,
    report: 123,
    presentation: 89,
    coursework: 67,
    assignment: 34,
    other: 10
  },
  monthlyTrends: [
    { month: '2024-01', registrations: 45, verifications: 32 },
    { month: '2024-02', registrations: 52, verifications: 38 },
    { month: '2024-03', registrations: 61, verifications: 44 },
    { month: '2024-04', registrations: 58, verifications: 41 },
    { month: '2024-05', registrations: 67, verifications: 48 },
    { month: '2024-06', registrations: 73, verifications: 52 },
    { month: '2024-07', registrations: 69, verifications: 49 },
    { month: '2024-08', registrations: 76, verifications: 54 },
    { month: '2024-09', registrations: 82, verifications: 58 },
    { month: '2024-10', registrations: 89, verifications: 63 },
    { month: '2024-11', registrations: 95, verifications: 67 },
    { month: '2024-12', registrations: 102, verifications: 72 }
  ],
  topTags: [
    { tag: 'research', count: 456 },
    { tag: 'blockchain', count: 234 },
    { tag: 'ai', count: 189 },
    { tag: 'education', count: 167 },
    { tag: 'technology', count: 145 },
    { tag: 'machine-learning', count: 123 },
    { tag: 'web-development', count: 98 },
    { tag: 'mobile-development', count: 87 },
    { tag: 'data-science', count: 76 },
    { tag: 'cybersecurity', count: 65 }
  ],
  userStats: {
    totalUsers: 156,
    activeUsers: 89,
    topContributors: [
      { address: '0x742d35Cc6635C0532925a3b8D7A4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3', documentCount: 23 },
      { address: '0x8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3', documentCount: 18 },
      { address: '0x9d5A8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b', documentCount: 15 },
      { address: '0xAbCdEf1234567890AbCdEf1234567890AbCdEf1234567890AbCdEf1234567890', documentCount: 12 },
      { address: '0x1234567890AbCdEf1234567890AbCdEf1234567890AbCdEf1234567890AbCdEf', documentCount: 10 }
    ]
  }
};

// Mock activity data
export const mockActivity: CopyrightActivity[] = [
  {
    id: '1',
    type: 'registration',
    documentHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    documentTitle: 'Nghiên cứu về Blockchain trong Giáo dục',
    timestamp: 1704067200,
    transactionHash: '0xtx1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    details: 'Đăng ký bản quyền thành công'
  },
  {
    id: '2',
    type: 'verification',
    documentHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    documentTitle: 'Nghiên cứu về Blockchain trong Giáo dục',
    timestamp: 1704153600,
    transactionHash: '0xtxabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    details: 'Tài liệu đã được xác minh'
  },
  {
    id: '3',
    type: 'registration',
    documentHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    documentTitle: 'Phương pháp học máy cho nhận dạng chữ viết tay',
    timestamp: 1704153600,
    transactionHash: '0xtx9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    details: 'Đăng ký bản quyền thành công'
  },
  {
    id: '4',
    type: 'update',
    documentHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    documentTitle: 'Nghiên cứu về Blockchain trong Giáo dục',
    timestamp: 1704240000,
    details: 'Cập nhật thông tin tài liệu'
  },
  {
    id: '5',
    type: 'registration',
    documentHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    documentTitle: 'Luận văn tốt nghiệp: Hệ thống quản lý sinh viên',
    timestamp: 1704240000,
    transactionHash: '0xtxfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    details: 'Đăng ký bản quyền thành công'
  }
];

// Mock search results
export const mockSearchResult: CopyrightSearchResult = {
  documents: mockDocuments,
  totalCount: mockDocuments.length,
  hasMore: false,
  nextPage: undefined
};

// Mock categories with Vietnamese labels
export const mockCategories = [
  { value: 'thesis', label: 'Luận văn/Luận án', count: 234 },
  { value: 'research', label: 'Nghiên cứu khoa học', count: 456 },
  { value: 'paper', label: 'Bài báo khoa học', count: 234 },
  { value: 'report', label: 'Báo cáo', count: 123 },
  { value: 'presentation', label: 'Bài thuyết trình', count: 89 },
  { value: 'coursework', label: 'Bài tập lớn', count: 67 },
  { value: 'assignment', label: 'Bài tập', count: 34 },
  { value: 'other', label: 'Khác', count: 10 }
];

// Mock users
export const mockUsers = [
  {
    address: '0x742d35Cc6635C0532925a3b8D7A4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    documentCount: 23,
    verifiedCount: 18,
    joinDate: 1704067200
  },
  {
    address: '0x8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    documentCount: 18,
    verifiedCount: 15,
    joinDate: 1704153600
  },
  {
    address: '0x9d5A8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b',
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    documentCount: 15,
    verifiedCount: 12,
    joinDate: 1704240000
  }
];

// Mock transaction history
export const mockTransactionHistory = [
  {
    hash: '0xtx1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    type: 'register' as const,
    documentHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    timestamp: 1704067200,
    status: 'confirmed' as const,
    gasUsed: '150000',
    blockNumber: 12345678
  },
  {
    hash: '0xtxabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    type: 'verify' as const,
    documentHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    timestamp: 1704153600,
    status: 'confirmed' as const,
    gasUsed: '120000',
    blockNumber: 12345679
  },
  {
    hash: '0xtx9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    type: 'register' as const,
    documentHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    timestamp: 1704153600,
    status: 'pending' as const,
    gasUsed: '0',
    blockNumber: undefined
  }
];

// Mock contract events
export const mockContractEvents = [
  {
    transactionHash: '0xtx1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    blockNumber: 12345678,
    eventType: 'DocumentRegistered',
    data: {
      documentHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      owner: '0x742d35Cc6635C0532925a3b8D7A4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3',
      title: 'Nghiên cứu về Blockchain trong Giáo dục',
      timestamp: 1704067200
    },
    timestamp: 1704067200
  },
  {
    transactionHash: '0xtxabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockNumber: 12345679,
    eventType: 'DocumentVerified',
    data: {
      documentHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      verifier: '0x742d35Cc6635C0532925a3b8D7A4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3',
      timestamp: 1704153600
    },
    timestamp: 1704153600
  }
];

// Helper functions
export const getDocumentByHash = (hash: string): DocumentCopyright | undefined => {
  return mockDocuments.find(doc => doc.documentHash === hash);
};

export const getDocumentsByOwner = (owner: string): DocumentCopyright[] => {
  return mockDocuments.filter(doc => doc.owner === owner);
};

export const getDocumentsByCategory = (category: DocumentCategory): DocumentCopyright[] => {
  return mockDocuments.filter(doc => doc.category === category);
};

export const searchDocuments = (query: string): DocumentCopyright[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockDocuments.filter(doc => 
    doc.title.toLowerCase().includes(lowercaseQuery) ||
    doc.description.toLowerCase().includes(lowercaseQuery) ||
    doc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getRecentDocuments = (limit: number = 5): DocumentCopyright[] => {
  return mockDocuments
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

export const getVerifiedDocuments = (): DocumentCopyright[] => {
  return mockDocuments.filter(doc => doc.isVerified);
};

export const getPendingDocuments = (): DocumentCopyright[] => {
  return mockDocuments.filter(doc => !doc.isVerified);
};

export default {
  mockDocuments,
  mockStats,
  mockAnalytics,
  mockActivity,
  mockSearchResult,
  mockCategories,
  mockUsers,
  mockTransactionHistory,
  mockContractEvents,
  getDocumentByHash,
  getDocumentsByOwner,
  getDocumentsByCategory,
  searchDocuments,
  getRecentDocuments,
  getVerifiedDocuments,
  getPendingDocuments
};
