import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { RootState } from '../store';
import { examService } from '../services/examService';

interface ProcessedQuestion {
  id: number;
  type: 'multiple-choice' | 'code' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: number | number[]; // Support both single and multiple correct answers
  points: number;
  yourAnswer?: any;
  isCorrect: boolean;
  explanation: string;
}

interface ExamDetails {
  title: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  questions: ProcessedQuestion[];
}

export const useExamDetails = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentExam, questions, answers, startTime } = useSelector(
    (state: RootState) => state.exam
  );
  
  const [loading, setLoading] = useState(true);
  const [apiExamDetails, setApiExamDetails] = useState<ExamDetails | null>(null);

  const calculateExamDetails = (): ExamDetails | null => {
    if (!questions || questions.length === 0) {
      return null;
    }

    let correctAnswers = 0;
    const questionsWithAnswers = questions.map(question => {
      const userAnswer = answers[question.id];
      // ✨ FIX: Compare number answer with number correctAnswer
      const answerNum = typeof userAnswer?.answer === 'string' ? parseInt(userAnswer.answer) : userAnswer?.answer;
      const isCorrect = answerNum !== undefined && question.correctAnswer !== undefined 
        ? answerNum === question.correctAnswer 
        : false;
      
      if (isCorrect) correctAnswers++;

      // Use explanation from backend or generate default
      const explanation = question.explanation || 
        `Đây là giải thích cho câu ${question.id}. ${
          isCorrect 
            ? 'Bạn đã trả lời đúng!' 
            : 'Đáp án đúng giúp bạn hiểu rõ hơn về vấn đề này.'
        }`;
      
      return {
        ...question,
        id: typeof question.id === 'string' ? parseInt(question.id) : question.id, // Convert string to number
        yourAnswer: userAnswer?.answer,
        isCorrect,
        explanation
      };
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = startTime ? Math.round((Date.now() - startTime) / 60000) : 0;

    return {
      title: currentExam?.title || 'Bài thi',
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      questions: questionsWithAnswers as ProcessedQuestion[] // Type assertion since this is legacy code
    };
  };

  // Fetch exam details from API if not in Redux
  useEffect(() => {
    const fetchExamDetails = async () => {
      // Otherwise, fetch from API
      if (!examId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // ✅ NEW: Get submissionId from URL query (passed from submit handler)
        const submissionIdFromUrl = searchParams.get('submissionId');
        
        let submissionId: string;
        
        if (submissionIdFromUrl) {
          // Use submission ID from URL (immediate after submit)
          submissionId = submissionIdFromUrl;
        } else {
          // Fallback: Find submission from list (when user returns to detail page)
          const submissions = await examService.getMySubmissions();
          const submission = submissions.find((s: any) => s.quizId === examId);

          if (!submission || !submission.submittedAt) {
            // No submission found, redirect back
            setLoading(false);
            return;
          }
          
          submissionId = submission.id;
        }

        // Fetch detailed result from backend
        const apiResult = await examService.getExamResult(submissionId);
        
        // Transform API result to ExamDetails format
        const details: ExamDetails = {
          title: apiResult.quizTitle || apiResult.examTitle || 'Bài thi',
          score: apiResult.score,
          totalQuestions: apiResult.totalQuestions,
          correctAnswers: apiResult.correctAnswers,
          timeSpent: apiResult.timeSpent || 0, // Already converted to minutes in examService
          questions: (apiResult.questions || []).map((q: any, index: number) => {
            // ✨ FIX: Backend returns objects {id, text, isCorrect}, extract just the text
            const options: string[] = (q.options || []).map((opt: any) => {
              // If already a string, return it
              if (typeof opt === 'string') return opt;
              
              // If it's an object, extract text field (try multiple possible field names)
              if (typeof opt === 'object' && opt !== null) {
                return opt.text || opt.optionText || opt.content || String(opt.id || '');
              }
              
              // Fallback: convert to string
              return String(opt || '');
            });
            
            // Find correct answer INDEX(ES)
            let correctAnswerIndex: number | number[] | undefined;
            if (q.options && q.options.length > 0) {
              const normalizedType = (q.questionType || '').toUpperCase();
              if (normalizedType === 'MULTIPLE_CHOICE') {
                const correctIndices = q.options
                  .map((opt: any, idx: number) => opt.isCorrect ? idx : -1)
                  .filter((idx: number) => idx !== -1);
                correctAnswerIndex = correctIndices.length > 0 ? correctIndices : undefined;
              } else {
                correctAnswerIndex = q.options.findIndex((opt: any) => opt.isCorrect === true);
                if (correctAnswerIndex === -1) correctAnswerIndex = undefined;
              }
            }
            
            // Find student's answer INDEX
            let yourAnswerIndex: number | undefined;
            if (q.studentSelectedOptionId && q.options) {
              // ✨ Use loose equality (==) to handle string vs number ID mismatch
              yourAnswerIndex = q.options.findIndex((opt: any) => opt.id == q.studentSelectedOptionId);
              if (yourAnswerIndex === -1) yourAnswerIndex = undefined;
            }
            
            // ✨ Extract question text with multiple fallbacks
            let questionText = q.questionText || q.question || q.text || '';
            if (!questionText && q.content) {
              if (typeof q.content === 'object' && q.content.question) {
                questionText = q.content.question;
              } else if (typeof q.content === 'string') {
                questionText = q.content;
              }
            }
            
            // Map backend questionType to frontend type
            const mapQuestionType = (backendType: string): 'multiple-choice' | 'code' | 'essay' => {
              const normalized = (backendType || '').toUpperCase();
              const typeMap: Record<string, 'multiple-choice' | 'code' | 'essay'> = {
                'SINGLE_CHOICE': 'multiple-choice',
                'MULTIPLE_CHOICE': 'multiple-choice',
                'CODE': 'code',
                'ESSAY': 'essay'
              };
              return typeMap[normalized] || 'multiple-choice';
            };
            
            return {
              id: index + 1,
              type: mapQuestionType(q.questionType || 'SINGLE_CHOICE'),
              question: questionText || `Câu hỏi ${index + 1}`,
              options,
              correctAnswer: correctAnswerIndex,
              points: q.maxPoints || 10,
              yourAnswer: yourAnswerIndex,
              isCorrect: q.isCorrect || false,
              explanation: q.explanation || 'Không có giải thích'
            };
          }) || []
        };

        setApiExamDetails(details);
      } catch (error) {
        console.error('Error fetching exam details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, searchParams]);

  const examDetails = apiExamDetails;

  const handleGoBack = () => {
    // Navigate back to result page
    navigate(`/exam/${examId}/result`);
  };

  const getQuestionStyles = (isCorrect: boolean, type: string) => {
    if (type === 'essay') {
      return {
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        border: '#93c5fd',
        headerColor: '#1e40af',
        subtextColor: '#1e3a8a'
      };
    }
    
    if (isCorrect) {
      return {
        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        border: '#6ee7b7',
        headerColor: '#065f46',
        subtextColor: '#047857'
      };
    }
    
    return {
      background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      border: '#fca5a5',
      headerColor: '#991b1b',
      subtextColor: '#7f1d1d'
    };
  };

  return {
    examDetails,
    examId,
    loading,
    handleGoBack,
    getQuestionStyles
  };
};

