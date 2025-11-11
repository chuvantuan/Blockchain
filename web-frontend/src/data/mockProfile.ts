import { UserProfile, ProfileCompletion } from '../types/profile';

export const mockUserProfile: UserProfile = {
  id: 'user-001',
  personalInfo: {
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    username: 'nguyenvana',
    email: 'nguyenvana@example.com',
    phone: '+84 123 456 789',
    avatar: '/images/avatar-placeholder.jpg',
    bio: 'Lập trình viên Full-stack với 5 năm kinh nghiệm trong phát triển web và mobile. Đam mê công nghệ và luôn học hỏi những điều mới.',
    location: 'Hồ Chí Minh, Việt Nam',
    website: 'https://nguyenvana.dev',
    dateOfBirth: '1995-03-15',
    gender: 'male'
  },
  workExperience: [
    {
      id: 'exp-001',
      company: 'TechCorp Vietnam',
      position: 'Senior Full-stack Developer',
      location: 'Hồ Chí Minh, Việt Nam',
      startDate: '2022-01-01',
      current: true,
      description: 'Phát triển và duy trì các ứng dụng web và mobile cho khách hàng doanh nghiệp.',
      technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
      achievements: [
        'Dẫn đầu team 5 developers',
        'Tăng hiệu suất ứng dụng lên 40%',
        'Đào tạo 3 junior developers'
      ]
    },
    {
      id: 'exp-002',
      company: 'StartupXYZ',
      position: 'Full-stack Developer',
      location: 'Hà Nội, Việt Nam',
      startDate: '2020-06-01',
      endDate: '2021-12-31',
      current: false,
      description: 'Phát triển MVP và các tính năng core cho nền tảng e-commerce.',
      technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Docker'],
      achievements: [
        'Xây dựng hệ thống thanh toán',
        'Tối ưu hóa database queries',
        'Triển khai CI/CD pipeline'
      ]
    }
  ],
  education: [
    {
      id: 'edu-001',
      institution: 'Đại học Bách Khoa TP.HCM',
      degree: 'Cử nhân',
      fieldOfStudy: 'Khoa học Máy tính',
      location: 'Hồ Chí Minh, Việt Nam',
      startDate: '2013-09-01',
      endDate: '2017-06-30',
      current: false,
      gpa: '3.8/4.0',
      description: 'Tốt nghiệp loại Giỏi với chuyên ngành Khoa học Máy tính.',
      activities: [
        'Thành viên CLB Lập trình',
        'Tham gia cuộc thi ACM ICPC',
        'Trưởng nhóm dự án tốt nghiệp'
      ]
    }
  ],
  skills: [
    {
      id: 'skill-001',
      name: 'JavaScript',
      category: 'programming',
      level: 'expert',
      yearsOfExperience: 5,
      certifications: ['JavaScript Professional Certificate']
    },
    {
      id: 'skill-002',
      name: 'React',
      category: 'framework',
      level: 'advanced',
      yearsOfExperience: 4
    },
    {
      id: 'skill-003',
      name: 'Node.js',
      category: 'framework',
      level: 'advanced',
      yearsOfExperience: 4
    },
    {
      id: 'skill-004',
      name: 'TypeScript',
      category: 'programming',
      level: 'advanced',
      yearsOfExperience: 3
    },
    {
      id: 'skill-005',
      name: 'Python',
      category: 'programming',
      level: 'intermediate',
      yearsOfExperience: 2
    },
    {
      id: 'skill-006',
      name: 'Git',
      category: 'tool',
      level: 'advanced',
      yearsOfExperience: 5
    },
    {
      id: 'skill-007',
      name: 'Docker',
      category: 'tool',
      level: 'intermediate',
      yearsOfExperience: 2
    },
    {
      id: 'skill-008',
      name: 'AWS',
      category: 'tool',
      level: 'intermediate',
      yearsOfExperience: 2
    }
  ],
  certifications: [
    {
      id: 'cert-001',
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      issueDate: '2023-03-15',
      expiryDate: '2026-03-15',
      credentialId: 'AWS-DEV-123456',
      credentialUrl: 'https://aws.amazon.com/verification',
      skills: ['AWS', 'Cloud Computing', 'DevOps']
    },
    {
      id: 'cert-002',
      name: 'React Professional Certificate',
      issuer: 'Meta',
      issueDate: '2022-08-20',
      credentialId: 'META-REACT-789012',
      credentialUrl: 'https://coursera.org/verify/REACT123',
      skills: ['React', 'JavaScript', 'Frontend Development']
    }
  ],
  projects: [
    {
      id: 'proj-001',
      name: 'E-commerce Platform',
      description: 'Nền tảng thương mại điện tử với khả năng xử lý 10,000+ đơn hàng/ngày.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
      startDate: '2023-01-01',
      current: true,
      url: 'https://ecommerce-demo.com',
      githubUrl: 'https://github.com/nguyenvana/ecommerce-platform',
      achievements: [
        'Tăng conversion rate lên 25%',
        'Giảm thời gian load xuống 2 giây',
        'Xử lý thành công 1M+ transactions'
      ],
      teamSize: 8
    },
    {
      id: 'proj-002',
      name: 'Task Management App',
      description: 'Ứng dụng quản lý công việc với real-time collaboration.',
      technologies: ['Vue.js', 'Express.js', 'Socket.io', 'MongoDB'],
      startDate: '2022-06-01',
      endDate: '2022-12-31',
      current: false,
      githubUrl: 'https://github.com/nguyenvana/task-manager',
      achievements: [
        'Hỗ trợ 100+ users đồng thời',
        'Tích hợp real-time notifications',
        'Mobile responsive design'
      ],
      teamSize: 3
    }
  ],
  achievements: [
    {
      id: 'ach-001',
      title: 'Top 10 Developer Vietnam 2023',
      description: 'Được vinh danh trong danh sách Top 10 lập trình viên xuất sắc nhất Việt Nam năm 2023.',
      date: '2023-12-15',
      issuer: 'Vietnam Tech Awards',
      category: 'award',
      url: 'https://vietnamtech.com/awards/2023'
    },
    {
      id: 'ach-002',
      title: 'Best Open Source Contributor',
      description: 'Đóng góp tích cực cho các dự án open source với 500+ commits trong năm 2023.',
      date: '2023-11-20',
      issuer: 'GitHub Vietnam',
      category: 'recognition',
      url: 'https://github.com/nguyenvana'
    }
  ],
  socialLinks: [
    {
      platform: 'github',
      url: 'https://github.com/nguyenvana',
      username: 'nguyenvana'
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/nguyenvana',
      username: 'nguyenvana'
    },
    {
      platform: 'website',
      url: 'https://nguyenvana.dev'
    }
  ],
  preferences: {
    theme: 'dark',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: 'public'
  },
  completionPercentage: 85,
  lastUpdated: '2024-01-15T10:30:00Z'
};

export const mockProfileCompletion: ProfileCompletion = {
  totalSections: 8,
  completedSections: 7,
  percentage: 87.5,
  missingSections: ['Portfolio'],
  recommendations: [
    'Thêm portfolio projects để thể hiện kỹ năng',
    'Cập nhật ảnh đại diện chuyên nghiệp hơn',
    'Thêm thông tin về sở thích cá nhân'
  ]
};
