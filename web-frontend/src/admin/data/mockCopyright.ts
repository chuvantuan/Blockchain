import { AdminDocument, AdminStats, AdminDashboard, AdminDispute, AdminVerification } from '../hooks/useCopyright';

export const mockAdminDocuments: AdminDocument[] = [
  {
    id: '1',
    documentHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    owner: '0x742d35Cc6635C0532925a3b8D7A4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3',
    title: 'Nghiên cứu về Blockchain trong Giáo dục',
    description: 'Luận văn nghiên cứu về ứng dụng công nghệ blockchain trong lĩnh vực giáo dục và đào tạo trực tuyến.',
    category: 'research',
    fileExtension: '.pdf',
    fileSize: 2048576,
    timestamp: 1704067200,
    isVerified: true,
    isActive: true,
    ipfsHash: 'QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx',
    tags: ['blockchain', 'education', 'research', 'technology'],
    author: 'Nguyễn Văn A',
    institution: 'Đại học Bách khoa Hà Nội',
    status: 'verified',
    registrationDate: '2024-01-01',
    verificationDate: '2024-01-02',
    verificationHistory: [
      {
        id: '1',
        documentId: '1',
        verifierAddress: '0xAdmin123...',
        status: 'approved',
        comments: 'Tài liệu đạt chất lượng tốt',
        timestamp: '2024-01-02T10:00:00Z'
      }
    ]
  },
  {
    id: '2',
    documentHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    owner: '0x8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3',
    title: 'Phương pháp học máy cho nhận dạng chữ viết tay',
    description: 'Báo cáo khoa học về ứng dụng machine learning trong việc nhận dạng chữ viết tay tiếng Việt.',
    category: 'paper',
    fileExtension: '.docx',
    fileSize: 1536000,
    timestamp: 1704153600,
    isVerified: false,
    isActive: true,
    ipfsHash: 'QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy',
    tags: ['machine-learning', 'ocr', 'vietnamese', 'handwriting'],
    author: 'Trần Thị B',
    institution: 'Đại học Công nghệ Thông tin',
    status: 'pending',
    registrationDate: '2024-01-02',
    verificationHistory: []
  },
  {
    id: '3',
    documentHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    owner: '0x742d35Cc6635C0532925a3b8D7A4b8c3C4b8c3C4b8c3C4b8c3C4b8c3C4b8c3',
    title: 'Luận văn tốt nghiệp: Hệ thống quản lý sinh viên',
    description: 'Luận văn tốt nghiệp về xây dựng hệ thống quản lý sinh viên sử dụng công nghệ web hiện đại.',
    category: 'thesis',
    fileExtension: '.pdf',
    fileSize: 3072000,
    timestamp: 1704240000,
    isVerified: true,
    isActive: true,
    ipfsHash: 'QmZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz',
    tags: ['web-development', 'student-management', 'graduation', 'thesis'],
    author: 'Lê Văn C',
    institution: 'Đại học Khoa học Tự nhiên',
    status: 'verified',
    registrationDate: '2024-01-03',
    verificationDate: '2024-01-04',
    verificationHistory: [
      {
        id: '2',
        documentId: '3',
        verifierAddress: '0xAdmin456...',
        status: 'approved',
        comments: 'Nghiên cứu có tính ứng dụng cao',
        timestamp: '2024-01-04T14:30:00Z'
      }
    ]
  },
  {
    id: '4',
    documentHash: '0x5555555555555555555555555555555555555555555555555555555555555555',
    owner: '0x9d4E5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    title: 'Báo cáo thực tập: Ứng dụng IoT trong nông nghiệp',
    description: 'Báo cáo thực tập về việc ứng dụng Internet of Things trong nông nghiệp thông minh.',
    category: 'report',
    fileExtension: '.pdf',
    fileSize: 1843200,
    timestamp: 1704326400,
    isVerified: false,
    isActive: true,
    ipfsHash: 'QmAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAa',
    tags: ['iot', 'agriculture', 'smart-farming', 'internship'],
    author: 'Phạm Thị D',
    institution: 'Đại học Nông Lâm',
    status: 'disputed',
    registrationDate: '2024-01-04',
    disputes: [
      {
        id: '1',
        documentId: '4',
        disputerAddress: '0xDisputer123...',
        reason: 'Nội dung tương tự với nghiên cứu đã công bố',
        evidence: ['evidence1.pdf', 'similar_paper.pdf'],
        status: 'open',
        createdAt: '2024-01-05T09:00:00Z'
      }
    ],
    verificationHistory: []
  },
  {
    id: '5',
    documentHash: '0x6666666666666666666666666666666666666666666666666666666666666666',
    owner: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
    title: 'Bài tập lớn: Phân tích dữ liệu y tế',
    description: 'Bài tập lớn về phân tích dữ liệu y tế sử dụng các thuật toán machine learning.',
    category: 'coursework',
    fileExtension: '.ipynb',
    fileSize: 1024000,
    timestamp: 1704412800,
    isVerified: true,
    isActive: true,
    ipfsHash: 'QmBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBbBb',
    tags: ['data-analysis', 'healthcare', 'machine-learning', 'jupyter'],
    author: 'Hoàng Văn E',
    institution: 'Đại học Y Hà Nội',
    status: 'verified',
    registrationDate: '2024-01-05',
    verificationDate: '2024-01-06',
    verificationHistory: [
      {
        id: '3',
        documentId: '5',
        verifierAddress: '0xAdmin789...',
        status: 'approved',
        comments: 'Phân tích chi tiết và chính xác',
        timestamp: '2024-01-06T11:15:00Z'
      }
    ]
  }
];

