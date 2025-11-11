import { Contest, ContestSection, FeaturedContest } from '../types/contest';

// Featured Contest
export const featuredContest: FeaturedContest = {
  id: 'hackerrank-build-challenges',
  title: 'Xây dựng thử thách HackerRank',
  description: 'Cơ hội tham gia mạng lưới chuyên gia độc quyền của chúng tôi',
  featuredDescription: 'Cơ hội tham gia mạng lưới chuyên gia độc quyền của chúng tôi',
  status: 'featured',
  type: 'hiring',
  startDate: '2025-10-21',
  endDate: '2025-10-21',
  registrationEndDate: '2025-10-21',
  actionButtonText: 'Đăng ký ngay',
  actionButtonLink: '/contests/hackerrank-build-challenges',
  isRegistrationOpen: true,
  registrationInfo: 'Đăng ký mở đến ngày 21 tháng 10',
  logoUrl: '/images/hackerrank-logo.png'
};

// Active Contests
export const activeContests: Contest[] = [
  {
    id: 'project-euler-plus',
    title: 'ProjectEuler+',
    description: 'Mở vô thời hạn',
    status: 'active',
    type: 'practice',
    endDate: 'Mở vô thời hạn',
    actionButtonText: 'Xem chi tiết',
    actionButtonLink: '/contests/project-euler-plus',
    isRegistrationOpen: true,
    difficulty: 'medium',
    tags: ['toán học', 'thuật toán']
  }
];

// Upcoming Contests
export const upcomingContests: Contest[] = [
  {
    id: 'hackerrank-build-challenges-upcoming',
    title: 'Xây dựng thử thách HackerRank',
    description: 'Đăng ký mở đến ngày 21 tháng 10',
    status: 'upcoming',
    type: 'hiring',
    startDate: '2025-10-21',
    endDate: '2025-10-21',
    registrationEndDate: '2025-10-21',
    actionButtonText: 'Đăng ký ngay',
    actionButtonLink: '/contests/hackerrank-build-challenges-upcoming',
    isRegistrationOpen: true,
    region: 'Toàn cầu',
    tags: ['tuyển dụng', 'thử thách']
  },
  {
    id: 'cse-cybersecurity-challenge',
    title: 'Thử thách An ninh mạng CSE',
    description: 'Đăng ký mở đến ngày 23 tháng 10',
    status: 'upcoming',
    type: 'college',
    startDate: '2025-10-23',
    endDate: '2025-10-23',
    registrationEndDate: '2025-10-23',
    actionButtonText: 'Đăng ký ngay',
    actionButtonLink: '/contests/cse-cybersecurity-challenge',
    isRegistrationOpen: true,
    region: 'Canada',
    tags: ['an ninh mạng', 'trường học']
  }
];

// Archived Contests
export const archivedContests: Contest[] = [
  {
    id: 'justice-league-1639642697',
    title: 'Justice League 1639642697',
    description: 'Sự kiện kết thúc vào ngày 16 tháng 12 năm 2021',
    status: 'archived',
    type: 'global',
    endDate: '2021-12-16',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/justice-league-1639642697/challenges',
    difficulty: 'hard',
    tags: ['siêu anh hùng', 'thuật toán']
  },
  {
    id: 'hackerrank-hackfest-2020',
    title: 'HackerRank HackFest 2020',
    description: 'Sự kiện kết thúc vào ngày 29 tháng 6 năm 2020',
    status: 'archived',
    type: 'global',
    endDate: '2020-06-29',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/hackerrank-hackfest-2020/challenges',
    difficulty: 'medium',
    tags: ['hackfest', 'thuật toán']
  },
  {
    id: 'hack-the-interview-v-us',
    title: 'Hack the Interview V (U.S.)',
    description: 'Sự kiện kết thúc vào ngày 20 tháng 3 năm 2021',
    status: 'archived',
    type: 'hiring',
    endDate: '2021-03-20',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/hack-the-interview-v-us/challenges',
    region: 'U.S.',
    difficulty: 'hard',
    tags: ['phỏng vấn', 'tuyển dụng']
  },
  {
    id: 'hack-the-interview-v-asia',
    title: 'Hack the Interview V (Asia Pacific)',
    description: 'Sự kiện kết thúc vào ngày 20 tháng 3 năm 2021',
    status: 'archived',
    type: 'hiring',
    endDate: '2021-03-20',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/hack-the-interview-v-asia/challenges',
    region: 'Châu Á Thái Bình Dương',
    difficulty: 'hard',
    tags: ['phỏng vấn', 'tuyển dụng', 'châu á']
  },
  {
    id: 'round1-1615978377',
    title: 'ROUND1 1615978377',
    description: 'Sự kiện kết thúc vào ngày 18 tháng 3 năm 2021',
    status: 'archived',
    type: 'practice',
    endDate: '2021-03-18',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/round1-1615978377/challenges',
    difficulty: 'medium',
    tags: ['luyện tập', 'vòng 1']
  },
  {
    id: 'march-circuits-2021',
    title: 'March Circuits 2021',
    description: 'Sự kiện kết thúc vào ngày 15 tháng 3 năm 2021',
    status: 'archived',
    type: 'global',
    endDate: '2021-03-15',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/march-circuits-2021/challenges',
    difficulty: 'medium',
    tags: ['circuits', 'hàng tháng']
  },
  {
    id: 'hack-the-interview-v-europe',
    title: 'Hack the Interview V (Europe)',
    description: 'Sự kiện kết thúc vào ngày 20 tháng 3 năm 2021',
    status: 'archived',
    type: 'hiring',
    endDate: '2021-03-20',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/hack-the-interview-v-europe/challenges',
    region: 'Châu Âu',
    difficulty: 'hard',
    tags: ['phỏng vấn', 'tuyển dụng', 'châu âu']
  },
  {
    id: 'february-circuits-2021',
    title: 'February Circuits 2021',
    description: 'Sự kiện kết thúc vào ngày 15 tháng 2 năm 2021',
    status: 'archived',
    type: 'global',
    endDate: '2021-02-15',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/february-circuits-2021/challenges',
    difficulty: 'medium',
    tags: ['circuits', 'hàng tháng']
  }
];

