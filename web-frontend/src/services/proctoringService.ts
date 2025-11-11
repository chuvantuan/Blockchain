/**
 * Proctoring Service - Re-export from api/proctoringApi.ts for backward compatibility
 */

// Re-export types
export type {
  FrameAnalysisRequest,
  Detection,
  FrameAnalysisResponse,
} from './api/proctoringApi';

// Re-export functions
import proctoringApi, { analyzeFrame as _analyzeFrame, getEventsBySession as _getEventsBySession } from './api/proctoringApi';

// Legacy class-based interface for backward compatibility
class ProctoringService {
  async analyzeFrame(request: import('./api/proctoringApi').FrameAnalysisRequest): Promise<import('./api/proctoringApi').FrameAnalysisResponse> {
    return _analyzeFrame(request);
  }

  async getSessionEvents(sessionId: string) {
    return _getEventsBySession(sessionId);
  }
}

export const proctoringService = new ProctoringService();

// Also export the new API for direct use
export { proctoringApi };

