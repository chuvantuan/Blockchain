/**
 * Copyright Protection System Types
 * Hệ thống bảo vệ bản quyền tài liệu học thuật
 */

// Document categories
export type DocumentCategory = 
  | 'thesis'           // Luận văn, luận án
  | 'research'         // Nghiên cứu khoa học
  | 'paper'            // Bài báo khoa học
  | 'report'           // Báo cáo
  | 'presentation'     // Bài thuyết trình
  | 'coursework'       // Bài tập lớn
  | 'assignment'       // Bài tập
  | 'other';           // Khác

// Document status
export type DocumentStatus = 'active' | 'verified' | 'deactivated';

// Copyright registration result
export interface CopyrightRegistrationResult {
  success: boolean;
  transactionHash?: string;
  documentHash?: string;
  error?: string;
  timestamp?: number;
}

// Copyright verification result
export interface CopyrightVerificationResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  timestamp?: number;
}

// Document metadata for registration
export interface DocumentMetadata {
  title: string;
  description: string;
  category: DocumentCategory;
  fileExtension: string;
  fileSize: number;
  tags: string[];
  ipfsHash?: string;
  authorName?: string;
  institution?: string;
  keywords?: string[];
  abstract?: string;
}

// Document copyright information from blockchain
export interface DocumentCopyright {
  documentHash: string;
  owner: string;
  title: string;
  description: string;
  category: string;
  fileExtension: string;
  fileSize: number;
  timestamp: number;
  isVerified: boolean;
  isActive: boolean;
  ipfsHash: string;
  tags: string[];
}

// Copyright statistics
export interface CopyrightStats {
  totalDocuments: number;
  totalVerified: number;
  totalOwners: number;
  contractBalance: string;
  registrationFee?: string;
  verificationFee?: string;
  recentRegistrations?: number;
  verificationRate?: string | number;
}

// User copyright profile
export interface UserCopyrightProfile {
  address: string;
  totalDocuments: number;
  verifiedDocuments: number;
  totalCategories: number;
  documents: DocumentCopyright[];
  categories: Record<DocumentCategory, number>;
  recentActivity: CopyrightActivity[];
}

// Copyright activity log
export interface CopyrightActivity {
  id: string;
  type: 'registration' | 'verification' | 'update' | 'deactivation';
  documentHash: string;
  documentTitle: string;
  timestamp: number;
  transactionHash?: string;
  details?: string;
}

// Copyright search filters
export interface CopyrightSearchFilters {
  category?: DocumentCategory;
  isVerified?: boolean;
  dateFrom?: number;
  dateTo?: number;
  tags?: string[];
  owner?: string;
}

// Copyright search result
export interface CopyrightSearchResult {
  documents: DocumentCopyright[];
  totalCount: number;
  hasMore: boolean;
  nextPage?: number;
}

// File upload progress
export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'calculating_hash' | 'registering' | 'completed' | 'error';
  error?: string;
  documentHash?: string;
  transactionHash?: string;
}

// Copyright dashboard data
export interface CopyrightDashboard {
  stats: CopyrightStats;
  recentDocuments: DocumentCopyright[];
  userDocuments: DocumentCopyright[];
  categories: Record<DocumentCategory, number>;
  recentActivity: CopyrightActivity[];
  pendingVerifications: DocumentCopyright[];
}

// Copyright settings
export interface CopyrightSettings {
  autoVerification: boolean;
  emailNotifications: boolean;
  ipfsIntegration: boolean;
  backupToIPFS: boolean;
  defaultCategory: DocumentCategory;
  defaultTags: string[];
}

// Copyright validation rules
export interface CopyrightValidation {
  maxFileSize: number; // bytes
  allowedExtensions: string[];
  requiredFields: string[];
  maxTitleLength: number;
  maxDescriptionLength: number;
  maxTagsCount: number;
  maxTagLength: number;
}

