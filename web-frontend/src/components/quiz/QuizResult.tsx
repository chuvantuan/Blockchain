import { 
  CheckCircle, 
  XCircle, 
  Award,
  TrendingUp,
  RefreshCw,
  Home,
  ChevronRight
} from 'lucide-react'
import { QuizResult as QuizResultType } from '../../services/api/courseApi'
import '../../assets/css/QuizResult.css'

interface QuizResultProps {
  result: QuizResultType
  quizTitle: string
  onRetry?: () => void
  onContinue?: () => void
  onBackToCourse?: () => void
}

export default function QuizResult({
  result,
  quizTitle,
  onRetry,
  onContinue,
  onBackToCourse
}: QuizResultProps): JSX.Element {
  const percentage = (result.score / result.totalPoints) * 100
  const isPassed = result.passed

  return (
    <div className="quiz-result">
      <div className="result-card">
        {/* Icon */}
        <div className={`result-icon ${isPassed ? 'passed' : 'failed'}`}>
          {isPassed ? (
            <CheckCircle size={80} />
          ) : (
            <XCircle size={80} />
          )}
        </div>

        {/* Status */}
        <h1 className={`result-status ${isPassed ? 'passed' : 'failed'}`}>
          {isPassed ? 'Chúc mừng! 🎉' : 'Chưa đạt 😔'}
        </h1>

        <p className="result-message">
          {isPassed 
            ? `Bạn đã hoàn thành xuất sắc bài quiz "${quizTitle}"`
            : `Bạn chưa đạt yêu cầu cho bài quiz "${quizTitle}"`
          }
        </p>

        {/* Score */}
        <div className="score-circle">
          <svg viewBox="0 0 200 200" className="progress-ring">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={isPassed ? 'var(--success)' : 'var(--destructive)'}
              strokeWidth="12"
              strokeDasharray={`${percentage * 5.65} 565`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="score-text">
            <span className="score-percentage">{percentage.toFixed(0)}%</span>
            <span className="score-label">Điểm số</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="result-stats">
          <div className="stat-item">
            <Award size={24} />
            <div>
              <p className="stat-label">Điểm</p>
              <p className="stat-value">{result.score} / {result.totalPoints}</p>
            </div>
          </div>

          <div className="stat-item">
            <TrendingUp size={24} />
            <div>
              <p className="stat-label">Tỷ lệ</p>
              <p className="stat-value">{percentage.toFixed(1)}%</p>
            </div>
          </div>

          <div className="stat-item">
            <CheckCircle size={24} />
            <div>
              <p className="stat-label">Đúng</p>
              <p className="stat-value">{result.correctAnswers} / {result.totalQuestions}</p>
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="result-time">
          <p>Hoàn thành lúc: {new Date(result.submittedAt).toLocaleString('vi-VN')}</p>
        </div>

        {/* Actions */}
        <div className="result-actions">
          {!isPassed && onRetry && (
            <button onClick={onRetry} className="btn-action btn-retry">
              <RefreshCw size={20} />
              Làm lại
            </button>
          )}

          {isPassed && onContinue && (
            <button onClick={onContinue} className="btn-action btn-continue">
              Tiếp tục học
              <ChevronRight size={20} />
            </button>
          )}

          {onBackToCourse && (
            <button onClick={onBackToCourse} className="btn-action btn-back">
              <Home size={20} />
              Quay lại khóa học
            </button>
          )}
        </div>

        {/* Additional Info */}
        {!isPassed && (
          <div className="result-note">
            <p>💡 Hãy xem lại tài liệu và thử lại nhé!</p>
          </div>
        )}

        {isPassed && (
          <div className="result-note success">
            <p>✨ Tuyệt vời! Bạn đã nắm vững kiến thức này!</p>
          </div>
        )}
      </div>
    </div>
  )
}

