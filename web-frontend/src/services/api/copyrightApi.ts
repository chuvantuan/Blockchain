import axios from 'axios';
import { 
  CopyrightApiResponse, 
  DocumentCopyright, 
  DocumentMetadata, 
  CopyrightStats,
  CopyrightSearchFilters,
  CopyrightSearchResult,
  CopyrightAnalytics,
  CopyrightRegistrationResult,
  CopyrightVerificationResult
} from '../../types/copyright';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const copyrightApi = axios.create({
  baseURL: `${API_BASE_URL}/copyright`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
copyrightApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
copyrightApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

/**
 * Copyright API Service
 * Service để tương tác với backend API cho hệ thống bảo vệ bản quyền
 */
class CopyrightApiService {
  /**
   * Đăng ký bản quyền tài liệu
   */
  async registerDocument(
    file: File,
    metadata: DocumentMetadata
  ): Promise<CopyrightApiResponse<CopyrightRegistrationResult>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await copyrightApi.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Đăng ký bản quyền văn bản
   */
  async registerTextDocument(
    content: string,
    metadata: DocumentMetadata
  ): Promise<CopyrightApiResponse<CopyrightRegistrationResult>> {
    const response = await copyrightApi.post('/register-text', {
      content,
      metadata,
    });

    return response.data;
  }

  /**
   * Xác minh tài liệu
   */
  async verifyDocument(
    documentHash: string
  ): Promise<CopyrightApiResponse<CopyrightVerificationResult>> {
    const response = await copyrightApi.post(`/verify/${documentHash}`);

    return response.data;
  }

  /**
   * Lấy thông tin tài liệu
   */
  async getDocument(
    documentHash: string
  ): Promise<CopyrightApiResponse<DocumentCopyright>> {
    const response = await copyrightApi.get(`/document/${documentHash}`);

    return response.data;
  }

  /**
   * Kiểm tra tài liệu có tồn tại không
   */
  async documentExists(
    documentHash: string
  ): Promise<CopyrightApiResponse<{ exists: boolean }>> {
    const response = await copyrightApi.get(`/exists/${documentHash}`);

    return response.data;
  }

  /**
   * Lấy danh sách tài liệu của user
   */
  async getUserDocuments(
    address: string,
    page: number = 1,
    limit: number = 20
  ): Promise<CopyrightApiResponse<CopyrightSearchResult>> {
    const response = await copyrightApi.get(`/user/${address}`, {
      params: { page, limit },
    });

    return response.data;
  }

  /**
   * Lấy danh sách tài liệu theo category
   */
  async getCategoryDocuments(
    category: string,
    page: number = 1,
    limit: number = 20
  ): Promise<CopyrightApiResponse<CopyrightSearchResult>> {
    const response = await copyrightApi.get(`/category/${category}`, {
      params: { page, limit },
    });

    return response.data;
  }

  /**
   * Tìm kiếm tài liệu
   */
  async searchDocuments(
    filters: CopyrightSearchFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<CopyrightApiResponse<CopyrightSearchResult>> {
    const response = await copyrightApi.post('/search', {
      filters,
      page,
      limit,
    });

    return response.data;
  }

  /**
   * Lấy thống kê hệ thống
   */
  async getStatistics(): Promise<CopyrightApiResponse<CopyrightStats>> {
    const response = await copyrightApi.get('/statistics');

    return response.data;
  }

  /**
   * Lấy phân tích chi tiết
   */
  async getAnalytics(
    dateFrom?: number,
    dateTo?: number
  ): Promise<CopyrightApiResponse<CopyrightAnalytics>> {
    const response = await copyrightApi.get('/analytics', {
      params: { dateFrom, dateTo },
    });

    return response.data;
  }

  /**
   * Cập nhật thông tin tài liệu
   */
  async updateDocument(
    documentHash: string,
    field: 'title' | 'description',
    value: string
  ): Promise<CopyrightApiResponse<{ success: boolean }>> {
    const response = await copyrightApi.put(`/document/${documentHash}`, {
      field,
      value,
    });

    return response.data;
  }

  /**
   * Cập nhật tags tài liệu
   */
  async updateDocumentTags(
    documentHash: string,
    tags: string[]
  ): Promise<CopyrightApiResponse<{ success: boolean }>> {
    const response = await copyrightApi.put(`/document/${documentHash}/tags`, {
      tags,
    });

    return response.data;
  }

  /**
   * Vô hiệu hóa tài liệu
   */
  async deactivateDocument(
    documentHash: string
  ): Promise<CopyrightApiResponse<{ success: boolean }>> {
    const response = await copyrightApi.delete(`/document/${documentHash}`);

    return response.data;
  }

  /**
   * Upload file lên IPFS
   */
  async uploadToIPFS(file: File): Promise<CopyrightApiResponse<{ ipfsHash: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await copyrightApi.post('/ipfs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Lấy file từ IPFS
   */
  async getFromIPFS(ipfsHash: string): Promise<Blob> {
    const response = await copyrightApi.get(`/ipfs/${ipfsHash}`, {
      responseType: 'blob',
    });

    return response.data;
  }

  /**
   * Tính toán hash file
   */
  async calculateFileHash(file: File): Promise<CopyrightApiResponse<{ hash: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await copyrightApi.post('/hash/calculate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Tính toán hash văn bản
   */
  async calculateTextHash(content: string): Promise<CopyrightApiResponse<{ hash: string }>> {
    const response = await copyrightApi.post('/hash/text', {
      content,
    });

    return response.data;
  }

  /**
   * Lấy lịch sử giao dịch
   */
  async getTransactionHistory(
    address: string,
    page: number = 1,
    limit: number = 20
  ): Promise<CopyrightApiResponse<{
    transactions: Array<{
      hash: string;
      type: 'register' | 'verify' | 'update';
      documentHash: string;
      timestamp: number;
      status: 'pending' | 'confirmed' | 'failed';
    }>;
    total: number;
  }>> {
    const response = await copyrightApi.get(`/transactions/${address}`, {
      params: { page, limit },
    });

    return response.data;
  }

  /**
   * Lấy thông tin phí giao dịch
   */
  async getTransactionFees(): Promise<CopyrightApiResponse<{
    registrationFee: string;
    verificationFee: string;
    gasPrice: string;
  }>> {
    const response = await copyrightApi.get('/fees');

    return response.data;
  }

  /**
   * Lấy trạng thái giao dịch blockchain
   */
  async getTransactionStatus(
    transactionHash: string
  ): Promise<CopyrightApiResponse<{
    status: 'pending' | 'confirmed' | 'failed';
    blockNumber?: number;
    gasUsed?: string;
  }>> {
    const response = await copyrightApi.get(`/transaction/${transactionHash}/status`);

    return response.data;
  }

  /**
   * Lấy thông tin hợp đồng
   */
  async getContractInfo(): Promise<CopyrightApiResponse<{
    address: string;
    abi: any;
    network: string;
    version: string;
  }>> {
    const response = await copyrightApi.get('/contract/info');

    return response.data;
  }

  /**
   * Lấy sự kiện từ blockchain
   */
  async getContractEvents(
    eventType: 'DocumentRegistered' | 'DocumentVerified',
    fromBlock?: number,
    toBlock?: number
  ): Promise<CopyrightApiResponse<Array<{
    transactionHash: string;
    blockNumber: number;
    eventType: string;
    data: any;
    timestamp: number;
  }>>> {
    const response = await copyrightApi.get('/contract/events', {
      params: { eventType, fromBlock, toBlock },
    });

    return response.data;
  }

  /**
   * Xuất dữ liệu
   */
  async exportData(
    format: 'json' | 'csv',
    filters?: CopyrightSearchFilters
  ): Promise<Blob> {
    const response = await copyrightApi.post('/export', {
      format,
      filters,
    }, {
      responseType: 'blob',
    });

    return response.data;
  }

  /**
   * Nhập dữ liệu
   */
  async importData(
    file: File,
    options: {
      validateHashes: boolean;
      skipExisting: boolean;
    }
  ): Promise<CopyrightApiResponse<{
    imported: number;
    skipped: number;
    errors: string[];
  }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));

    const response = await copyrightApi.post('/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Lấy báo cáo
   */
  async getReport(
    type: 'daily' | 'weekly' | 'monthly' | 'yearly',
    date?: string
  ): Promise<CopyrightApiResponse<{
    period: string;
    stats: CopyrightStats;
    analytics: CopyrightAnalytics;
  }>> {
    const response = await copyrightApi.get('/reports', {
      params: { type, date },
    });

    return response.data;
  }

  /**
   * Gửi thông báo
   */
  async sendNotification(
    type: 'email' | 'push',
    recipients: string[],
    message: string
  ): Promise<CopyrightApiResponse<{ sent: number; failed: number }>> {
    const response = await copyrightApi.post('/notifications', {
      type,
      recipients,
      message,
    });

    return response.data;
  }
}

// Export singleton instance
export const copyrightApiService = new CopyrightApiService();
export default copyrightApiService;
