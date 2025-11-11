import { useState, useEffect } from 'react'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Flag
} from 'lucide-react'
import { Quiz, QuizQuestion, SubmitQuizRequest, QuizResult } from '../../services/api/courseApi'
import '../../assets/css/QuizTaking.css'

interface QuizTakingProps {
  quiz: Quiz
  studentId: number
  onSubmit: (submission: SubmitQuizRequest) => Promise<QuizResult>
  onComplete: (result: QuizResult) => void
}

export default function QuizTaking({
  quiz,
  studentId,
  onSubmit,
  onComplete
}: QuizTakingProps): JSX.Element {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(
    quiz.timeLimit ? quiz.timeLimit * 60 : null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const answeredCount = Object.keys(answers).length

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    })
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmit = async () => {
    setShowConfirmSubmit(false)
    setIsSubmitting(true)

    try {
      const submission: SubmitQuizRequest = {
        studentId,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer
        }))
      }

      const result = await onSubmit(submission)
      onComplete(result)
    } catch (err) {
      console.error('Error submitting quiz:', err)
      alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getQuestionStatus = (index: number) => {
    const question = quiz.questions[index]
    if (answers[question.id]) return 'answered'
    if (index === currentQuestionIndex) return 'current'
    return 'unanswered'
  }

  return (
    <div className="quiz-taking">
      {/* Header */}
      <div className="quiz-header">
        <div className="quiz-info">
          <h2>{quiz.title}</h2>
          <p>
            {answeredCount} / {totalQuestions} câu đã trả lời
          </p>
        </div>

        {timeLeft !== null && (
          <div className={`quiz-timer ${timeLeft < 300 ? 'warning' : ''}`}>
            <Clock size={20} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="quiz-content">
        {/* Question Navigator */}
        <div className="question-navigator">
          <h3>Câu hỏi</h3>
          <div className="question-grid">
            {quiz.questions.map((q, index) => (
              <button
                key={q.id}
                className={`question-btn ${getQuestionStatus(index)}`}
                onClick={() => handleQuestionJump(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="navigator-legend">
            <div className="legend-item">
              <div className="legend-box answered"></div>
              <span>Đã trả lời</span>
            </div>
            <div className="legend-item">
              <div className="legend-box current"></div>
              <span>Hiện tại</span>
            </div>
            <div className="legend-item">
              <div className="legend-box unanswered"></div>
              <span>Chưa trả lời</span>
            </div>
          </div>

          <button
            onClick={() => setShowConfirmSubmit(true)}
            disabled={isSubmitting}
            className="btn-submit-quiz"
          >
            <Flag size={20} />
            Nộp bài
          </button>
        </div>

        {/* Question Content */}
        <div className="question-content">
          <div className="question-header">
            <span className="question-number">
              Câu {currentQuestionIndex + 1} / {totalQuestions}
            </span>
            <span className="question-points">
              {currentQuestion.points} điểm
            </span>
          </div>

          <div className="question-text">
            {currentQuestion.questionText}
          </div>

          {/* Answer Options */}
          <div className="answer-options">
            {currentQuestion.questionType === 'multiple_choice' && currentQuestion.options && (
              <div className="options-list">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.id}
                    className={`option-item ${answers[currentQuestion.id] === option.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option.id}
                      checked={answers[currentQuestion.id] === option.id}
                      onChange={() => handleAnswerSelect(option.id)}
                    />
                    <span className="option-text">{option.optionText}</span>
                    <span className="option-indicator"></span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.questionType === 'true_false' && (
              <div className="options-list">
                <label className={`option-item ${answers[currentQuestion.id] === 'true' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value="true"
                    checked={answers[currentQuestion.id] === 'true'}
                    onChange={() => handleAnswerSelect('true')}
                  />
                  <span className="option-text">Đúng</span>
                  <span className="option-indicator"></span>
                </label>
                <label className={`option-item ${answers[currentQuestion.id] === 'false' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value="false"
                    checked={answers[currentQuestion.id] === 'false'}
                    onChange={() => handleAnswerSelect('false')}
                  />
                  <span className="option-text">Sai</span>
                  <span className="option-indicator"></span>
                </label>
              </div>
            )}

            {currentQuestion.questionType === 'short_answer' && (
              <textarea
                className="answer-textarea"
                placeholder="Nhập câu trả lời của bạn..."
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerSelect(e.target.value)}
                rows={4}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="question-navigation">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn-nav"
            >
              <ChevronLeft size={20} />
              Câu trước
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button onClick={handleNext} className="btn-nav btn-next">
                Câu tiếp theo
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="btn-nav btn-finish"
              >
                Hoàn thành
                <Flag size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="modal-overlay" onClick={() => setShowConfirmSubmit(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AlertCircle size={64} className="modal-icon" />
            <h3>Xác nhận nộp bài</h3>
            <p>
              Bạn đã trả lời {answeredCount} / {totalQuestions} câu hỏi.
              {answeredCount < totalQuestions && (
                <span className="warning-text">
                  <br />
                  Còn {totalQuestions - answeredCount} câu chưa trả lời.
                </span>
              )}
            </p>
            <p>Bạn có chắc chắn muốn nộp bài không?</p>

            <div className="modal-actions">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="btn-cancel"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-confirm"
              >
                {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

