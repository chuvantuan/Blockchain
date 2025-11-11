import { useState, useEffect, useRef, useCallback } from 'react';
import { proctoringService } from '../services/proctoringService';
import { cameraManager } from '../services/cameraManager';
import { useFrameStorage } from './useFrameStorage';

export interface CheatingDetection {
  type: 'FACE_NOT_DETECTED' | 'MULTIPLE_FACES' | 'MOBILE_PHONE_DETECTED' | 'CAMERA_TAMPERED' | 'LOOKING_AWAY' | 'tab_switch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  timestamp: number;
  description: string;
  screenshot?: string;
  metadata?: any;
}

export interface CameraMetrics {
  fps: number;
  resolution: string;
  brightness: number;
  contrast: number;
  isStable: boolean;
}

export interface AICameraMonitorReturn {
  // Camera state
  isActive: boolean;
  isAnalyzing: boolean;
  error: string | null;
  
  // Detection results
  detections: CheatingDetection[];
  metrics: CameraMetrics | null;
  
  // Actions
  startMonitoring: () => Promise<void>;
  stopMonitoring: () => void;
  captureScreenshot: () => string | null;
  
  // Configuration
  setDetectionSensitivity: (level: 'low' | 'medium' | 'high') => void;
  enableDetectionType: (type: CheatingDetection['type'], enabled: boolean) => void;
  
  // Frame Storage
  frameStorage: {
    totalFramesCaptured: number;
    totalDetections: number;
    storageSize: number;
    getStatistics: () => any;
    exportData: () => void;
    clearAll: () => void;
  };
}

interface UseAICameraMonitorProps {
  examId?: string;
  studentId?: string;
  sessionId?: string;
}

interface CameraState {
  isActive: boolean;
  isAnalyzing: boolean;
  error: string | null;
  detections: CheatingDetection[];
  metrics: CameraMetrics | null;
  detectionSensitivity: 'low' | 'medium' | 'high';
  enabledDetections: Set<CheatingDetection['type']>;
}

const initialState: CameraState = {
  isActive: false,
  isAnalyzing: false,
  error: null,
  detections: [],
  metrics: null,
  detectionSensitivity: 'medium',
  enabledDetections: new Set(['FACE_NOT_DETECTED', 'MULTIPLE_FACES', 'MOBILE_PHONE_DETECTED', 'CAMERA_TAMPERED', 'LOOKING_AWAY', 'tab_switch'])
};

