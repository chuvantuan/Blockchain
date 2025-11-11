import React from 'react';
import { Camera, Minimize2 } from 'lucide-react';
import { QuestionNavigator } from './QuestionNavigator';
import { ProctoringView } from './ProctoringView';
import styles from '../../assets/css/ExamSidebar.module.css';
import { ExamQuestion } from '../../utils/types';

interface ExamSidebarProps {
  questions: ExamQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, any>;
  visitedQuestions: readonly number[];
  flaggedQuestions: readonly number[];
  onGoToQuestion: (index: number) => void;
  isProctoringMinimized: boolean;
  onToggleMinimize: () => void;
  onCameraReady: () => void;
  onCameraError: (error: string) => void;
}

export const ExamSidebar: React.FC<ExamSidebarProps> = ({
  questions,
  currentQuestionIndex,
  answers,
  visitedQuestions,
  flaggedQuestions,
  onGoToQuestion,
  isProctoringMinimized,
  onToggleMinimize,
  onCameraReady,
  onCameraError
}) => {
  return (
    <div className={styles.sidebar}>
      <QuestionNavigator
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        visitedQuestions={visitedQuestions}
        flaggedQuestions={flaggedQuestions}
        onGoToQuestion={onGoToQuestion}
      />

      {!isProctoringMinimized ? (
        <div className={styles.cameraContainer}>
          <div className={styles.cameraHeader}>
            <h3 className={styles.cameraTitle}>
              <Camera className={styles.cameraIcon} />
              Camera giám sát
            </h3>
            <button
              onClick={onToggleMinimize}
              className={styles.minimizeButton}
              title="Thu nhỏ camera"
            >
              <Minimize2 className={styles.minimizeIcon} />
            </button>
          </div>

          <div className={styles.cameraContent}>
            <ProctoringView
              width={352}
              height={264}
              onStreamReady={onCameraReady}
              onError={onCameraError}
              showControls={false}
            />
          </div>
        </div>
      ) : (
        <ProctoringView
          width={352}
          height={264}
          onStreamReady={onCameraReady}
          onError={onCameraError}
          showControls={false}
          isMinimized={true}
          onToggleMinimize={onToggleMinimize}
        />
      )}
    </div>
  );
};

