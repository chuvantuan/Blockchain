import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchExamDetails,
  startExamSession,
  setCurrentQuestion,
  updateAnswer,
  goToNextQuestion,
  goToPreviousQuestion,
  toggleQuestionFlag,
  tickTimer,
  submitExam,
  setCameraReady,
  setCameraError,
  setStatus
} from '../store/slices/examSlice';
import { examService } from '../services/examService';
import { RootState, AppDispatch } from '../store';

export const useExamSession = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [isProctoringMinimized, setIsProctoringMinimized] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    currentExam,
    questions,
    currentQuestionIndex,
    answers,
    timeRemaining,
    status,
    error,
    visitedQuestions,
    flaggedQuestions,
    session
  } = useSelector((state: RootState) => state.exam);

  // Memoize current question to prevent recalculation
  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [questions, currentQuestionIndex]
  );

  // Memoize calculated values
  const { totalQuestions, answeredQuestions, progress, timeWarning } = useMemo(() => {
    const total = questions.length;
    const answered = Object.keys(answers).length;
    const prog = total > 0 ? (answered / total) * 100 : 0;
    const warning = timeRemaining < 300; // Less than 5 minutes

    return {
      totalQuestions: total,
      answeredQuestions: answered,
      progress: prog,
      timeWarning: warning
    };
  }, [questions.length, answers, timeRemaining]);

  // Initialize exam
  useEffect(() => {
    if (examId && status === 'idle') {
      dispatch(fetchExamDetails(examId));
    }
  }, [examId, status, dispatch]);

  // Start timer when exam is active
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (status === 'active' && timeRemaining > 0) {
      timer = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status, timeRemaining, dispatch]);

  // Start exam session when exam details are loaded
  useEffect(() => {
    if (status === 'idle' && currentExam && !session) {
      dispatch(startExamSession(currentExam.id));
    }
  }, [status, currentExam, session, dispatch]);

  // Update status to active when session starts
  useEffect(() => {
    if (status === 'pre-check' && session) {
      dispatch(setStatus('active'));
    }
  }, [status, session, dispatch]);

  // Auto-save answers periodically
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (session && currentQuestion && answers[currentQuestion.id]) {
        examService.saveAnswer(session.id, currentQuestion.id, answers[currentQuestion.id].answer);
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [session, currentQuestion, answers]);

  const handleAnswerChange = useCallback((answer: any) => {
    if (currentQuestion) {
      dispatch(updateAnswer({ 
        questionId: currentQuestion.id, 
        answer 
      }));
    }
  }, [currentQuestion, dispatch]);

  const handleFlagQuestion = useCallback(() => {
    if (currentQuestion) {
      dispatch(toggleQuestionFlag(currentQuestion.id));
    }
  }, [currentQuestion, dispatch]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      dispatch(goToNextQuestion());
    }
  }, [currentQuestionIndex, totalQuestions, dispatch]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      dispatch(goToPreviousQuestion());
    }
  }, [currentQuestionIndex, dispatch]);

  const handleGoToQuestion = useCallback((questionIndex: number) => {
    dispatch(setCurrentQuestion(questionIndex));
  }, [dispatch]);

  const handleSubmitExam = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(submitExam()).unwrap();
      // ✅ Wait for backend to return submissionId
      if (result.submissionId) {
        // Navigate to result page with submission ID
        navigate(`/exam/${examId}/result?submissionId=${result.submissionId}`);
      } else {
        throw new Error('Không nhận được submission ID từ server');
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  }, [dispatch, navigate, examId]);

  const handleTimeUp = useCallback(() => {
    setShowSubmitModal(true);
  }, []);

  const handleCameraReady = useCallback(() => {
    dispatch(setCameraReady(true));
  }, [dispatch]);

  const handleCameraError = useCallback((error: string) => {
    dispatch(setCameraError(error));
  }, [dispatch]);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    // State
    currentExam,
    questions,
    currentQuestion,
    currentQuestionIndex,
    answers,
    timeRemaining,
    status,
    error,
    visitedQuestions,
    flaggedQuestions,
    session,
    totalQuestions,
    answeredQuestions,
    progress,
    timeWarning,
    isProctoringMinimized,
    setIsProctoringMinimized,
    showSubmitModal,
    setShowSubmitModal,
    isSubmitting,
    
    // Handlers
    handleAnswerChange,
    handleFlagQuestion,
    handleNextQuestion,
    handlePreviousQuestion,
    handleGoToQuestion,
    handleSubmitExam,
    handleTimeUp,
    handleCameraReady,
    handleCameraError,
    formatTime,
    navigate
  };
};

