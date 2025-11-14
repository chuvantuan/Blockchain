import axios from 'axios';
import {
  CopyrightApiResponse,
  DocumentCopyright,
  DocumentMetadata,
  CopyrightStats,
  DocumentCategory,
  CopyrightActivity,
  CopyrightSearchResult,
  CopyrightAnalytics,
  CopyrightSettings,
  CopyrightBatchOperation,
  CopyrightExportOptions,
  CopyrightImportOptions,
  UserCopyrightProfile,
  CopyrightRegistrationResult,
  CopyrightVerificationResult,
  UploadProgress
} from '../../types/copyright';

import { API_BASE } from '../../config/api';

// API Gateway endpoint for copyright service
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || API_BASE)
  ? `${import.meta.env.VITE_API_BASE_URL || API_BASE}/api/copyrights`
  : 'http://localhost:8080/api/copyrights';

const copyrightApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
copyrightApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
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
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class CopyrightService {
  // ====================
  // Copyright Operations
  // ====================

  /**
   * Register a new copyright with file upload
   */
  async registerDocument(formData: FormData): Promise<CopyrightApiResponse<any>> {
    const response = await copyrightApi.post('/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data;
  }
  
  /**
   * Get blockchain status
   */
  async getBlockchainStatus(): Promise<CopyrightApiResponse<any>> {
    const response = await copyrightApi.get('/blockchain/status');
    return response.data;
  }

  /**
   * Get all copyrights
   */
  async getAllCopyrights(): Promise<CopyrightApiResponse<any[]>> {
    const response = await copyrightApi.get('/');
    return response.data;
  }
  
  /**
   * Get copyright by ID
   */
  async getCopyrightById(id: string): Promise<CopyrightApiResponse<any>> {
    const response = await copyrightApi.get(`/${id}`);
    return response.data;
  }
  
  /**
   * Update copyright filename
   */
  async updateCopyright(id: string, updates: Partial<DocumentMetadata>): Promise<CopyrightApiResponse<any>> {
    const response = await copyrightApi.put(`/${id}`, updates);
    return response.data;
  }
  
  /**
   * Delete copyright
   */
  async deleteCopyright(id: string): Promise<CopyrightApiResponse<void>> {
    const response = await copyrightApi.delete(`/${id}`);
    return response.data;
  }
  
  /**
   * Check document similarity
   */
  async checkSimilarity(formData: FormData): Promise<CopyrightApiResponse<any>> {
    const response = await copyrightApi.post('/check-similarity', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data;
  }

  /**
   * Search for documents
   */
  async searchDocuments(query: string): Promise<CopyrightApiResponse<any>> {
    const response = await copyrightApi.get('/search', { params: { filename: query } });
    return response.data;
  }
  
  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string }> {
    const response = await copyrightApi.get('/health');
    return response.data;
  }

  /**
   * Get statistics
   */
  async getStatistics(): Promise<CopyrightApiResponse<any>> {
    const response = await copyrightApi.get('/stats');
    console.log('getStatistics - Full axios response:', response);
    console.log('getStatistics - response.data:', response.data);
    console.log('getStatistics - response.data type:', typeof response.data);
    console.log('getStatistics - response.data keys:', response.data ? Object.keys(response.data) : 'null');
    
    // Backend returns: { success: true, data: {...} }
    // Axios wraps it: axios response = { data: { success: true, data: {...} } }
    // So response.data = { success: true, data: {...} }
    // We return response.data, which will be { success: true, data: {...} }
    return response.data;
  }

  /**
   * Get analytics data
   */
  async getAnalytics(): Promise<CopyrightApiResponse<any>> {
    const response = await copyrightApi.get('/analytics');
    return response.data;
  }

  /**
   * Get documents by owner address
   */
  async getDocumentsByOwner(ownerAddress: string, params?: { page?: number; limit?: number }): Promise<CopyrightApiResponse<any[]>> {
    const response = await copyrightApi.get(`/owner/${ownerAddress}`, { params });
    return response.data;
  }

  /**
   * Get recent documents
   */
  async getRecentDocuments(limit?: number): Promise<CopyrightApiResponse<any[]>> {
    const response = await copyrightApi.get('/recent', { params: { limit } });
    return response.data;
  }

  /**
   * Get all documents with filters and pagination
   */
  async getAllDocuments(params?: {
    page?: number;
    limit?: number;
    category?: string;
    ownerAddress?: string;
    verified?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<CopyrightApiResponse<any[]>> {
    const response = await copyrightApi.get('/', { params });
    return response.data;
  }
}

export const copyrightService = new CopyrightService();
export default copyrightService;
