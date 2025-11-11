import { useState, useEffect, useCallback } from 'react';
import { copyrightService, DocumentMetadata, DocumentCopyright, CopyrightStats } from '../../services/blockchain/copyrightService';
import { mockAdminDocuments, mockAdminStats, mockAdminDashboard } from '../data/mockCopyright';

// Admin-specific types
export interface AdminDocument extends DocumentCopyright {
  id: string;
  author: string;
  institution?: string;
  status: 'pending' | 'verified' | 'disputed' | 'rejected';
  registrationDate: string;
  verificationDate?: string;
  disputes?: AdminDispute[];
  verificationHistory?: AdminVerification[];
}

export interface AdminDispute {
  id: string;
  documentId: string;
  disputerAddress: string;
  reason: string;
  evidence: string[];
  status: 'open' | 'resolved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface AdminVerification {
  id: string;
  documentId: string;
  verifierAddress: string;
  status: 'approved' | 'rejected';
  comments?: string;
  timestamp: string;
}

export interface AdminDashboard {
  recentDocuments: AdminDocument[];
  pendingVerifications: AdminDocument[];
  disputedDocuments: AdminDocument[];
  blockchainStatus: {
    isConnected: boolean;
    lastBlock: number;
    averageGasPrice: string;
    networkCongestion: string;
    estimatedConfirmationTime: string;
  };
}

export interface AdminStats extends CopyrightStats {
  disputedDocuments: number;
  rejectedDocuments: number;
  pendingVerifications: number;
  averageVerificationTime: number;
  blockchainTransactions: number;
  registrationFee?: string;
  verificationFee?: string;
}

export interface DocumentForm {
  title: string;
  description: string;
  category: string;
  fileExtension: string;
  fileSize: number;
  tags: string[];
  authorName?: string;
  institution?: string;
  keywords?: string[];
  abstract?: string;
  file?: File;
  content?: string;
}

export interface ExportOptions {
  format: 'excel' | 'csv' | 'pdf';
  includeMetadata: boolean;
  includeVerificationHistory: boolean;
  includeDisputes: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface AdminFilters {
  status?: string[];
  category?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  search?: string;
  verified?: boolean;
  disputed?: boolean;
}

export interface AdminResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}


