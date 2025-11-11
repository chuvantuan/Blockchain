// Proctoring API Service
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082/api';

// Create axios instance with JWT interceptors
const proctoringAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor to add JWT token
proctoringAxios.interceptors.request.use(
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

// Response interceptor to handle errors
proctoringAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Proctoring API: Unauthorized - Token may be invalid or expired');
    }
    return Promise.reject(error);
  }
);

// ==================== Types ====================

export interface FrameAnalysisRequest {
  image: string; // Base64 encoded image
  examId: string;
  studentId: string;
  sessionId?: string;
}

export interface Detection {
  type: 'FACE_NOT_DETECTED' | 'MULTIPLE_FACES' | 'MOBILE_PHONE_DETECTED' | 'CAMERA_TAMPERED' | 'LOOKING_AWAY' | 'tab_switch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  timestamp: number;
  description: string;
  metadata?: any;
}

export interface FrameAnalysisResponse {
  detections: Detection[];
}

export interface ProctoringEvent {
  id: string;
  sessionId: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  metadata?: any;
  isReviewed?: boolean;
}

export interface MediaCapture {
  id: string;
  eventId: string;
  captureType: 'screenshot' | 'video_clip';
  storagePath: string;
  createdAt: string;
}

export interface ProctoringSession {
  id: string;
  userId: number;
  examId: string;
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'terminated';
  maxSeverityLevel?: string;
  highSeverityViolationCount: number;
  events?: ProctoringEvent[];
}

export interface SessionWithEvents extends ProctoringSession {
  events: ProctoringEvent[];
  mediaCaptures: MediaCapture[];
}

// ==================== Frame Analysis ====================

/**
 * Gửi frame camera đến backend để phân tích bằng AI
 */
export const analyzeFrame = async (request: FrameAnalysisRequest): Promise<FrameAnalysisResponse> => {
  try {
    const response = await proctoringAxios.post('/proctoring/analyze-frame', request);
    return response.data;
  } catch (error: any) {
    console.error('Error analyzing frame:', error);
    // Return empty detections on error instead of throwing
    return { detections: [] };
  }
};

// ==================== Sessions ====================

/**
 * Lấy tất cả sessions
 */
export const getAllSessions = async (): Promise<ProctoringSession[]> => {
  try {
    const response = await proctoringAxios.get('/proctoring/sessions');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};

/**
 * Lấy session theo ID
 */
export const getSessionById = async (sessionId: string): Promise<ProctoringSession | null> => {
  try {
    const response = await proctoringAxios.get(`/proctoring/sessions/${sessionId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching session:', error);
    return null;
  }
};

/**
 * Lấy session theo ID với events và media
 */
export const getSessionWithDetails = async (sessionId: string): Promise<SessionWithEvents | null> => {
  try {
    const session = await getSessionById(sessionId);
    if (!session) return null;

    const events = await getEventsBySession(sessionId);
    
    // Fetch media captures for each event
    const mediaCaptures: MediaCapture[] = [];
    for (const event of events) {
      const media = await getMediaByEventId(event.id);
      mediaCaptures.push(...media);
    }

    return {
      ...session,
      events,
      mediaCaptures
    };
  } catch (error: any) {
    console.error('Error fetching session details:', error);
    return null;
  }
};

/**
 * Terminate session
 */
export const terminateSession = async (sessionId: string): Promise<boolean> => {
  try {
    const response = await proctoringAxios.post(`/proctoring/sessions/${sessionId}/terminate`);
    return response.status === 200;
  } catch (error: any) {
    console.error('Error terminating session:', error);
    return false;
  }
};

// ==================== Events ====================

/**
 * Lấy events của một session
 */
export const getEventsBySession = async (sessionId: string): Promise<ProctoringEvent[]> => {
  try {
    const response = await proctoringAxios.get(`/sessions/${sessionId}/events`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return [];
  }
};

/**
 * Mark violation as reviewed
 */
export const reviewEvent = async (eventId: string, isReviewed: boolean): Promise<boolean> => {
  try {
    const response = await proctoringAxios.patch(`/proctoring/events/${eventId}/review`, {
      isReviewed
    });
    return response.status === 200;
  } catch (error: any) {
    console.error('Error reviewing event:', error);
    return false;
  }
};

// ==================== Media ====================

/**
 * Lấy media captures của một event
 */
export const getMediaByEventId = async (eventId: string): Promise<MediaCapture[]> => {
  try {
    const response = await proctoringAxios.get(`/proctoring/events/${eventId}/media`);
    return response.data;
  } catch (error: any) {
    // If endpoint doesn't exist, return empty array
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    console.error('Error fetching media:', error);
    return [];
  }
};

/**
 * Get media file URL (local or CDN)
 */
export const getMediaUrl = (storagePath: string): string => {
  // If it's a relative path, prepend backend URL
  if (storagePath.startsWith('/')) {
    return `http://localhost:8082${storagePath}`;
  }
  return storagePath;
};

// ==================== Default Export ====================

const proctoringApi = {
  // Frame Analysis
  analyzeFrame,
  
  // Sessions
  getAllSessions,
  getSessionById,
  getSessionWithDetails,
  terminateSession,
  
  // Events
  getEventsBySession,
  reviewEvent,
  
  // Media
  getMediaByEventId,
  getMediaUrl,
};

export default proctoringApi;

