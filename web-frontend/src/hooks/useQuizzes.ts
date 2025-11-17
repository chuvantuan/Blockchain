import { useState, useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import onlineExamApi, { type Quiz } from '../services/api/onlineExamApi';
import { examService } from '../services/examService';
import proctoringApi from '../services/api/proctoringApi';

const isBrowser = typeof window !== 'undefined';
// Use API Gateway WebSocket endpoint for proctoring (Socket.IO path)
// Fallback to direct proctoring-service if Gateway doesn't support Socket.IO
const getProctoringWSUrl = () => {
  // 1. Check for explicit override
  if (isBrowser && (window as any)?.__PROCTORING_WS_URL) {
    return (window as any).__PROCTORING_WS_URL;
  }
  
  // 2. Check environment variable
  if ((import.meta as any)?.env?.VITE_PROCTORING_WS_URL) {
    return (import.meta as any).env.VITE_PROCTORING_WS_URL;
  }
  
  // 3. Try API Gateway first (Socket.IO path)
  const gatewayUrl = import.meta.env.VITE_API_BASE_URL?.replace('http://', 'ws://').replace('https://', 'wss://') || 'ws://localhost:8080';
  const gatewayWS = gatewayUrl;
  
  // 4. Fallback to direct proctoring-service (port 8082)
  const directWS = 'ws://localhost:8082';
  
  // Return Gateway URL, but frontend can fallback if connection fails
  return gatewayWS;
};

const DEFAULT_PROCTORING_WS_URL = getProctoringWSUrl();

interface UpcomingExam {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'scheduled' | 'practice' | 'certification';
  status: 'upcoming' | 'registered' | 'ready';
  proctoring?: boolean;
  isStopped?: boolean; // Bài thi đã bị dừng bởi giám thị
}

export function useQuizzes() {
  const [quizzes, setQuizzes] = useState<UpcomingExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const socketsRef = useRef<Socket[]>([]);

  // ✅ FIX: Add guard to prevent duplicate fetch in React StrictMode
  useEffect(() => {
    if (hasFetched) return;
    
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const data = await onlineExamApi.getAllQuizzes();
        
        // Fetch user submissions to determine quiz status
        const submissions = await examService.getMySubmissions();
        
        // Fetch proctoring sessions to check for terminated sessions
        let terminatedSessions: string[] = [];
        try {
          const allSessions = await proctoringApi.getAllSessions();
          const userIdStr = localStorage.getItem('userId') || localStorage.getItem('user_id');
          const userId = userIdStr ? Number(userIdStr) : null;
          
          if (userId) {
            terminatedSessions = allSessions
              .filter(session => 
                session.status === 'terminated' && 
                session.userId === userId
              )
              .map(session => String(session.examId));
            
            // Debug log
            if (terminatedSessions.length > 0) {
              console.log('[useQuizzes] Found terminated sessions:', terminatedSessions);
            }
          }
        } catch (err) {
          console.warn('Error fetching proctoring sessions:', err);
          // Continue without terminated sessions check
        }
        
        // Transform backend Quiz to frontend UpcomingExam format
        // Filter out completed quizzes (only show not-started and in-progress)
        const transformedQuizzes = data
          .map((quiz: Quiz): UpcomingExam | null => {
            const resolveDurationMinutes = (): number => {
              const extendedQuiz = quiz as Quiz & {
                duration?: number | string | null;
                durationMinutes?: number | string | null;
                timeLimit?: number | string | null;
                examDuration?: number | string | null;
              };

              const candidates: Array<number | string | null | undefined> = [
                quiz.timeLimitMinutes,
                extendedQuiz.durationMinutes,
                extendedQuiz.duration,
                extendedQuiz.timeLimit,
                extendedQuiz.examDuration
              ];

              const firstValid = candidates.find(
                (value) => value !== undefined && value !== null && value !== ''
              );

              if (firstValid === undefined) {
                return 60;
              }

              const parsed =
                typeof firstValid === 'string'
                  ? parseInt(firstValid, 10)
                  : Number(firstValid);

              if (!Number.isFinite(parsed) || parsed <= 0) {
                return 60;
              }

              return parsed;
            };

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
            
            // Check if this exam has a terminated session
            // Normalize both IDs to string for comparison
            const quizIdStr = String(quiz.id);
            const isStopped = terminatedSessions.includes(quizIdStr);
            
            // Debug log for stopped exams
            if (isStopped) {
              console.log('[useQuizzes] Exam stopped:', quizIdStr, quiz.title);
            }
            
            return {
              id: quiz.id,
              title: quiz.title,
              date: 'Hôm nay', // Default to today, can be enhanced with real scheduling data
              time: '2:00 chiều',
              duration: `${resolveDurationMinutes()} phút`,
              type: 'practice' as const, // Default type, can be determined from quiz metadata
              status,
              proctoring: false, // Default to no proctoring
              isStopped
            };
          })
          .filter((quiz): quiz is UpcomingExam => quiz !== null) as UpcomingExam[]; // Remove nulls

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

  // Listen for proctoring_session_terminated events to update state in real-time
  // Create one socket connection per exam to listen for terminated events
  useEffect(() => {
    if (!isBrowser || !hasFetched || quizzes.length === 0) return;

    // Get userId from user object in localStorage
    const userStr = localStorage.getItem('user');
    let userId: string | null = null;
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userId = user?.id ? String(user.id) : null;
      } catch (error) {
        // Failed to parse user from localStorage
      }
    }
    
    // Fallback to direct userId keys if user object doesn't exist
    if (!userId) {
      const userIdStr = localStorage.getItem('userId') || localStorage.getItem('user_id');
      userId = userIdStr ? String(userIdStr) : null;
    }

    if (!userId) {
      return;
    }

    // Create socket connections for each exam
    // Backend requires examId in query and automatically joins the room
    const sockets: Socket[] = [];

    // Check server health before creating connections (via API Gateway)
    const checkServerHealth = async (): Promise<boolean> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Use API Gateway for health check
        const gatewayUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/proctoring/test`;
        const response = await fetch(gatewayUrl, { 
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.ok;
      } catch (error) {
        // Server health check failed
        return false;
      }
    };

    // Create socket connections with delay to avoid overwhelming the server
    quizzes.forEach((quiz, index) => {
      const examIdStr = String(quiz.id);
      
      // Add delay between connections to prevent race conditions
      setTimeout(async () => {
        // Wait for server to be ready (especially important for first connection)
        if (index === 0) {
          const isHealthy = await checkServerHealth();
          if (!isHealthy) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        const createSocket = (retryCount = 0, useDirectConnection = false) => {
          // Fallback to direct proctoring-service if Gateway fails
          const wsUrl = useDirectConnection 
            ? 'ws://localhost:8082'
            : DEFAULT_PROCTORING_WS_URL;
          
          const socket = io(wsUrl, {
            query: {
              examId: examIdStr,
              userId,
              userType: 'student',
            },
            transports: ['websocket'], // Real-time WebSocket only, no HTTP long-polling
            timeout: 15000, // 15 second timeout
            forceNew: true, // Force new connection to avoid conflicts
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
          });

          socket.on('connect', () => {
            console.log(`[WebSocket] ✅ Connected to ${useDirectConnection ? 'direct proctoring-service' : 'API Gateway'}`);
            // Socket connected successfully - REAL-TIME communication active
          });

          socket.on('connect_error', (error) => {
            console.warn(`[WebSocket] ❌ Connection error (attempt ${retryCount + 1}):`, error.message);
            
            // If Gateway fails and we haven't tried direct connection yet, try direct
            if (!useDirectConnection && retryCount >= 1) {
              console.log('[WebSocket] 🔄 Falling back to direct proctoring-service connection...');
              socket.disconnect();
              createSocket(0, true); // Try direct connection
              return;
            }
            
            // Retry up to 2 times with increasing delay
            if (retryCount < 2) {
              setTimeout(() => {
                socket.disconnect();
                createSocket(retryCount + 1, useDirectConnection);
              }, (retryCount + 1) * 2000);
            } else {
              console.error('[WebSocket] ❌ Failed to connect after all retries');
            }
          });

          socket.on('disconnect', (reason) => {
            // Socket disconnected
          });

          return socket;
        };

        const socket = createSocket();

        // Listen for proctoring_session_terminated events
        socket.on('proctoring_session_terminated', (data: {
          sessionId?: string;
          examId?: string;
          userId?: string;
          reason?: string;
          terminatedBy?: string | null;
        }) => {
          // Check if this event is for the current user
          if (data.userId && String(data.userId) !== userId) {
            return;
          }

          // If examId is provided, update that specific exam
          if (data.examId) {
            const receivedExamIdStr = String(data.examId);

            setQuizzes(prevQuizzes => 
              prevQuizzes.map(q => {
                if (String(q.id) === receivedExamIdStr) {
                  return {
                    ...q,
                    isStopped: true
                  };
                }
                return q;
              })
            );
          }
        });

        sockets.push(socket);
      }, index === 0 ? 1000 : (index * 500) + 1000); // 1s for first, then 500ms intervals
    });

    // Store all sockets in ref for cleanup
    socketsRef.current = sockets;

    return () => {
      sockets.forEach(socket => {
        socket.disconnect();
      });
      socketsRef.current = [];
    };
  }, [hasFetched, quizzes]);

  return { quizzes, loading, error };
}

