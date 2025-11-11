import { useState, useEffect } from 'react';
import onlineExamApi, { type Quiz } from '../services/api/onlineExamApi';
import { examService } from '../services/examService';

interface UpcomingExam {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'scheduled' | 'practice' | 'certification';
  status: 'upcoming' | 'registered' | 'ready';
  proctoring?: boolean;
}

export function useQuizzes() {
  const [quizzes, setQuizzes] = useState<UpcomingExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  // ✅ FIX: Add guard to prevent duplicate fetch in React StrictMode
  useEffect(() => {
    if (hasFetched) return;
    
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await onlineExamApi.getAllQuizzes();
        
        // Fetch user submissions to determine quiz status
        const submissions = await examService.getMySubmissions();
        
        // Transform backend Quiz to frontend UpcomingExam format
        // Filter out completed quizzes (only show not-started and in-progress)
        const transformedQuizzes: UpcomingExam[] = data
          .map((quiz: Quiz) => {
            const submission = submissions.find((s: any) => s.quizId === quiz.id);
            
            // CRITICAL: Skip completed quizzes (must have valid submittedAt timestamp)
            const hasValidSubmittedAt = submission?.submittedAt && 
              submission.submittedAt !== null && 
              submission.submittedAt !== '' &&
              submission.submittedAt !== 'null';
            
            if (hasValidSubmittedAt) {
              return null; // Filter out completed quizzes
            }
            
            // Determine status
            let status: 'upcoming' | 'registered' | 'ready' = 'ready';
            if (submission) {
              // Has submission but not submitted = in-progress
              status = 'registered'; // Use 'registered' to show different UI
            }
            
            return {
              id: quiz.id,
              title: quiz.title,
              date: 'Hôm nay', // Default to today, can be enhanced with real scheduling data
              time: '2:00 chiều',
              duration: `${quiz.timeLimitMinutes} phút`,
              type: 'practice' as const, // Default type, can be determined from quiz metadata
              status,
              proctoring: false // Default to no proctoring
            };
          })
          .filter((quiz): quiz is UpcomingExam => quiz !== null); // Remove nulls

        setQuizzes(transformedQuizzes);
        setError(null);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Không thể tải danh sách bài thi');
        
        // Fallback to mock data on error
        setQuizzes([
          {
            id: 'javascript-advanced',
            title: 'JavaScript nâng cao',
            date: 'Hôm nay',
            time: '2:00 chiều',
            duration: '90 phút',
            type: 'certification',
            status: 'ready',
            proctoring: true
          },
          {
            id: 'react-fundamentals',
            title: 'Phát triển React cơ bản',
            date: 'Ngày mai',
            time: '10:00 sáng',
            duration: '60 phút',
            type: 'scheduled',
            status: 'registered',
            proctoring: true
          },
          {
            id: 'data-structures',
            title: 'Bài kiểm tra Cấu trúc dữ liệu',
            date: '15 tháng 12, 2024',
            time: '3:30 chiều',
            duration: '45 phút',
            type: 'practice',
            status: 'upcoming',
            proctoring: false
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
    setHasFetched(true);
  }, [hasFetched]);

  return { quizzes, loading, error };
}

