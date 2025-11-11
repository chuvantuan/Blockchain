import React, { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../atoms/Button';
import styles from '../../assets/css/ExamNavigation.module.css';

interface ExamNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const ExamNavigationComponent: React.FC<ExamNavigationProps> = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit
}) => {
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className={styles.navigation}>
      <Button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        variant="secondary"
        className={styles.navButton}
        aria-label="Câu hỏi trước"
      >
        <ChevronLeft className={styles.navIcon} />
        Câu trước
      </Button>

      <Button
        onClick={onSubmit}
        className={styles.submitButton}
        aria-label="Nộp bài thi"
      >
        Nộp bài
      </Button>

      <Button
        onClick={onNext}
        disabled={isLastQuestion}
        className={styles.navButton}
        aria-label="Câu hỏi tiếp theo"
      >
        Câu tiếp
        <ChevronRight className={styles.navIcon} />
      </Button>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export const ExamNavigation = memo(ExamNavigationComponent);

