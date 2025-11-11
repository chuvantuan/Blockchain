import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { ExamProgressIndicator } from '../components/molecules/ExamProgressIndicator';
import { ExamInstructionsSection } from '../components/sections/ExamInstructionsSection';
import { CameraCheckSection } from '../components/sections/CameraCheckSection';
import { ExamReadySection } from '../components/sections/ExamReadySection';
import Button from '../components/atoms/Button';
import { fetchExamDetails, startExamSession, setCameraReady, setCameraError } from '../store/slices/examSlice';
import { RootState, AppDispatch } from '../store';

export const ExamPreCheckPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const [currentStep, setCurrentStep] = useState<'loading' | 'instructions' | 'camera-check' | 'ready'>('loading');
  const [isCameraWorking, setIsCameraWorking] = useState(false);
  
  const { 
    currentExam, 
    status, 
    error, 
    isCameraReady,
    cameraError 
  } = useSelector((state: RootState) => state.exam);

  // ✅ FIX: Add guard to prevent duplicate fetch when dispatch changes
  useEffect(() => {
    if (examId && status !== 'loading' && !currentExam) {
      dispatch(fetchExamDetails(examId));
    }
  }, [examId, status, currentExam, dispatch]);

  useEffect(() => {
    if (status === 'idle' && currentExam) {
      setCurrentStep('instructions');
    }
  }, [status, currentExam]);

  const handleStartCameraCheck = () => {
    setCurrentStep('camera-check');
  };

  const handleCameraReady = (stream: MediaStream) => {
    setIsCameraWorking(true);
    dispatch(setCameraReady(true));
    dispatch(setCameraError(null));
  };

  const handleCameraError = (error: string) => {
    console.error('Camera error:', error);
    setIsCameraWorking(false);
    dispatch(setCameraError(error));
    dispatch(setCameraReady(false));
  };

  const handleProceedToExam = async () => {
    if (examId) {
      try {
        await dispatch(startExamSession(examId));
        navigate(`/exam/${examId}/take`);
      } catch (error) {
        console.error('Error starting exam:', error);
      }
    }
  };

  const handleGoBack = () => {
    navigate('/user/home');
  };

  // Loading State
  if (status === 'loading' || currentStep === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)'
      }}>
        <div style={{
          background: 'var(--card)',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid var(--muted)',
            borderTop: '3px solid var(--primary)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }} />
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            marginBottom: '8px',
            color: 'var(--foreground)'
          }}>
            Đang tải...
          </h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-sans)'
      }}>
        <div style={{
          background: 'var(--card)',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          maxWidth: '400px',
          border: '1px solid var(--destructive)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <AlertCircle style={{ 
            width: '64px', 
            height: '64px', 
            color: 'var(--destructive)',
            margin: '0 auto 20px'
          }} />
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            marginBottom: '12px',
            color: 'var(--foreground)'
          }}>
            Lỗi
          </h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '24px' }}>{error}</p>
          <Button onClick={handleGoBack} variant="secondary">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      fontFamily: 'var(--font-sans)',
      padding: 'var(--space-6)'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: 'var(--space-3)',
            color: 'var(--foreground)',
            fontFamily: 'var(--font-display)'
          }}>
            Kiểm tra trước khi thi
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--muted-foreground)',
            fontWeight: 500
          }}>
            {currentExam?.title}
          </p>
        </div>

        {/* Progress Indicator */}
        <ExamProgressIndicator currentStep={currentStep} />

        {/* Main Content */}
        <div style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          {currentStep === 'instructions' && currentExam && (
            <ExamInstructionsSection exam={currentExam} />
          )}

          {currentStep === 'camera-check' && (
            <CameraCheckSection 
              onCameraReady={(stream: MediaStream) => handleCameraReady(stream)}
              onCameraError={(error: string) => handleCameraError(error)}
              isCameraWorking={isCameraWorking}
              cameraError={cameraError}
            />
          )}

          {currentStep === 'ready' && currentExam && (
            <ExamReadySection exam={currentExam} />
          )}
        </div>

        {/* Navigation Buttons */}
        {(currentStep === 'instructions' || currentStep === 'camera-check') && (
          <div style={{
            maxWidth: '1100px',
            margin: 'var(--space-8) auto 0',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <Button 
              onClick={handleGoBack} 
              variant="secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
              Quay lại
            </Button>
            
            {currentStep === 'instructions' && (
              <Button onClick={handleStartCameraCheck}>
                Kiểm tra camera
                <Camera style={{ width: '18px', height: '18px' }} />
              </Button>
            )}
            
            {currentStep === 'camera-check' && isCameraWorking && (
              <Button onClick={() => setCurrentStep('ready')}>
                Tiếp tục
              </Button>
            )}
          </div>
        )}

        {/* Final Action Button */}
        {currentStep === 'ready' && (
          <div style={{
            maxWidth: '1100px',
            margin: 'var(--space-8) auto 0',
            textAlign: 'center'
          }}>
            <Button 
              onClick={handleProceedToExam}
              style={{
                padding: 'var(--space-4) var(--space-8)',
                fontSize: '18px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                margin: '0 auto'
              }}
            >
              Bắt đầu làm bài
              <ArrowRight style={{ width: '20px', height: '20px' }} />
            </Button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};