export const mockAdminStats: AdminStats = {
  totalDocuments: 156,
  totalVerified: 98,
  totalOwners: 67,
  contractBalance: '15.2345',
  registrationFee: '0.001',
  verificationFee: '0.002',
  blockchainTransactions: 1247,
  disputedDocuments: 3,
  rejectedDocuments: 1,
  pendingVerifications: 5,
  averageVerificationTime: 2.3
};

export const mockAdminDashboard: AdminDashboard = {
  recentDocuments: mockAdminDocuments.slice(0, 3),
  pendingVerifications: mockAdminDocuments.filter(doc => doc.status === 'pending'),
  disputedDocuments: mockAdminDocuments.filter(doc => doc.status === 'disputed'),
  blockchainStatus: {
    isConnected: true,
    lastBlock: 18765432,
    averageGasPrice: '25.5',
    networkCongestion: 'Low',
    estimatedConfirmationTime: '2-3'
  }
};

export const mockDisputes: AdminDispute[] = [
  {
    id: '1',
    documentId: '4',
    disputerAddress: '0xDisputer123456789abcdef123456789abcdef123456',
    reason: 'Nội dung tương tự với nghiên cứu đã công bố trước đó',
    evidence: [
      'https://example.com/similar_paper.pdf',
      'https://example.com/evidence_document.pdf'
    ],
    status: 'open',
    createdAt: '2024-01-05T09:00:00Z'
  },
  {
    id: '2',
    documentId: '6',
    disputerAddress: '0xAnotherDisputer987654321fedcba987654321fedcba',
    reason: 'Tác giả không có quyền sở hữu trí tuệ đối với nội dung này',
    evidence: [
      'https://example.com/copyright_proof.pdf'
    ],
    status: 'resolved',
    createdAt: '2024-01-03T14:30:00Z',
    resolvedAt: '2024-01-04T16:45:00Z',
    resolution: 'Đã xác minh và xác nhận quyền sở hữu hợp pháp'
  }
];

export const mockVerifications: AdminVerification[] = [
  {
    id: '1',
    documentId: '1',
    verifierAddress: '0xAdmin123456789abcdef123456789abcdef123456',
    status: 'approved',
    comments: 'Tài liệu đạt chất lượng tốt, nội dung độc đáo và có giá trị khoa học cao.',
    timestamp: '2024-01-02T10:00:00Z'
  },
  {
    id: '2',
    documentId: '3',
    verifierAddress: '0xAdmin456789abcdef123456789abcdef123456789',
    status: 'approved',
    comments: 'Nghiên cứu có tính ứng dụng cao trong thực tế.',
    timestamp: '2024-01-04T14:30:00Z'
  },
  {
    id: '3',
    documentId: '5',
    verifierAddress: '0xAdmin789abcdef123456789abcdef123456789abc',
    status: 'approved',
    comments: 'Phân tích chi tiết và chính xác, phương pháp nghiên cứu khoa học.',
    timestamp: '2024-01-06T11:15:00Z'
  }
];
