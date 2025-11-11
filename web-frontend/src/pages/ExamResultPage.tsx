import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trophy, Award, Clock, CheckCircle, XCircle, Target, TrendingUp, Calendar, ArrowLeft, FileText, BarChart3 } from 'lucide-react';
import Button from '../components/atoms/Button';
import { RootState } from '../store';
import { examService } from '../services/examService';

interface ExamResultData {
  examId: string;
  examTitle?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  passed: boolean;
  submittedAt: string;
  percentile: number;
}

export const ExamResultPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<ExamResultData | null>(null);

  // ❌ REMOVED: Don't calculate from Redux, always use backend data
  // Redux state may have incorrect correctAnswer values since backend hides them during exam

  // Fetch result from API
  const fetchResultFromAPI = async () => {
    if (!examId) {
      setError('Thiếu thông tin bài thi');
      return;
    }

    try {
      // ✅ NEW: Get submissionId from URL query (passed from submit handler)
      const submissionIdFromUrl = searchParams.get('submissionId');
      
      let submissionId: string;
      
      if (submissionIdFromUrl) {
        // Use submission ID from URL (immediate after submit)
        submissionId = submissionIdFromUrl;
      } else {
        // Fallback: Find submission from list (when user returns to result page)
        const submissions = await examService.getMySubmissions();
        const submission = submissions.find((s: any) => s.quizId === examId);

        if (!submission || !submission.submittedAt) {
          // No submission found, redirect to detail page
          navigate(`/exam/${examId}/detail`, { replace: true });
          return;
        }
        
        submissionId = submission.id;
      }

      // Fetch detailed result from backend
      const apiResult = await examService.getExamResult(submissionId);
      
      // Use percentile from backend if available, otherwise calculate default
      const percentile = apiResult.percentile ?? (
        apiResult.score >= 90 ? 95 : 
        apiResult.score >= 80 ? 85 : 
        apiResult.score >= 70 ? 75 : 
        apiResult.score >= 60 ? 60 : 40
      );

      // ✅ Use data directly from backend (accurate grading)
      const wrongAnswers = apiResult.wrongAnswers ?? (apiResult.totalQuestions - apiResult.correctAnswers);
      
      setResult({
        examId: apiResult.examId,
        examTitle: apiResult.quizTitle || apiResult.examTitle,
        score: apiResult.score,
        totalQuestions: apiResult.totalQuestions,
        correctAnswers: apiResult.correctAnswers,
        wrongAnswers,
        timeSpent: apiResult.timeSpent || 0,
        passed: apiResult.passed,
        submittedAt: apiResult.submittedAt,
        percentile
      });
    } catch (err: any) {
      console.error('Error fetching exam result:', err);
      // If error is 404, redirect to detail page
      if (err.response?.status === 404) {
        navigate(`/exam/${examId}/detail`, { replace: true });
      } else {
        // Other errors - show error message
        const errorMessage = err.response?.data?.message || err.message || 'Không thể tải kết quả bài thi';
        setError(errorMessage);
      }
    }
  };

  // ✅ FIX: Add proper dependency array and prevent duplicate fetch
  useEffect(() => {
    const loadResult = async () => {
      setLoading(true);
      setError(null);

      // ALWAYS fetch from API to get accurate score from backend grading
      // Don't trust client-side calculation in Redux
      await fetchResultFromAPI();
      setLoading(false);
    };

    loadResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, searchParams]);

  const handleGoToDashboard = () => {
    navigate('/user/home');
  };

  const handleViewAnswers = () => {
    // ✅ CRITICAL: Pass submissionId from URL query to detail page
    const submissionIdFromUrl = searchParams.get('submissionId');
    if (submissionIdFromUrl) {
      navigate(`/exam/${examId}/detail?submissionId=${submissionIdFromUrl}`);
    } else {
      // Fallback: navigate without submissionId (will try to find from list)
      navigate(`/exam/${examId}/detail`);
    }
  };

  const handleRetakeExam = () => {
    navigate(`/exam/${examId}/pre-check`);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'var(--card)',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          border: '1px solid var(--border)'
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
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
            Đang tải kết quả...
          </h2>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'var(--card)',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          maxWidth: '400px',
          border: '1px solid var(--destructive)'
        }}>
          <XCircle style={{ width: '64px', height: '64px', color: 'var(--destructive)', margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Lỗi</h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '24px' }}>{error}</p>
          <Button onClick={handleGoToDashboard} variant="secondary">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const scoreColor = result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444';
  const scoreBg = result.score >= 80 ? '#d1fae5' : result.score >= 60 ? '#fef3c7' : '#fee2e2';
  const circleProgress = (result.score / 100) * 251; // 2 * PI * 40

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-background)',
      fontFamily: 'var(--font-sans)',
      paddingTop: 'var(--space-8)',
      paddingBottom: 'var(--space-12)'
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 var(--space-6)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 700,
            marginBottom: 'var(--space-3)',
            color: 'var(--foreground)',
            fontFamily: 'var(--font-display)'
          }}>
            Kết quả bài thi
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'var(--muted-foreground)',
            fontWeight: 500
          }}>
            {result.examTitle || currentExam?.title || 'Bài thi'}
          </p>
        </div>

        {/* Main Result Card */}
        <div style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-2xl)',
          padding: 'var(--space-10)',
          marginBottom: 'var(--space-6)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          {result.passed && (
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
              animation: 'pulse 3s ease-in-out infinite'
            }} />
          )}

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Score Circle with Animation */}
            <div style={{
              position: 'relative',
              width: '200px',
              height: '200px',
              margin: '0 auto var(--space-8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg 
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transform: 'rotate(-90deg)',
                  filter: result.passed ? 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))' : 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.3))'
                }}
                viewBox="0 0 100 100"
              >
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="var(--muted)"
                  strokeWidth="6"
                  fill="none"
                  opacity="0.2"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={scoreColor}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${circleProgress} 251`}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dasharray 1s ease-out'
                  }}
                />
              </svg>
              
              <div style={{
                position: 'absolute',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '56px',
                  fontWeight: 800,
                  color: scoreColor,
                  fontFamily: 'var(--font-display)',
                  lineHeight: 1,
                  marginBottom: '4px'
                }}>
                  {result.score}%
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--muted-foreground)',
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}>
                  Điểm số
                </div>
              </div>
            </div>

            {/* Result Status Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: '12px 32px',
              borderRadius: 'var(--radius-full)',
              background: result.passed 
                ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
                : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
              border: `2px solid ${scoreColor}`,
              fontSize: '20px',
              fontWeight: 700,
              color: scoreColor,
              marginBottom: 'var(--space-8)',
              boxShadow: `0 4px 20px ${scoreColor}40`
            }}>
              {result.passed ? (
                <>
                  <Trophy style={{ width: '24px', height: '24px' }} />
                  ĐẠT
                </>
              ) : (
                <>
                  <XCircle style={{ width: '24px', height: '24px' }} />
                  KHÔNG ĐẠT
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-8)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #93c5fd'
              }}>
                <CheckCircle style={{ width: '28px', height: '28px', color: '#1e40af', margin: '0 auto var(--space-2)' }} />
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e40af', marginBottom: 'var(--space-1)' }}>
                  {result.correctAnswers}
                </div>
                <div style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: 600 }}>
                  Câu đúng
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #fca5a5'
              }}>
                <XCircle style={{ width: '28px', height: '28px', color: '#991b1b', margin: '0 auto var(--space-2)' }} />
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#991b1b', marginBottom: 'var(--space-1)' }}>
                  {result.wrongAnswers || result.totalQuestions - result.correctAnswers}
                </div>
                <div style={{ fontSize: '13px', color: '#7f1d1d', fontWeight: 600 }}>
                  Câu sai
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #a5b4fc'
              }}>
                <Target style={{ width: '28px', height: '28px', color: '#4338ca', margin: '0 auto var(--space-2)' }} />
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#4338ca', marginBottom: 'var(--space-1)' }}>
                  {result.totalQuestions}
                </div>
                <div style={{ fontSize: '13px', color: '#3730a3', fontWeight: 600 }}>
                  Tổng câu hỏi
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #fbbf24'
              }}>
                <Clock style={{ width: '28px', height: '28px', color: '#92400e', margin: '0 auto var(--space-2)' }} />
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#92400e', marginBottom: 'var(--space-1)' }}>
                  {result.timeSpent}
                </div>
                <div style={{ fontSize: '13px', color: '#78350f', fontWeight: 600 }}>
                  Phút
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap'
            }}>
              <Button 
                onClick={handleGoToDashboard} 
                variant="secondary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-2)',
                  padding: '12px 24px'
                }}
              >
                <ArrowLeft style={{ width: '18px', height: '18px' }} />
                Về trang chủ
              </Button>
              
              <Button 
                onClick={handleViewAnswers}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-2)',
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  padding: '12px 24px'
                }}
              >
                <FileText style={{ width: '18px', height: '18px' }} />
                Xem chi tiết
              </Button>
              
              {!result.passed && (
                <Button 
                  onClick={handleRetakeExam}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--space-2)',
                    background: 'var(--gradient-accent)',
                    color: 'white',
                    padding: '12px 24px'
                  }}
                >
                  Thi lại
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-6)'
        }}>
          {/* Left Card - Exam Info */}
          <div style={{
            background: 'var(--card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
            padding: 'var(--space-6)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: 'var(--space-5)',
              color: 'var(--foreground)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <BarChart3 style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
              Thông tin bài thi
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3)',
                background: 'var(--background)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Clock style={{ width: '16px', height: '16px', color: 'var(--muted-foreground)' }} />
                  <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Thời gian làm bài:</span>
                </div>
                <span style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: '15px' }}>
                  {result.timeSpent} phút
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3)',
                background: 'var(--background)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Calendar style={{ width: '16px', height: '16px', color: 'var(--muted-foreground)' }} />
                  <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Thời gian nộp:</span>
                </div>
                <span style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: '14px' }}>
                  {new Date(result.submittedAt).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3)',
                background: 'var(--background)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <TrendingUp style={{ width: '16px', height: '16px', color: 'var(--muted-foreground)' }} />
                  <span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>Xếp hạng:</span>
                </div>
                <span style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: '15px' }}>
                  Top {result.percentile}%
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3)',
                background: scoreBg,
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${scoreColor}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  {result.passed ? (
                    <CheckCircle style={{ width: '16px', height: '16px', color: scoreColor }} />
                  ) : (
                    <XCircle style={{ width: '16px', height: '16px', color: scoreColor }} />
                  )}
                  <span style={{ fontSize: '14px', color: scoreColor, fontWeight: 600 }}>Trạng thái:</span>
                </div>
                <span style={{ fontWeight: 700, color: scoreColor, fontSize: '15px' }}>
                  {result.passed ? 'Đã hoàn thành' : 'Chưa đạt yêu cầu'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Card - Next Steps */}
          <div style={{
            background: 'var(--card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
            padding: 'var(--space-6)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: 'var(--space-5)',
              color: 'var(--foreground)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <Award style={{ width: '20px', height: '20px', color: 'var(--accent)' }} />
              Tiếp theo
            </h3>

            {result.passed ? (
              <div>
                <div style={{
                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: 'var(--space-4)',
                  border: '1px solid #6ee7b7'
                }}>
                  <div style={{
                    fontSize: '40px',
                    textAlign: 'center',
                    marginBottom: 'var(--space-3)'
                  }}>
                    🎉
                  </div>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#065f46',
                    marginBottom: 'var(--space-2)',
                    textAlign: 'center'
                  }}>
                    Chúc mừng! Bạn đã vượt qua bài thi.
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#047857',
                    textAlign: 'center',
                    lineHeight: 1.6
                  }}>
                    Kết quả tuyệt vời! Tiếp tục phát huy nhé.
                  </p>
                </div>

                <div style={{
                  background: 'var(--background)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: 'var(--space-3)',
                    color: 'var(--foreground)'
                  }}>
                    📚 Gợi ý tiếp theo:
                  </h4>
                  <ul style={{
                    fontSize: '13px',
                    color: 'var(--muted-foreground)',
                    lineHeight: 1.8,
                    paddingLeft: 0,
                    listStyle: 'none'
                  }}>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Xem lại đáp án để cải thiện</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Tải chứng chỉ của bạn</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Thi thử các bài nâng cao hơn</li>
                    <li>• Chia sẻ thành tích với bạn bè</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                  padding: 'var(--space-5)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: 'var(--space-4)',
                  border: '1px solid #fca5a5'
                }}>
                  <div style={{
                    fontSize: '40px',
                    textAlign: 'center',
                    marginBottom: 'var(--space-3)'
                  }}>
                    💪
                  </div>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#991b1b',
                    marginBottom: 'var(--space-2)',
                    textAlign: 'center'
                  }}>
                    Đừng nản lòng!
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#7f1d1d',
                    textAlign: 'center',
                    lineHeight: 1.6
                  }}>
                    Bạn cần đạt ít nhất 70% để vượt qua. Hãy ôn tập và thử lại.
                  </p>
                </div>

                <div style={{
                  background: 'var(--background)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: 'var(--space-3)',
                    color: 'var(--foreground)'
                  }}>
                    📖 Hãy thử:
                  </h4>
                  <ul style={{
                    fontSize: '13px',
                    color: 'var(--muted-foreground)',
                    lineHeight: 1.8,
                    paddingLeft: 0,
                    listStyle: 'none'
                  }}>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Xem lại đáp án để hiểu rõ hơn</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Ôn tập lại kiến thức cần thiết</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>• Làm bài tập thêm</li>
                    <li>• Thử lại sau khi đã chuẩn bị kỹ</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance Breakdown */}
        <div style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          padding: 'var(--space-6)',
          marginTop: 'var(--space-6)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: 'var(--space-5)',
            color: 'var(--foreground)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <TrendingUp style={{ width: '20px', height: '20px', color: 'var(--accent)' }} />
            Chi tiết kết quả
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-4)'
          }}>
            <div style={{
              padding: 'var(--space-4)',
              background: 'var(--background)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#10b981',
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-display)'
              }}>
                {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted-foreground)', fontWeight: 600 }}>
                Độ chính xác
              </div>
            </div>

            <div style={{
              padding: 'var(--space-4)',
              background: 'var(--background)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#3b82f6',
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-display)'
              }}>
                {(result.timeSpent / result.totalQuestions).toFixed(1)}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted-foreground)', fontWeight: 600 }}>
                Phút/câu
              </div>
            </div>

            <div style={{
              padding: 'var(--space-4)',
              background: 'var(--background)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#f59e0b',
                marginBottom: 'var(--space-2)',
                fontFamily: 'var(--font-display)'
              }}>
                {result.percentile}%
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted-foreground)', fontWeight: 600 }}>
                Xếp hạng
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