export const useAICameraMonitor = (props?: UseAICameraMonitorProps): AICameraMonitorReturn => {
  const { examId = 'default', studentId = '1', sessionId } = props || {};
  const [state, setState] = useState<CameraState>(initialState);
  
  // Frame Storage Hook
  const frameStorage = useFrameStorage({
    maxFrames: 100,
    maxResponses: 200,
    autoCleanup: true,
    cleanupInterval: 60000 // 1 minute
  });
  
  // Refs for tracking state
  const isActiveRef = useRef(false);
  const detectionCooldownRef = useRef(0); // Cooldown between detections

  // Helper functions to update state
  const updateState = useCallback((updates: Partial<CameraState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastDetectionTimeRef = useRef<number>(0);
  const cameraUsageRef = useRef(false);
  const visibilityListenerRef = useRef<(() => void) | null>(null);

  // Tab switch detection (vẫn giữ vì dùng Browser API, không cần backend)
  const detectTabSwitch = useCallback((): CheatingDetection | null => {
    if (document.hidden) {
      return {
        type: 'tab_switch',
        severity: 'medium',
        confidence: 100,
        timestamp: Date.now(),
        description: 'Phát hiện chuyển tab hoặc cửa sổ khác'
      };
    }
    return null;
  }, []);

  const captureScreenshot = useCallback((): string | null => {
    const dataUrl = cameraManager.captureFrame();

    if (!dataUrl) {
      console.error('captureScreenshot: Unable to capture frame from shared camera');
      return null;
    }

      const minSize = 5000; // Accept if > 5KB (relaxed from calculated minimum)
    if (dataUrl.length < minSize) {
        console.error('captureScreenshot: Captured image too small:', dataUrl.length, 'bytes, expected >', minSize);
        return null;
      }
      
      return dataUrl;
  }, []);

  const updateCameraMetrics = useCallback(() => {
    const dimensions = cameraManager.getVideoDimensions();
    const fps = cameraManager.getFrameRate();

    const newMetrics: CameraMetrics = {
      fps: fps ?? 25 + Math.random() * 5,
      resolution: dimensions ? `${dimensions.width}x${dimensions.height}` : 'Không xác định',
      brightness: 50 + Math.random() * 30,
      contrast: 60 + Math.random() * 20,
      isStable: !!cameraManager.currentStream?.active,
    };

    updateState({ metrics: newMetrics });
  }, [updateState]);

  const analyzeFrame = useCallback(async () => {
    if (!isActiveRef.current) {
      return;
    }

    let newDetections: CheatingDetection[] = [];
    const startTime = Date.now();

    try {
      // === GỌI AI BACKEND THẬT ===
      const screenshot = captureScreenshot();
      if (screenshot) {
        // Lưu frame vào storage
        const frameId = frameStorage.addFrame(screenshot, examId, studentId);
        
        const response = await proctoringService.analyzeFrame({
          image: screenshot,
          examId,
          studentId,
          sessionId,
        });

        const processingTime = Date.now() - startTime;

        // Lưu response vào storage
        frameStorage.addResponse(frameId, response.detections.map(d => ({
          event_type: d.type,
          severity: d.severity,
          metadata: d.metadata
        })), processingTime);

        // Map detections từ backend
        newDetections = response.detections.map(d => ({
          ...d,
          screenshot: screenshot, // Attach screenshot to all detections
        }));
      }

      // Kiểm tra tab switch (Browser API - không cần backend)
      if (state.enabledDetections.has('tab_switch')) {
        const tabSwitchDetection = detectTabSwitch();
        if (tabSwitchDetection) {
          newDetections.push(tabSwitchDetection);
        }
      }

      // Update detections state - CHỈ HIỂN THỊ KHI THỰC SỰ CÓ VI PHẠM
      if (newDetections.length > 0) {
        const now = Date.now();
        // Giảm cooldown xuống 3 giây và chỉ áp dụng cho cùng loại vi phạm
        const lastDetection = state.detections[state.detections.length - 1];
        const shouldSkip = lastDetection && 
          (now - lastDetectionTimeRef.current < 3000) && // 3 giây cooldown
          lastDetection.type === newDetections[0].type; // Cùng loại vi phạm
        
        if (!shouldSkip) {
          setState(prev => ({ 
            ...prev,
            detections: [...prev.detections, ...newDetections].slice(-50) // Keep last 50 detections
          }));
          lastDetectionTimeRef.current = now;
        }
      }

      // Update camera metrics
      updateCameraMetrics();

    } catch (err) {
      console.error('Error analyzing frame:', err);
    }
  }, [examId, studentId, state.enabledDetections, detectTabSwitch, captureScreenshot, updateCameraMetrics]);

  const startMonitoring = useCallback(async () => {
    if (isActiveRef.current) {
      return;
    }

    try {
      updateState({ error: null, isAnalyzing: true });

      if (!cameraUsageRef.current) {
        cameraManager.incrementUsage();
        cameraUsageRef.current = true;
      }

      await cameraManager.start();

      updateState({ isActive: true, isAnalyzing: false });
      isActiveRef.current = true;

      if (!analysisIntervalRef.current) {
        analysisIntervalRef.current = setInterval(analyzeFrame, 3000);
      }

        analyzeFrame();

      const handleVisibilityChange = () => {
        if (state.enabledDetections.has('tab_switch')) {
          analyzeFrame();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      visibilityListenerRef.current = handleVisibilityChange;
    } catch (err) {
      console.error('Error starting camera monitoring:', err);
      let errorMessage = 'Không thể khởi động camera AI';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Bạn đã từ chối quyền truy cập camera. Vui lòng cho phép camera để tiếp tục.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'Không tìm thấy camera. Vui lòng kiểm tra camera của bạn.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera đang được sử dụng bởi ứng dụng khác.';
        } else {
          errorMessage = err.message || errorMessage;
        }
      }

      if (cameraUsageRef.current) {
        cameraManager.decrementUsage();
        cameraUsageRef.current = false;
      }
      
      updateState({ error: errorMessage, isAnalyzing: false });
    }
  }, [analyzeFrame, state.enabledDetections, updateState]);

  const stopMonitoring = useCallback(() => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }

    if (visibilityListenerRef.current) {
      document.removeEventListener('visibilitychange', visibilityListenerRef.current);
      visibilityListenerRef.current = null;
    }

    if (cameraUsageRef.current) {
      cameraManager.decrementUsage();
      cameraUsageRef.current = false;
    }

    updateState({ 
      isActive: false, 
      isAnalyzing: false, 
      detections: [], 
      metrics: null,
    });
    isActiveRef.current = false;
  }, [updateState]);

  const handleSetDetectionSensitivity = useCallback((level: 'low' | 'medium' | 'high') => {
    updateState({ detectionSensitivity: level });
    // Adjust detection thresholds based on sensitivity
    // This would be implemented with real AI models
  }, [updateState]);

  const handleEnableDetectionType = useCallback((type: CheatingDetection['type'], enabled: boolean) => {
    setState(prev => {
      const newEnabledDetections = new Set(prev.enabledDetections);
      if (enabled) {
        newEnabledDetections.add(type);
      } else {
        newEnabledDetections.delete(type);
      }
      return { ...prev, enabledDetections: newEnabledDetections };
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    isActive: state.isActive,
    isAnalyzing: state.isAnalyzing,
    error: state.error,
    detections: state.detections,
    metrics: state.metrics,
    startMonitoring,
    stopMonitoring,
    captureScreenshot,
    setDetectionSensitivity: handleSetDetectionSensitivity,
    enableDetectionType: handleEnableDetectionType,
    frameStorage: {
      totalFramesCaptured: frameStorage.totalFramesCaptured,
      totalDetections: frameStorage.totalDetections,
      storageSize: frameStorage.storageSize,
      getStatistics: frameStorage.getStatistics,
      exportData: frameStorage.exportData,
      clearAll: frameStorage.clearAll
    }
  };
};
