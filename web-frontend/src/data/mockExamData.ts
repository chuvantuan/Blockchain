import { ExamDetails } from '../utils/types';

// Mock data cho demo - trong thực tế sẽ gọi API
export const mockExamDetails: ExamDetails = {
  id: 'javascript-advanced',
  title: 'JavaScript Advanced Concepts',
  duration: 30, // phút
  totalQuestions: 5,
  isProctored: true,
  instructions: [
    'Bài thi có 5 câu hỏi với thời gian 30 phút',
    'Không được sử dụng tài liệu tham khảo',
    'Không được rời khỏi màn hình trong quá trình thi',
    'Camera sẽ giám sát toàn bộ quá trình làm bài',
    'Chỉ có thể nộp bài một lần duy nhất'
  ],
  questions: [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'Trong JavaScript, closure là gì?',
      options: [
        'Một hàm có thể truy cập biến từ scope cha',
        'Một phương thức để đóng gói dữ liệu',
        'Một pattern để tạo private methods',
        'Tất cả các đáp án trên'
      ],
      correctAnswer: 3,
      points: 4
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: 'Kết quả của console.log(typeof null) là gì?',
      options: [
        'null',
        'undefined',
        'object',
        'string'
      ],
      correctAnswer: 2,
      points: 4
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: 'Trong ES6, cách nào sau đây để tạo một arrow function?',
      options: [
        'function() => {}',
        '() => {}',
        'arrow function() {}',
        'function => {}'
      ],
      correctAnswer: 1,
      points: 4
    },
    {
      id: 4,
      type: 'code',
      question: 'Viết một function để tìm số lớn nhất trong mảng:',
      codeTemplate: 'function findMax(arr) {\n  // Your code here\n}',
      testCases: [
        { input: '[1, 5, 3, 9, 2]', expected: '9' },
        { input: '[-1, -5, -3]', expected: '-1' },
        { input: '[42]', expected: '42' }
      ],
      points: 10
    },
    {
      id: 5,
      type: 'multiple-choice',
      question: 'Promise trong JavaScript được sử dụng để làm gì?',
      options: [
        'Xử lý bất đồng bộ',
        'Tạo vòng lặp',
        'Quản lý memory',
        'Xử lý đồng bộ'
      ],
      correctAnswer: 0,
      points: 4
    }
  ]
};
