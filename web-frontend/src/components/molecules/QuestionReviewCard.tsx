import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { AnswerOption } from '../atoms/AnswerOption';
import styles from '../../assets/css/QuestionReviewCard.module.css';

interface QuestionReviewCardProps {
  question: {
    id: number;
    type: 'multiple-choice' | 'code' | 'essay' | 'single_choice' | 'multiple_choice';
    question: string;
    options?: string[];
    correctAnswer?: number | number[]; // Can be single index or array of indices
    points: number;
    yourAnswer?: any;
    isCorrect: boolean;
    explanation: string;
  };
  questionNumber: number;
  questionStyles: {
    background: string;
    border: string;
    headerColor: string;
    subtextColor: string;
  };
}

export const QuestionReviewCard: React.FC<QuestionReviewCardProps> = ({
  question,
  questionNumber,
  questionStyles
}) => {
  const getQuestionIcon = () => {
    if (question.type === 'essay') {
      return <AlertCircle className={styles.iconEssay} />;
    }
    return question.isCorrect 
      ? <CheckCircle className={styles.iconCorrect} />
      : <XCircle className={styles.iconIncorrect} />;
  };

  const getQuestionStatusText = () => {
    if (question.type === 'essay') return 'Tự luận';
    return question.isCorrect ? 'Đúng' : 'Sai';
  };

  const hasUserAnswered = question.yourAnswer !== undefined && question.yourAnswer !== null;

  return (
    <div 
      className={styles.card}
      style={{ borderColor: questionStyles.border }}
    >
      {/* Question Header */}
      <div 
        className={styles.header}
        style={{ 
          background: questionStyles.background,
          borderBottomColor: questionStyles.border
        }}
      >
        <div className={styles.headerLeft}>
          {getQuestionIcon()}
          <div>
            <div 
              className={styles.questionNumber}
              style={{ color: questionStyles.headerColor }}
            >
              Câu {questionNumber}
            </div>
            <div 
              className={styles.questionStatus}
              style={{ color: questionStyles.subtextColor }}
            >
              {getQuestionStatusText()}
            </div>
          </div>
        </div>
        
        <div 
          className={styles.points}
          style={{ 
            color: question.isCorrect ? '#10b981' : '#ef4444' 
          }}
        >
          {question.points} điểm
        </div>
      </div>

      {/* Question Content */}
      <div className={styles.content}>
        {/* Question Text */}
        <h4 className={styles.questionText}>{question.question}</h4>

        {/* Multiple Choice */}
        {question.type === 'multiple-choice' && question.options && (
          <>
            {/* Show message if no answer */}
            {!hasUserAnswered && (
              <div className={styles.noAnswerWarning}>
                <AlertCircle className={styles.warningIcon} />
                <span className={styles.warningText}>
                  Bạn chưa chọn đáp án cho câu này
                </span>
              </div>
            )}
            
            <div className={styles.optionsList}>
              {question.options.map((option: any, optIndex: number) => {
                // ✨ DEFENSIVE: Ensure option is always a string
                const optionText = typeof option === 'string' 
                  ? option 
                  : (option?.text || option?.optionText || option?.content || String(option?.id || ''));
                
                // Check if this option is correct (handle both single number and array)
                const isCorrect = Array.isArray(question.correctAnswer)
                  ? question.correctAnswer.includes(optIndex)
                  : question.correctAnswer === optIndex;
                
                return (
                  <AnswerOption
                    key={optIndex}
                    option={optionText}
                    isYourAnswer={hasUserAnswered && question.yourAnswer === optIndex}
                    isCorrectAnswer={isCorrect}
                    hasUserAnswered={hasUserAnswered}
                  />
                );
              })}
            </div>
          </>
        )}

        {/* Code Question */}
        {question.type === 'code' && question.yourAnswer && (
          <div className={styles.codeContainer}>
            <div className={styles.codeLabel}>Code của bạn:</div>
            <pre className={styles.codeBlock}>
              <code>{question.yourAnswer}</code>
            </pre>
          </div>
        )}

        {/* Essay Question */}
        {question.type === 'essay' && question.yourAnswer && (
          <div className={styles.essayContainer}>
            <div className={styles.essayLabel}>Câu trả lời của bạn:</div>
            <p className={styles.essayText}>{question.yourAnswer}</p>
          </div>
        )}

        {/* Explanation */}
        {question.explanation && (
          <div className={styles.explanation}>
            <div className={styles.explanationTitle}>💡 Giải thích:</div>
            <p className={styles.explanationText}>{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

