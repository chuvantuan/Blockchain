import { ContestDetail } from '../types/contestDetail';

export const contestDetails: Record<string, ContestDetail> = {
  'justice-league-1639642697': {
    id: 'justice-league-1639642697',
    title: 'Justice League 1639642697',
    description: 'Thử thách lập trình theo chủ đề siêu anh hùng với các bài toán thuật toán lấy cảm hứng từ nhân vật DC Comics',
    startDate: '2021-12-10T09:00:00Z',
    endDate: '2021-12-16T17:00:00Z',
    status: 'archived',
    currentRank: undefined,
    totalParticipants: 2847,
    ratingUpdateMessage: 'Xếp hạng sẽ được cập nhật sớm, vui lòng đợi!',
    challenges: [
      {
        id: 'dummy-challenge-test',
        title: 'dummychallengetest',
        successRate: 0.00,
        maxScore: 10,
        difficulty: 'Khó',
        status: 'not_attempted',
        description: 'Kiểm tra kỹ năng giải quyết vấn đề của bạn với bài toán thuật toán thử thách này',
        tags: ['Thuật toán', 'Cấu trúc dữ liệu']
      },
      {
        id: 'fibonacci-v2',
        title: 'Fibonnaci V2.0',
        successRate: 0.00,
        maxScore: 0,
        difficulty: 'Dễ',
        status: 'not_attempted',
        description: 'Triển khai dãy Fibonacci với các tối ưu hóa',
        tags: ['Quy hoạch động', 'Toán học']
      }
    ]
  },
  'college-contest-5': {
    id: 'college-contest-5',
    title: 'Thử thách Khoa học máy tính',
    description: 'Thử thách toàn diện bao gồm các khái niệm khoa học máy tính cơ bản',
    startDate: '2024-12-01T09:00:00Z',
    endDate: '2024-12-25T17:00:00Z',
    status: 'archived',
    currentRank: undefined,
    totalParticipants: 1247,
    ratingUpdateMessage: 'Xếp hạng sẽ được cập nhật sớm, vui lòng đợi!',
    challenges: [
      {
        id: 'dummy-challenge-test',
        title: 'dummychallengetest',
        successRate: 0.00,
        maxScore: 10,
        difficulty: 'Khó',
        status: 'not_attempted',
        description: 'Kiểm tra kỹ năng giải quyết vấn đề của bạn với bài toán thuật toán thử thách này',
        tags: ['Thuật toán', 'Cấu trúc dữ liệu']
      },
      {
        id: 'fibonacci-v2',
        title: 'Fibonnaci V2.0',
        successRate: 0.00,
        maxScore: 0,
        difficulty: 'Dễ',
        status: 'not_attempted',
        description: 'Triển khai dãy Fibonacci với các tối ưu hóa',
        tags: ['Quy hoạch động', 'Toán học']
      }
    ]
  },
  'college-contest-6': {
    id: 'college-contest-6',
    title: 'Cuộc thi Khoa học dữ liệu',
    description: 'Thử thách phân tích dữ liệu nâng cao và học máy',
    startDate: '2024-12-01T09:00:00Z',
    endDate: '2024-12-20T17:00:00Z',
    status: 'archived',
    currentRank: 42,
    totalParticipants: 856,
    ratingUpdateMessage: 'Xếp hạng sẽ được cập nhật sớm, vui lòng đợi!',
    challenges: [
      {
        id: 'data-cleaning-challenge',
        title: 'Làm sạch dữ liệu chuyên nghiệp',
        successRate: 23.5,
        maxScore: 50,
        difficulty: 'Trung bình',
        status: 'solved',
        description: 'Làm sạch và tiền xử lý các tập dữ liệu lộn xộn',
        tags: ['Làm sạch dữ liệu', 'Python', 'Pandas']
      },
      {
        id: 'ml-prediction-model',
        title: 'Mô hình dự đoán ML',
        successRate: 15.2,
        maxScore: 75,
        difficulty: 'Khó',
        status: 'attempted',
        description: 'Xây dựng mô hình dự đoán học máy',
        tags: ['Học máy', 'Scikit-learn', 'Python']
      },
      {
        id: 'statistical-analysis',
        title: 'Phân tích thống kê',
        successRate: 67.8,
        maxScore: 25,
        difficulty: 'Dễ',
        status: 'solved',
        description: 'Thực hiện phân tích thống kê toàn diện',
        tags: ['Thống kê', 'R', 'Phân tích']
      }
    ]
  },
  'college-contest-7': {
    id: 'college-contest-7',
    title: 'Cuộc thi Phát triển Web',
    description: 'Thử thách phát triển web full-stack',
    startDate: '2024-12-01T09:00:00Z',
    endDate: '2024-12-15T17:00:00Z',
    status: 'archived',
    currentRank: 15,
    totalParticipants: 634,
    ratingUpdateMessage: 'Xếp hạng sẽ được cập nhật sớm, vui lòng đợi!',
    challenges: [
      {
        id: 'responsive-design',
        title: 'Thử thách Responsive Design',
        successRate: 45.3,
        maxScore: 30,
        difficulty: 'Trung bình',
        status: 'solved',
        description: 'Tạo các bố cục web responsive',
        tags: ['CSS', 'HTML', 'Responsive Design']
      },
      {
        id: 'api-integration',
        title: 'Tích hợp API chuyên nghiệp',
        successRate: 28.7,
        maxScore: 40,
        difficulty: 'Trung bình',
        status: 'attempted',
        description: 'Tích hợp nhiều API trong một ứng dụng web',
        tags: ['JavaScript', 'API', 'REST']
      }
    ]
  },
  'college-contest-8': {
    id: 'college-contest-8',
    title: 'Thử thách Đổi mới AI/ML',
    description: 'Các bài toán AI và học máy tiên tiến',
    startDate: '2024-12-01T09:00:00Z',
    endDate: '2024-12-10T17:00:00Z',
    status: 'archived',
    currentRank: 8,
    totalParticipants: 423,
    ratingUpdateMessage: 'Xếp hạng sẽ được cập nhật sớm, vui lòng đợi!',
    challenges: [
      {
        id: 'neural-network-design',
        title: 'Thiết kế mạng nơ-ron',
        successRate: 12.4,
        maxScore: 100,
        difficulty: 'Khó',
        status: 'attempted',
        description: 'Thiết kế và triển khai mạng nơ-ron tùy chỉnh',
        tags: ['Học sâu', 'TensorFlow', 'Mạng nơ-ron']
      },
      {
        id: 'nlp-sentiment-analysis',
        title: 'Phân tích cảm xúc NLP',
        successRate: 34.6,
        maxScore: 60,
        difficulty: 'Trung bình',
        status: 'solved',
        description: 'Xây dựng mô hình phân tích cảm xúc',
        tags: ['NLP', 'Python', 'Học máy']
      }
    ]
  }
};
