import { ExamDetails, ExamQuestion, ExamSubmission, ExamResult } from '../utils/types';
import onlineExamApi, { type Quiz, type Question as ApiQuestion, type SubmitAnswer } from './api/onlineExamApi';

class ExamService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  /**
   * Adapter to convert backend Quiz to frontend ExamDetails
   */
  private adaptQuizToExamDetails(quiz: Quiz): ExamDetails {
    // Calculate total points from questions
    const totalPoints = quiz.questions?.reduce((sum, q) => sum + (q.points || 10), 0) || 0;
    
    // Default instructions if not provided
    const defaultInstructions = [
      'Đọc kỹ câu hỏi trước khi trả lời',
      'Kiểm tra lại đáp án trước khi nộp bài',
      'Thời gian làm bài sẽ được tính từ khi bắt đầu',
      'Không được rời khỏi trang thi trong quá trình làm bài'
    ];
    
    // ✨ FIX: Ensure duration is valid number (default to 60 minutes)
    const duration = quiz.timeLimitMinutes && !isNaN(quiz.timeLimitMinutes) 
      ? quiz.timeLimitMinutes 
      : 60;
    
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description || '',
      duration, // ✨ Use validated duration
      totalQuestions: quiz.questions?.length || 0,
      totalPoints,
      category: quiz.subject || quiz.category || 'General', // Use backend subject/category or default
      difficulty: quiz.difficulty || 'medium', // Use backend difficulty or default
      isProctored: quiz.isProctored || false, // Use backend isProctored or default
      instructions: quiz.instructions || defaultInstructions, // Use backend instructions or default
      questions: quiz.questions?.map(q => this.adaptQuestionToExamQuestion(q)) || []
    };
  }

  /**
   * Adapter to convert backend Question to frontend ExamQuestion
   */
  private adaptQuestionToExamQuestion(question: ApiQuestion): ExamQuestion {
    // Determine question type from backend type
    let type: 'multiple-choice' | 'code' | 'essay' = 'multiple-choice';
    if (question.type === 'essay' || question.type === 'short-answer') {
      type = 'essay';
    }

    // ✨ DEFENSIVE: Ensure content is a string, not an object
    let questionText = question.content;
    
    // Debug log to see what backend actually sends
    if (typeof questionText !== 'string') {
      console.error('⚠️ Question content is not a string!', {
        questionId: question.id,
        contentType: typeof questionText,
        content: questionText,
        rawQuestion: question
      });
      
      // Try to extract text from object if it's an object
      if (typeof questionText === 'object' && questionText !== null) {
        // Maybe it's {question: "text"} or {content: "text"}
        const obj = questionText as any;
        if (obj.question) {
          questionText = obj.question;
        } else if (obj.content) {
          questionText = obj.content;
        } else if (obj.text) {
          questionText = obj.text;
        } else {
          // Last resort: stringify
          questionText = JSON.stringify(questionText);
        }
      } else {
        questionText = String(questionText); // Convert to string
      }
    }

    return {
      id: question.id, // Keep UUID as string
      type,
      question: questionText, // ✨ Use validated string
      options: question.options?.map(opt => ({
        id: opt.id, // Keep optionId for submission
        text: opt.content || opt.optionText
      })) || [],
      correctAnswer: question.options?.findIndex(opt => opt.isCorrect) || 0,
      points: question.points || 10, // Use backend points or default
      explanation: question.explanation, // Use backend explanation
      code: undefined, // No code field in backend
      timeLimit: undefined // No per-question time limit
    };
  }

  /**
   * Lấy thông tin chi tiết của bài thi
   */
  async getExamDetails(examId: string): Promise<ExamDetails> {
    try {
      // Call real API - use getQuizDetails instead of startQuiz to avoid creating submission
      const quiz = await onlineExamApi.getQuizDetails(examId);
      
      return this.adaptQuizToExamDetails(quiz);
    } catch (error) {
      console.error('Error fetching exam details:', error);
      throw new Error('Không thể tải thông tin bài thi');
    }
  }

  /**
   * Bắt đầu một bài thi (tạo session)
   */
  async startExam(examId: string): Promise<{ sessionId: string; startTime: string }> {
    try {
      // Call real API - startQuiz already creates a submission
      const response = await onlineExamApi.startQuiz(examId);
      
      return {
        sessionId: response.data.submissionId,
        startTime: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Error starting exam:', error);
      
      // Handle 409 Conflict - submission already exists
      if (error?.response?.status === 409) {
        // Backend returns existing submission ID in the error response
        const existingSubmissionId = error.response?.data?.data?.submissionId;
        
        if (existingSubmissionId) {
          return {
            sessionId: existingSubmissionId,
            startTime: new Date().toISOString()
          };
        }
        
        throw new Error('Bạn đã bắt đầu bài thi này rồi');
      }
      
      // Handle 400 Bad Request - exam already completed or other errors
      if (error?.response?.status === 400) {
        const errorMessage = error.response?.data?.error || error.response?.data?.message;
        throw new Error(errorMessage || 'Không thể bắt đầu bài thi');
      }
      
      // Generic error
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error.message;
      throw new Error(errorMessage || 'Không thể bắt đầu bài thi');
    }
  }

  /**
   * Lưu câu trả lời tạm thời
   * Note: Backend doesn't support incremental answer saving, 
   * answers are submitted all at once
   */
  async saveAnswer(sessionId: string, questionId: number, answer: any): Promise<void> {
    try {
      // Store answers locally for now, will be submitted with submitExam
      // Could implement localStorage caching here if needed
      const cachedAnswers = JSON.parse(localStorage.getItem(`exam_${sessionId}`) || '{}');
      cachedAnswers[questionId] = answer;
      localStorage.setItem(`exam_${sessionId}`, JSON.stringify(cachedAnswers));
    } catch (error) {
      console.error('Error saving answer:', error);
      // Don't throw error for local storage issues
    }
  }

  /**
   * Nộp bài thi
   */
  async submitExam(submission: ExamSubmission): Promise<ExamResult> {
    try {
      // Convert frontend answers to backend format
      // Note: ans.answer is now optionId (UUID string), not index
      const backendAnswers: SubmitAnswer[] = submission.answers.map(ans => ({
        questionId: ans.questionId, // Already UUID string
        selectedOptionId: ans.answer // Already optionId (UUID string)
      }));

      // Submit to real API
      const response = await onlineExamApi.submitQuiz(submission.sessionId, {
        answers: backendAnswers
      });

      // Clear cached answers
      localStorage.removeItem(`exam_${submission.sessionId}`);

      // ✅ Return formatted result with submissionId from backend
      return {
        submissionId: response.data.submissionId, // ✅ CRITICAL: Pass this to frontend!
        examId: submission.examId,
        sessionId: submission.sessionId,
        score: response.data.score,
        totalQuestions: submission.answers.length,
        correctAnswers: Math.round((response.data.score / 100) * submission.answers.length),
        timeSpent: submission.timeSpent,
        submittedAt: new Date().toISOString(),
        passed: response.data.score >= 70
      };
    } catch (error) {
      console.error('Error submitting exam:', error);
      throw new Error('Không thể nộp bài thi');
    }
  }

  /**
   * Gửi ảnh chụp màn hình để giám sát
   * Note: Proctoring service integration - could be implemented separately
   */
  async sendMonitoringScreenshot(sessionId: string, imageData: string): Promise<void> {
    try {
      // Could send to proctoring service if needed
      // await proctoringApi.sendScreenshot(sessionId, imageData);
    } catch (error) {
      console.error('Error sending screenshot:', error);
      // Không throw error để không ảnh hưởng đến việc làm bài
    }
  }

  /**
   * Lấy kết quả bài thi đã nộp
   */
  async getExamResult(sessionId: string): Promise<ExamResult> {
    // Don't catch error here - let it propagate to the caller
    // so they can check error.response.status for 404
      const result = await onlineExamApi.getQuizResult(sessionId);
      
    // Convert timeSpentSeconds to minutes
    const timeSpentMinutes = result.timeSpentSeconds 
      ? Math.round(result.timeSpentSeconds / 60) 
      : 0;
    
      return {
      examId: result.examId,
        sessionId,
      score: result.score || 0,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
      wrongAnswers: result.wrongAnswers, // ✅ Add wrongAnswers from backend
      timeSpent: timeSpentMinutes, // Convert seconds to minutes
      submittedAt: result.submittedAt || new Date().toISOString(),
      passed: result.passed,
      // NEW: Add percentile if available
      percentile: result.percentile || undefined,
      // NEW: Include question results for detail view
      quizTitle: result.examTitle,
      questions: result.questionResults
    };
  }

  /**
   * Lấy danh sách tất cả exams có sẵn
   */
  async getAllExams(): Promise<ExamDetails[]> {
    try {
      const quizzes = await onlineExamApi.getAllQuizzes();
      return quizzes.map(quiz => this.adaptQuizToExamDetails(quiz));
    } catch (error) {
      console.error('Error fetching all exams:', error);
      throw new Error('Không thể tải danh sách bài thi');
    }
  }

  /**
   * Lấy danh sách submissions của student
   */
  async getMySubmissions(): Promise<any[]> {
    try {
      const submissions = await onlineExamApi.getMyAllSubmissions();
      return submissions;
    } catch (error) {
      console.error('Error fetching my submissions:', error);
      return [];
    }
  }

  /**
   * Lấy chi tiết quiz (questions with full text and options)
   */
  async getQuizDetails(quizId: string): Promise<Quiz> {
    try {
      const quiz = await onlineExamApi.getQuizDetails(quizId);
      return quiz;
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      throw new Error('Không thể tải thông tin quiz');
    }
  }
}

export const examService = new ExamService();

