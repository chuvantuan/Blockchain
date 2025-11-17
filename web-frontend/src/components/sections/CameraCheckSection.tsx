import React, { useState, useCallback } from 'react';
import { Camera, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { ProctoringView } from '../molecules/ProctoringView';
import { AICameraMonitor } from '../molecules/AICameraMonitor';
import { CheatingDetection } from '../../hooks/useAICameraMonitor';

export interface CameraCheckSectionProps {
  onCameraReady: (stream: MediaStream) => void;
  onCameraError: (error: string) => void;
  isCameraWorking: boolean;
  cameraError: string | null;
}

export const CameraCheckSection: React.FC<CameraCheckSectionProps> = ({
  onCameraReady,
  onCameraError,
  isCameraWorking,
  cameraError
}) => {
  const [aiViolations, setAiViolations] = useState<CheatingDetection[]>([]);
  const [aiMetrics, setAiMetrics] = useState<any>(null);

  // Handle AI violations during camera check
  const handleViolationDetected = useCallback((detection: CheatingDetection) => {
    setAiViolations(prev => [...prev, detection]);
  }, []);

  // Handle AI metrics update
  const handleMetricsUpdate = useCallback((metrics: any) => {
    setAiMetrics(metrics);
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'var(--space-6)',
      padding: 'var(--space-6)'
    }}>
      {/* Left Panel - Camera Check */}
      <div style={{
        background: 'transparent',
        padding: 0
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: 'var(--space-5)',
          color: 'var(--foreground)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Camera style={{ width: '24px', height: '24px', marginRight: 'var(--space-2)', color: 'var(--primary)' }} />
          Kiểm tra camera
        </h2>
        
        <p style={{ color: 'var(--muted-foreground)', marginBottom: 'var(--space-4)', fontSize: '14px' }}>
          Vui lòng cho phép truy cập camera và microphone để tiếp tục.
        </p>
        
        <div style={{ 
          marginBottom: 'var(--space-4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ProctoringView
            width={450}
            height={338}
            onStreamReady={onCameraReady}
            onError={onCameraError}
            showControls={true}
          />
        </div>

        {/* AI Camera Monitor - Hidden but functional */}
        <div style={{ 
          position: 'absolute', 
          top: '-9999px', 
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}>
          <AICameraMonitor
            examId="camera-check"
            studentId="pre-check-student"
            onViolationDetected={handleViolationDetected}
            onMetricsUpdate={handleMetricsUpdate}
          />
        </div>
        
        {cameraError && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)'
          }}>
            <p style={{ color: '#991b1b', fontSize: '14px', fontWeight: 600 }}>
              Lỗi camera: {cameraError}
            </p>
            <p style={{ color: '#7f1d1d', fontSize: '12px', marginTop: 'var(--space-2)' }}>
              Vui lòng kiểm tra kết nối camera và thử lại.
            </p>
          </div>
        )}
        
        {isCameraWorking && (
          <div style={{
            background: '#d1fae5',
            border: '1px solid #6ee7b7',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CheckCircle style={{ width: '20px', height: '20px', color: '#059669', marginRight: 'var(--space-2)' }} />
            <p style={{ color: '#065f46', fontSize: '14px', fontWeight: 600, margin: 0 }}>
              Camera đã sẵn sàng!
            </p>
          </div>
        )}

        {/* AI Status Display */}
        {aiMetrics && (
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #7dd3fc',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            marginTop: 'var(--space-3)'
          }}>
            <p style={{ color: '#0c4a6e', fontSize: '12px', fontWeight: 600, margin: 0 }}>
              🤖 AI Camera Monitor: Đang hoạt động
            </p>
            <p style={{ color: '#075985', fontSize: '11px', margin: 'var(--space-1) 0 0 0' }}>
              FPS: {aiMetrics.fps} | Resolution: {aiMetrics.resolution} | Brightness: {aiMetrics.brightness}%
            </p>
          </div>
        )}
      </div>

      {/* Right Panel - Camera Instructions */}
      <div style={{
        background: 'transparent',
        padding: 0
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: 'var(--space-5)',
          color: 'var(--foreground)',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Lightbulb style={{ width: '24px', height: '24px', marginRight: 'var(--space-2)', color: '#f59e0b' }} />
          Hướng dẫn sử dụng camera
        </h2>

        <div style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-5)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e40af', marginBottom: 'var(--space-3)' }}>
            Điều chỉnh camera:
          </h3>
          <ul style={{ fontSize: '14px', color: '#1e3a8a', lineHeight: 1.6, paddingLeft: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Đặt camera ở vị trí có thể nhìn rõ khuôn mặt</li>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Đảm bảo ánh sáng đủ sáng</li>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Giữ khoảng cách phù hợp (50-80cm)</li>
            <li>• Tránh ánh sáng ngược chiều</li>
          </ul>
        </div>

        <div style={{
          background: 'var(--background)',
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', marginBottom: 'var(--space-3)' }}>
            Trong quá trình thi:
          </h3>
          <ul style={{ fontSize: '14px', color: 'var(--muted-foreground)', lineHeight: 1.6, paddingLeft: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Luôn giữ khuôn mặt trong tầm nhìn camera</li>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Không được che camera</li>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Không được rời khỏi chỗ ngồi</li>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Tập trung vào màn hình máy tính</li>
            <li style={{ marginBottom: 'var(--space-2)' }}>• Không được chuyển tab hoặc mở ứng dụng khác</li>
            <li>• AI sẽ giám sát và cảnh báo nếu có hành vi bất thường</li>
          </ul>
        </div>

        {/* AI Monitoring Info */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-md)',
          marginTop: 'var(--space-4)',
          border: '1px solid #f59e0b'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#92400e', marginBottom: 'var(--space-3)' }}>
            🤖 AI Camera Monitoring
          </h3>
          <p style={{ fontSize: '13px', color: '#a16207', marginBottom: 'var(--space-2)', lineHeight: 1.5 }}>
            Hệ thống AI sẽ tự động giám sát và phát hiện:
          </p>
          <ul style={{ fontSize: '12px', color: '#a16207', lineHeight: 1.5, paddingLeft: 'var(--space-3)' }}>
            <li>• Khuôn mặt không trong tầm nhìn</li>
            <li>• Nhiều người trong khung hình</li>
            <li>• Chuyển tab hoặc ứng dụng khác</li>
            <li>• Hành vi bất thường khác</li>
          </ul>
          <p style={{ fontSize: '12px', color: '#92400e', marginTop: 'var(--space-2)', fontWeight: 600 }}>
            Nếu phát hiện vi phạm, hệ thống sẽ hiển thị cảnh báo và có thể dừng bài thi.
          </p>
        </div>
      </div>
    </div>
  );
};