export function useCopyright() {
  const [documents, setDocuments] = useState<AdminDocument[]>(mockAdminDocuments);
  const [stats, setStats] = useState<AdminStats>(mockAdminStats);
  const [dashboard, setDashboard] = useState<AdminDashboard>(mockAdminDashboard);
  const [blockchainInfo, setBlockchainInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminFilters>({});
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);

  // Initialize blockchain connection
  useEffect(() => {
    const initializeBlockchain = async () => {
      try {
        setLoading(true);
        const isConnected = await copyrightService.connectWallet();
        if (isConnected) {
          const stats = await copyrightService.getStatistics();
          if (stats) {
            setStats(prev => ({
              ...prev,
              totalDocuments: stats?.totalDocuments || prev.totalDocuments,
              totalVerified: stats?.totalVerified || prev.totalVerified,
              totalOwners: stats?.totalOwners || prev.totalOwners,
              contractBalance: stats?.contractBalance || prev.contractBalance
            }));
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to initialize blockchain connection');
      } finally {
        setLoading(false);
      }
    };

    initializeBlockchain();
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(async () => {
      try {
        await refreshData();
      } catch (err) {
        console.error('Real-time update failed:', err);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isRealTimeEnabled]);

  const registerDocument = useCallback(async (form: DocumentForm): Promise<AdminResult> => {
    setLoading(true);
    setError(null);

    try {
      let result;
      
      if (form.file) {
        const metadata: DocumentMetadata = {
          title: form.title,
          description: form.description,
          category: form.category as any,
          fileExtension: form.fileExtension,
          fileSize: form.fileSize,
          tags: form.tags,
          authorName: form.authorName,
          institution: form.institution,
          keywords: form.keywords,
          abstract: form.abstract
        };
        
        result = await copyrightService.registerDocument(form.file, metadata);
      } else if (form.content) {
        const metadata: DocumentMetadata = {
          title: form.title,
          description: form.description,
          category: form.category as any,
          fileExtension: form.fileExtension,
          fileSize: form.fileSize,
          tags: form.tags,
          authorName: form.authorName,
          institution: form.institution,
          keywords: form.keywords,
          abstract: form.abstract
        };
        
        result = await copyrightService.registerTextDocument(form.content, metadata);
      } else {
        throw new Error('No file or content provided');
      }

      if (result.success && result.documentHash) {
        // Add to local documents list
        const newDocument: AdminDocument = {
          id: Date.now().toString(),
          documentHash: result.documentHash,
          owner: await copyrightService.getCurrentAddress() || '',
          title: form.title,
          description: form.description,
          category: form.category,
          fileExtension: form.fileExtension,
          fileSize: form.fileSize,
          timestamp: Math.floor(Date.now() / 1000),
          isVerified: false,
          isActive: true,
          ipfsHash: '',
          tags: form.tags,
          author: form.authorName || 'Unknown',
          institution: form.institution,
          status: 'pending',
          registrationDate: new Date().toISOString().split('T')[0],
          verificationHistory: []
        };

        setDocuments(prev => [newDocument, ...prev]);
        setStats(prev => ({
          ...prev,
          totalDocuments: prev.totalDocuments + 1
        }));

        return {
          success: true,
          data: newDocument,
          message: 'Document registered successfully'
        };
      } else {
        return {
          success: false,
          error: result.error || 'Registration failed'
        };
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      return {
        success: false,
        error: err.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyDocument = useCallback(async (documentId: string): Promise<AdminResult & { verified?: boolean }> => {
    setLoading(true);
    setError(null);

    try {
      const document = documents.find(doc => doc.id === documentId);
      if (!document) {
        return {
          success: false,
          error: 'Document not found'
        };
      }

      const result = await copyrightService.verifyDocument(document.documentHash);
      
      if (result.success) {
        // Get current address
        const currentAddress = await copyrightService.getCurrentAddress() || '';

        // Update document status
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { 
                ...doc, 
                isVerified: true, 
                status: 'verified' as const,
                verificationDate: new Date().toISOString().split('T')[0],
                verificationHistory: [
                  ...doc.verificationHistory || [],
                  {
                    id: Date.now().toString(),
                    documentId,
                    verifierAddress: currentAddress,
                    status: 'approved',
                    comments: 'Verified by admin',
                    timestamp: new Date().toISOString()
                  }
                ]
              }
            : doc
        ));

        setStats(prev => ({
          ...prev,
          totalVerified: prev.totalVerified + 1,
          pendingVerifications: Math.max(0, prev.pendingVerifications - 1)
        }));

        return {
          success: true,
          verified: true,
          message: 'Document verified successfully'
        };
      } else {
        return {
          success: false,
          verified: false,
          error: result.error || 'Verification failed'
        };
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      return {
        success: false,
        verified: false,
        error: err.message || 'Verification failed'
      };
    } finally {
      setLoading(false);
    }
  }, [documents]);

  const deleteDocument = useCallback(async (documentId: string): Promise<AdminResult> => {
    setLoading(true);
    setError(null);

    try {
      const document = documents.find(doc => doc.id === documentId);
      if (!document) {
        return {
          success: false,
          error: 'Document not found'
        };
      }

      const result = await copyrightService.deactivateDocument(document.documentHash);
      
      if (result) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        setStats(prev => ({
          ...prev,
          totalDocuments: Math.max(0, prev.totalDocuments - 1)
        }));

        return {
          success: true,
          message: 'Document deleted successfully'
        };
      } else {
        return {
          success: false,
          error: 'Failed to delete document'
        };
      }
    } catch (err: any) {
      setError(err.message || 'Delete failed');
      return {
        success: false,
        error: err.message || 'Delete failed'
      };
    } finally {
      setLoading(false);
    }
  }, [documents]);

  const updateDocument = useCallback(async (documentId: string, form: DocumentForm): Promise<AdminResult> => {
    setLoading(true);
    setError(null);

    try {
      const document = documents.find(doc => doc.id === documentId);
      if (!document) {
        return {
          success: false,
          error: 'Document not found'
        };
      }

      // Update title
      if (form.title !== document.title) {
        const titleResult = await copyrightService.updateDocument(
          document.documentHash,
          'title',
          form.title
        );
        if (!titleResult) {
          return {
            success: false,
            error: 'Failed to update title'
          };
        }
      }

      // Update description
      if (form.description !== document.description) {
        const descResult = await copyrightService.updateDocument(
          document.documentHash,
          'description',
          form.description
        );
        if (!descResult) {
          return {
            success: false,
            error: 'Failed to update description'
          };
        }
      }

      // Update tags
      const tagsResult = await copyrightService.updateDocumentTags(
        document.documentHash,
        form.tags
      );
      if (!tagsResult) {
        return {
          success: false,
          error: 'Failed to update tags'
        };
      }

      // Update local state
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              title: form.title,
              description: form.description,
              tags: form.tags,
              author: form.authorName || doc.author,
              institution: form.institution || doc.institution
            }
          : doc
      ));

      return {
        success: true,
        message: 'Document updated successfully'
      };
    } catch (err: any) {
      setError(err.message || 'Update failed');
      return {
        success: false,
        error: err.message || 'Update failed'
      };
    } finally {
      setLoading(false);
    }
  }, [documents]);

  const exportDocuments = useCallback(async (options: ExportOptions): Promise<AdminResult> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = {
        documents: documents.filter(doc => {
          if (options.dateRange) {
            const docDate = new Date(doc.registrationDate);
            const fromDate = new Date(options.dateRange.from);
            const toDate = new Date(options.dateRange.to);
            if (docDate < fromDate || docDate > toDate) return false;
          }
          return true;
        }),
        stats,
        exportOptions: options,
        exportedAt: new Date().toISOString()
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `copyright-documents-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return {
        success: true,
        message: 'Documents exported successfully'
      };
    } catch (err: any) {
      setError(err.message || 'Export failed');
      return {
        success: false,
        error: err.message || 'Export failed'
      };
    } finally {
      setLoading(false);
    }
  }, [documents, stats]);

  const updateFilters = useCallback((newFilters: Partial<AdminFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Refresh blockchain data
      const blockchainStats = await copyrightService.getStatistics();
      if (blockchainStats) {
        setStats(prev => ({
          ...prev,
          totalDocuments: blockchainStats.totalDocuments,
          totalVerified: blockchainStats.totalVerified,
          totalOwners: blockchainStats.totalOwners,
          contractBalance: blockchainStats.contractBalance
        }));
      }

      // Refresh dashboard
      setDashboard(prev => ({
        ...prev,
        recentDocuments: documents.slice(0, 3),
        pendingVerifications: documents.filter(doc => doc.status === 'pending'),
        disputedDocuments: documents.filter(doc => doc.status === 'disputed')
      }));
    } catch (err: any) {
      setError(err.message || 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, [documents]);

  const getDocumentById = useCallback((id: string): AdminDocument | null => {
    return documents.find(doc => doc.id === id) || null;
  }, [documents]);

  return {
    // Data
    documents,
    stats,
    dashboard,
    blockchainInfo,
    loading,
    error,
    filters,
    isRealTimeEnabled,

    // Actions
    registerDocument,
    verifyDocument,
    deleteDocument,
    updateDocument,
    exportDocuments,
    updateFilters,
    clearFilters,
    refreshData,
    setIsRealTimeEnabled,
    getDocumentById
  };
}

export default useCopyright;