// Similarity check document
export interface SimilarDocument {
  id: number | string;
  filename: string;
  similarityScore: number;
  similarityPercentage?: string;
  owner?: string;
  ownerUsername?: string;
  ownerEmail?: string;
  ownerAddress?: string;
  createdAt?: string | null;
  matchedSections?: string[];
  matchedSectionsCount?: number;
  details?: {
    plagiarismRisk?: string;
    [key: string]: any;
  };
}

// Similarity information
export interface SimilarityInfo {
  isSimilar: boolean;
  similarityScore: number;
  plagiarismLevel?: string;
  plagiarismDescription?: string;
  similarDocuments: SimilarDocument[];
  threshold?: number;
  warnThreshold?: number;
  totalDocumentsChecked?: number;
  totalSimilarFound?: number;
  message: string;
}

// Copyright API response
export interface CopyrightApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
  // Similarity check specific fields
  similarityInfo?: SimilarityInfo;
  isSimilar?: boolean;
  filePath?: string;
}

// Copyright batch operations
export interface CopyrightBatchOperation {
  type: 'register' | 'verify' | 'update' | 'deactivate';
  documentHashes: string[];
  metadata?: Partial<DocumentMetadata>;
}

// Copyright export options
export interface CopyrightExportOptions {
  format: 'json' | 'csv' | 'pdf';
  includeDetails: boolean;
  includeTransactions: boolean;
  dateRange?: {
    from: number;
    to: number;
  };
  categories?: DocumentCategory[];
}

// Copyright import options
export interface CopyrightImportOptions {
  format: 'json' | 'csv';
  validateHashes: boolean;
  skipExisting: boolean;
  defaultCategory?: DocumentCategory;
}

// Copyright analytics
export interface CopyrightAnalytics {
  totalRegistrations: number;
  totalVerifications: number;
  categoryDistribution: Record<DocumentCategory, number>;
  monthlyTrends: {
    month: string;
    registrations: number;
    verifications: number;
  }[];
  topTags: {
    tag: string;
    count: number;
  }[];
  userStats: {
    totalUsers: number;
    activeUsers: number;
    topContributors: {
      address: string;
      documentCount: number;
    }[];
  };
}

// Copyright error types
export type CopyrightError = 
  | 'WALLET_NOT_CONNECTED'
  | 'INSUFFICIENT_FUNDS'
  | 'DOCUMENT_ALREADY_EXISTS'
  | 'DOCUMENT_NOT_FOUND'
  | 'INVALID_HASH'
  | 'INVALID_FILE_TYPE'
  | 'FILE_TOO_LARGE'
  | 'NETWORK_ERROR'
  | 'TRANSACTION_FAILED'
  | 'CONTRACT_ERROR'
  | 'UNAUTHORIZED'
  | 'RATE_LIMITED';

// Copyright error details
export interface CopyrightErrorDetails {
  type: CopyrightError;
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: number;
}

// Copyright constants
export const COPYRIGHT_CONSTANTS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf'],
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_TAGS_COUNT: 10,
  MAX_TAG_LENGTH: 50,
  SUPPORTED_CATEGORIES: [
    'thesis',
    'research', 
    'paper',
    'report',
    'presentation',
    'coursework',
    'assignment',
    'other'
  ] as DocumentCategory[]
} as const;

// Copyright utility types
export type CopyrightFileType = typeof COPYRIGHT_CONSTANTS.ALLOWED_EXTENSIONS[number];
export type CopyrightCategoryLabel = Record<DocumentCategory, string>;

export const COPYRIGHT_CATEGORY_LABELS: CopyrightCategoryLabel = {
  thesis: 'Luận văn/Luận án',
  research: 'Nghiên cứu khoa học',
  paper: 'Bài báo khoa học',
  report: 'Báo cáo',
  presentation: 'Bài thuyết trình',
  coursework: 'Bài tập lớn',
  assignment: 'Bài tập',
  other: 'Khác'
} as const;