// College Contests
export const collegeContests: Contest[] = [
  {
    id: 'college-contest-1',
    title: 'Thử thách lập trình Đại học 2025',
    description: 'Sự kiện kết thúc vào ngày 15 tháng 1 năm 2025',
    status: 'archived',
    type: 'college',
    endDate: '2025-01-15',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/college-contest-1/challenges',
    difficulty: 'medium',
    tags: ['đại học', 'lập trình']
  },
  {
    id: 'college-contest-2',
    title: 'Cuộc thi thuật toán sinh viên',
    description: 'Sự kiện kết thúc vào ngày 10 tháng 1 năm 2025',
    status: 'archived',
    type: 'college',
    endDate: '2025-01-10',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/college-contest-2/challenges',
    difficulty: 'hard',
    tags: ['sinh viên', 'thuật toán']
  },
  {
    id: 'college-contest-3',
    title: 'Hackathon Đại học Công nghệ',
    description: 'Sự kiện kết thúc vào ngày 5 tháng 1 năm 2025',
    status: 'archived',
    type: 'college',
    endDate: '2025-01-05',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/college-contest-3/challenges',
    difficulty: 'medium',
    tags: ['hackathon', 'công nghệ']
  },
  {
    id: 'college-contest-4',
    title: 'CodeFest Kỹ thuật',
    description: 'Sự kiện kết thúc vào ngày 30 tháng 12 năm 2024',
    status: 'archived',
    type: 'college',
    endDate: '2024-12-30',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/college-contest-4/challenges',
    difficulty: 'hard',
    tags: ['kỹ thuật', 'codefest']
  },
  {
    id: 'college-contest-5',
    title: 'Thử thách Khoa học máy tính',
    description: 'Sự kiện kết thúc vào ngày 25 tháng 12 năm 2024',
    status: 'archived',
    type: 'college',
    endDate: '2024-12-25',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/college-contest-5/challenges',
    difficulty: 'medium',
    tags: ['khoa học máy tính', 'thử thách']
  },
  {
    id: 'college-contest-6',
    title: 'Cuộc thi Khoa học dữ liệu',
    description: 'Sự kiện kết thúc vào ngày 20 tháng 12 năm 2024',
    status: 'archived',
    type: 'college',
    endDate: '2024-12-20',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/college-contest-6/challenges',
    difficulty: 'hard',
    tags: ['khoa học dữ liệu', 'cuộc thi']
  },
  {
    id: 'college-contest-7',
    title: 'Cuộc thi Phát triển Web',
    description: 'Sự kiện kết thúc vào ngày 15 tháng 12 năm 2024',
    status: 'archived',
    type: 'college',
    endDate: '2024-12-15',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/college-contest-7/challenges',
    difficulty: 'medium',
    tags: ['phát triển web', 'cuộc thi']
  },
  {
    id: 'college-contest-8',
    title: 'Thử thách Đổi mới AI/ML',
    description: 'Sự kiện kết thúc vào ngày 10 tháng 12 năm 2024',
    status: 'archived',
    type: 'college',
    endDate: '2024-12-10',
    actionButtonText: 'Xem thử thách',
    actionButtonLink: '/contests/college-contest-8/challenges',
    difficulty: 'hard',
    tags: ['trí tuệ nhân tạo', 'học máy', 'đổi mới']
  }
];

// Contest Sections
export const contestSections: ContestSection[] = [
  {
    title: 'Cuộc thi đang diễn ra',
    contests: activeContests,
    layout: 'list',
    showViewAll: false
  },
  {
    title: 'Cuộc thi sắp tới',
    contests: upcomingContests,
    layout: 'list',
    showViewAll: true,
    viewAllLink: '/contests/upcoming'
  },
  {
    title: 'Cuộc thi đã kết thúc',
    contests: archivedContests,
    layout: 'grid',
    showViewAll: true,
    viewAllLink: '/contests/archived'
  },
  {
    title: 'Cuộc thi sinh viên',
    contests: collegeContests,
    layout: 'grid',
    showViewAll: true,
    viewAllLink: '/contests/college'
  }
];
