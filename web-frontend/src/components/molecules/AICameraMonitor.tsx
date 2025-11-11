import React, { useState, useEffect } from 'react';
import { Camera, AlertTriangle, Eye, Users, Volume2, MousePointer, Activity, Settings, Play, Square, Zap, Smartphone } from 'lucide-react';
import { useAICameraMonitor, CheatingDetection } from '../../hooks/useAICameraMonitor';
import Button from '../atoms/Button';
import styles from './AICameraMonitor.module.css';

interface AICameraMonitorProps {
  examId: string;
  studentId: string;
  sessionId?: string;
  onViolationDetected?: (detection: CheatingDetection) => void;
  onMetricsUpdate?: (metrics: any) => void;
  className?: string;
}

export const AICameraMonitor: React.FC<AICameraMonitorProps> = ({
  examId,
  studentId,
  sessionId,
  onViolationDetected,
  onMetricsUpdate,
  className = ''
}) => {
  const {
    isActive,
    isAnalyzing,
    error,
    detections,
    metrics,
    startMonitoring,
    stopMonitoring,
    captureScreenshot,
    setDetectionSensitivity,
    enableDetectionType,
    frameStorage
  } = useAICameraMonitor({ examId, studentId, sessionId });

  const [showSettings, setShowSettings] = useState(false);
  const [detectionTypes, setDetectionTypes] = useState({
    FACE_NOT_DETECTED: true,
    MULTIPLE_FACES: true,
    MOBILE_PHONE_DETECTED: true,
    CAMERA_TAMPERED: true,
    LOOKING_AWAY: true,
    tab_switch: true
  });

  const [sensitivity, setSensitivity] = useState<'low' | 'medium' | 'high'>('medium');

  // Auto-start camera when component mounts
  React.useEffect(() => {
    const autoStartCamera = async () => {
      if (!isActive && !isAnalyzing && !error) {
        try {
          await startMonitoring();
        } catch (err) {
          console.error('Failed to auto-start camera:', err);
        }
      }
    };

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(autoStartCamera, 2000); // Increased delay to let ProctoringView start first
    return () => {
      clearTimeout(timer);
    };
  }, [examId, error, startMonitoring]);

  // Notify parent components of violations
  useEffect(() => {
    if (detections.length > 0) {
      const latestDetection = detections[detections.length - 1];
      onViolationDetected?.(latestDetection);
    }
  }, [detections, onViolationDetected]);

  // Notify parent components of metrics updates
  useEffect(() => {
    if (metrics) {
      onMetricsUpdate?.(metrics);
    }
  }, [metrics, onMetricsUpdate]);

  const handleStartMonitoring = async () => {
    try {
      await startMonitoring();
    } catch (err) {
      console.error('Failed to start monitoring:', err);
    }
  };

  const handleStopMonitoring = () => {
    stopMonitoring();
  };

  const handleSensitivityChange = (newSensitivity: 'low' | 'medium' | 'high') => {
    setSensitivity(newSensitivity);
    setDetectionSensitivity(newSensitivity);
  };

  const handleDetectionTypeToggle = (type: keyof typeof detectionTypes) => {
    const newTypes = { ...detectionTypes, [type]: !detectionTypes[type] };
    setDetectionTypes(newTypes);
    enableDetectionType(type, newTypes[type]);
  };

  const getSeverityColor = (severity: CheatingDetection['severity']) => {
    switch (severity) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getSeverityIcon = (severity: CheatingDetection['severity']) => {
    switch (severity) {
      case 'low': return <Activity className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getDetectionTypeIcon = (type: CheatingDetection['type']) => {
    switch (type) {
      case 'FACE_NOT_DETECTED': return <Camera className="w-4 h-4" />;
      case 'MULTIPLE_FACES': return <Users className="w-4 h-4" />;
      case 'MOBILE_PHONE_DETECTED': return <Smartphone className="w-4 h-4" />;
      case 'CAMERA_TAMPERED': return <AlertTriangle className="w-4 h-4" />;
      case 'LOOKING_AWAY': return <Eye className="w-4 h-4" />;
      case 'tab_switch': return <MousePointer className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getDetectionTypeName = (type: CheatingDetection['type']) => {
    switch (type) {
      case 'FACE_NOT_DETECTED': return 'Không phát hiện khuôn mặt';
      case 'MULTIPLE_FACES': return 'Nhiều người';
      case 'MOBILE_PHONE_DETECTED': return 'Phát hiện điện thoại';
      case 'CAMERA_TAMPERED': return 'Camera bị can thiệp';
      case 'LOOKING_AWAY': return 'Nhìn ra ngoài';
      case 'tab_switch': return 'Chuyển tab';
      default: return 'Không xác định';
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.title}>
          <Camera className="w-5 h-5" />
          <span>AI Camera Monitor</span>
          {isActive && (
            <div className={styles.statusIndicator}>
              <div className={styles.activeDot} />
              <span>Đang hoạt động</span>
            </div>
          )}
        </div>
        
        <div className={styles.controls}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className={styles.settingsButton}
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          {!isActive ? (
            <Button
              onClick={handleStartMonitoring}
              disabled={isAnalyzing}
              className={styles.startButton}
            >
              {isAnalyzing ? (
                <>
                  <div className={styles.spinner} />
                  Đang khởi động...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Bắt đầu
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleStopMonitoring}
              variant="outline"
              className={`${styles.stopButton} ${styles.destructiveButton}`}
            >
              <Square className="w-4 h-4" />
              Dừng
            </Button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className={styles.error}>
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className={styles.settingsPanel}>
          <h4 className={styles.settingsTitle}>Cài đặt phát hiện</h4>
          
          {/* Sensitivity */}
          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>Độ nhạy:</label>
            <div className={styles.sensitivityButtons}>
              {(['low', 'medium', 'high'] as const).map((level) => (
                <Button
                  key={level}
                  variant={sensitivity === level ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handleSensitivityChange(level)}
                >
                  {level === 'low' && 'Thấp'}
                  {level === 'medium' && 'Trung bình'}
                  {level === 'high' && 'Cao'}
                </Button>
              ))}
            </div>
          </div>

          {/* Detection Types */}
          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>Loại phát hiện:</label>
            <div className={styles.detectionTypes}>
              {Object.entries(detectionTypes).map(([type, enabled]) => (
                <label key={type} className={styles.detectionTypeItem}>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handleDetectionTypeToggle(type as keyof typeof detectionTypes)}
                  />
                  <span className={styles.detectionTypeIcon}>
                    {getDetectionTypeIcon(type as CheatingDetection['type'])}
                  </span>
                  <span>{getDetectionTypeName(type as CheatingDetection['type'])}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metrics Display */}
      {metrics && (
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>FPS:</span>
            <span className={styles.metricValue}>{metrics.fps.toFixed(1)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Độ phân giải:</span>
            <span className={styles.metricValue}>{metrics.resolution}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Độ sáng:</span>
            <span className={styles.metricValue}>{metrics.brightness.toFixed(0)}%</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Trạng thái:</span>
            <span className={`${styles.metricValue} ${metrics.isStable ? styles.stable : styles.unstable}`}>
              {metrics.isStable ? 'Ổn định' : 'Không ổn định'}
            </span>
          </div>
        </div>
      )}

      {/* Detections List */}
      {detections.length > 0 && (
        <div className={styles.detections}>
          <h4 className={styles.detectionsTitle}>
            Phát hiện gian lận ({detections.length})
          </h4>
          <div className={styles.detectionsList}>
            {detections.slice(-5).reverse().map((detection, index) => (
              <div
                key={`${detection.timestamp}-${index}`}
                className={styles.detectionItem}
                style={{ borderLeftColor: getSeverityColor(detection.severity) }}
              >
                <div className={styles.detectionHeader}>
                  <div className={styles.detectionType}>
                    {getDetectionTypeIcon(detection.type)}
                    <span>{getDetectionTypeName(detection.type)}</span>
                  </div>
                  <div className={styles.detectionSeverity}>
                    {getSeverityIcon(detection.severity)}
                    <span style={{ color: getSeverityColor(detection.severity) }}>
                      {detection.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className={styles.detectionDescription}>
                  {detection.description}
                </div>
                <div className={styles.detectionMeta}>
                  <span className={styles.confidence}>
                    Độ tin cậy: {detection.confidence.toFixed(0)}%
                  </span>
                  <span className={styles.timestamp}>
                    {new Date(detection.timestamp).toLocaleTimeString('vi-VN')}
                  </span>
                </div>
                {detection.screenshot && (
                  <div className={styles.screenshot}>
                    <img
                      src={detection.screenshot}
                      alt="Screenshot vi phạm"
                      className={styles.screenshotImage}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isActive && !error && (
        <div className={styles.emptyState}>
          <Camera className="w-12 h-12" />
          <h3>AI Camera Monitor</h3>
          <p>Nhấn "Bắt đầu" để khởi động giám sát camera với AI</p>
        </div>
      )}
    </div>
  );
};
