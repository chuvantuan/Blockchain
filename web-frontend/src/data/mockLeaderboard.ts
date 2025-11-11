import { LeaderboardEntry, CountryInfo, LeaderboardData, TabOption, LeaderboardFilters, PaginationInfo } from '../types/leaderboard';

// Country data
export const countries: CountryInfo[] = [
  { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'GB', name: 'UK', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'UNKNOWN', name: 'Unknown', flag: '❓' }
];

// Mock leaderboard data
export const mockLeaderboardEntries: LeaderboardEntry[] = [
  {
    id: '1',
    hackerName: 'Gennady',
    rank: 1,
    country: 'BY',
    countryName: 'Belarus',
    score: 2961.96,
    algorithms: {
      o1: 150,
      ologN: 280,
      oN: 320,
      oN2: 290,
      o2N: 180
    },
    contests: {
      totalContests: 45,
      completedContests: 42,
      averageScore: 85.2,
      bestRank: 1
    },
    profileUrl: '/hackers/gennady',
    avatarUrl: undefined
  },
  {
    id: '2',
    hackerName: 'uwi',
    rank: 2,
    country: 'JP',
    countryName: 'Japan',
    score: 2935.94,
    algorithms: {
      o1: 140,
      ologN: 275,
      oN: 315,
      oN2: 285,
      o2N: 175
    },
    contests: {
      totalContests: 43,
      completedContests: 40,
      averageScore: 83.8,
      bestRank: 2
    },
    profileUrl: '/hackers/uwi',
    avatarUrl: undefined
  },
  {
    id: '3',
    hackerName: 'I_love_Tanya',
    rank: 3,
    country: 'RU',
    countryName: 'Russia',
    score: 2906.07,
    algorithms: {
      o1: 135,
      ologN: 270,
      oN: 310,
      oN2: 280,
      o2N: 170
    },
    contests: {
      totalContests: 41,
      completedContests: 38,
      averageScore: 82.5,
      bestRank: 3
    },
    profileUrl: '/hackers/i_love_tanya',
    avatarUrl: undefined
  },
  {
    id: '4',
    hackerName: 'zemen',
    rank: 4,
    country: 'RU',
    countryName: 'Russia',
    score: 2878.45,
    algorithms: {
      o1: 130,
      ologN: 265,
      oN: 305,
      oN2: 275,
      o2N: 165
    },
    contests: {
      totalContests: 39,
      completedContests: 36,
      averageScore: 81.2,
      bestRank: 4
    },
    profileUrl: '/hackers/zemen',
    avatarUrl: undefined
  },
  {
    id: '5',
    hackerName: 'xiper',
    rank: 5,
    country: 'RU',
    countryName: 'Russia',
    score: 2850.23,
    algorithms: {
      o1: 125,
      ologN: 260,
      oN: 300,
      oN2: 270,
      o2N: 160
    },
    contests: {
      totalContests: 37,
      completedContests: 34,
      averageScore: 80.0,
      bestRank: 5
    },
    profileUrl: '/hackers/xiper',
    avatarUrl: undefined
  },
  {
    id: '6',
    hackerName: 'Alex_2008',
    rank: 6,
    country: 'LV',
    countryName: 'Latvia',
    score: 2821.89,
    algorithms: {
      o1: 120,
      ologN: 255,
      oN: 295,
      oN2: 265,
      o2N: 155
    },
    contests: {
      totalContests: 35,
      completedContests: 32,
      averageScore: 78.8,
      bestRank: 6
    },
    profileUrl: '/hackers/alex_2008',
    avatarUrl: undefined
  },
  {
    id: '7',
    hackerName: 'zeliboba',
    rank: 7,
    country: 'US',
    countryName: 'USA',
    score: 2793.56,
    algorithms: {
      o1: 115,
      ologN: 250,
      oN: 290,
      oN2: 260,
      o2N: 150
    },
    contests: {
      totalContests: 33,
      completedContests: 30,
      averageScore: 77.5,
      bestRank: 7
    },
    profileUrl: '/hackers/zeliboba',
    avatarUrl: undefined
  },
  {
    id: '8',
    hackerName: 'Kmcode',
    rank: 8,
    country: 'UNKNOWN',
    countryName: 'Unknown',
    score: 2765.34,
    algorithms: {
      o1: 110,
      ologN: 245,
      oN: 285,
      oN2: 255,
      o2N: 145
    },
    contests: {
      totalContests: 31,
      completedContests: 28,
      averageScore: 76.3,
      bestRank: 8
    },
    profileUrl: '/hackers/kmcode',
    avatarUrl: undefined
  },
  {
    id: '9',
    hackerName: 'anta0',
    rank: 9,
    country: 'JP',
    countryName: 'Japan',
    score: 2737.12,
    algorithms: {
      o1: 105,
      ologN: 240,
      oN: 280,
      oN2: 250,
      o2N: 140
    },
    contests: {
      totalContests: 29,
      completedContests: 26,
      averageScore: 75.1,
      bestRank: 9
    },
    profileUrl: '/hackers/anta0',
    avatarUrl: undefined
  },
  {
    id: '10',
    hackerName: 'biglNnnner',
    rank: 10,
    country: 'CL',
    countryName: 'Chile',
    score: 2708.90,
    algorithms: {
      o1: 100,
      ologN: 235,
      oN: 275,
      oN2: 245,
      o2N: 135
    },
    contests: {
      totalContests: 27,
      completedContests: 24,
      averageScore: 73.9,
      bestRank: 10
    },
    profileUrl: '/hackers/biglNnnner',
    avatarUrl: undefined
  },
  {
    id: '11',
    hackerName: 'LHICOO',
    rank: 11,
    country: 'UNKNOWN',
    countryName: 'Unknown',
    score: 2680.68,
    algorithms: {
      o1: 95,
      ologN: 230,
      oN: 270,
      oN2: 240,
      o2N: 130
    },
    contests: {
      totalContests: 25,
      completedContests: 22,
      averageScore: 72.7,
      bestRank: 11
    },
    profileUrl: '/hackers/lhicoo',
    avatarUrl: undefined
  },
  {
    id: '12',
    hackerName: 'natsugiri',
    rank: 12,
    country: 'JP',
    countryName: 'Japan',
    score: 2652.46,
    algorithms: {
      o1: 90,
      ologN: 225,
      oN: 265,
      oN2: 235,
      o2N: 125
    },
    contests: {
      totalContests: 23,
      completedContests: 20,
      averageScore: 71.5,
      bestRank: 12
    },
    profileUrl: '/hackers/natsugiri',
    avatarUrl: undefined
  },
  {
    id: '13',
    hackerName: 'jonathanirvings',
    rank: 13,
    country: 'UNKNOWN',
    countryName: 'Unknown',
    score: 2624.24,
    algorithms: {
      o1: 85,
      ologN: 220,
      oN: 260,
      oN2: 230,
      o2N: 120
    },
    contests: {
      totalContests: 21,
      completedContests: 18,
      averageScore: 70.3,
      bestRank: 13
    },
    profileUrl: '/hackers/jonathanirvings',
    avatarUrl: undefined
  },
  {
    id: '14',
    hackerName: 'TheTeaPot',
    rank: 14,
    country: 'UNKNOWN',
    countryName: 'Unknown',
    score: 2596.02,
    algorithms: {
      o1: 80,
      ologN: 215,
      oN: 255,
      oN2: 225,
      o2N: 115
    },
    contests: {
      totalContests: 19,
      completedContests: 16,
      averageScore: 69.1,
      bestRank: 14
    },
    profileUrl: '/hackers/theteapot',
    avatarUrl: undefined
  },
  {
    id: '15',
    hackerName: 'izban',
    rank: 15,
    country: 'RU',
    countryName: 'Russia',
    score: 2567.80,
    algorithms: {
      o1: 75,
      ologN: 210,
      oN: 250,
      oN2: 220,
      o2N: 110
    },
    contests: {
      totalContests: 17,
      completedContests: 14,
      averageScore: 67.9,
      bestRank: 15
    },
    profileUrl: '/hackers/izban',
    avatarUrl: undefined
  },
  {
    id: '16',
    hackerName: 'Marco_L_T',
    rank: 16,
    country: 'IT',
    countryName: 'Italy',
    score: 2539.58,
    algorithms: {
      o1: 70,
      ologN: 205,
      oN: 245,
      oN2: 215,
      o2N: 105
    },
    contests: {
      totalContests: 15,
      completedContests: 12,
      averageScore: 66.7,
      bestRank: 16
    },
    profileUrl: '/hackers/marco_l_t',
    avatarUrl: undefined
  },
  {
    id: '17',
    hackerName: 'Kostroma',
    rank: 17,
    country: 'RU',
    countryName: 'Russia',
    score: 2511.36,
    algorithms: {
      o1: 65,
      ologN: 200,
      oN: 240,
      oN2: 210,
      o2N: 100
    },
    contests: {
      totalContests: 13,
      completedContests: 10,
      averageScore: 65.5,
      bestRank: 17
    },
    profileUrl: '/hackers/kostroma',
    avatarUrl: undefined
  },
  {
    id: '18',
    hackerName: 'FatalEagle',
    rank: 18,
    country: 'US',
    countryName: 'USA',
    score: 2483.14,
    algorithms: {
      o1: 60,
      ologN: 195,
      oN: 235,
      oN2: 205,
      o2N: 95
    },
    contests: {
      totalContests: 11,
      completedContests: 8,
      averageScore: 64.3,
      bestRank: 18
    },
    profileUrl: '/hackers/fataleagle',
    avatarUrl: undefined
  },
  {
    id: '19',
    hackerName: '_Loks_',
    rank: 19,
    country: 'CA',
    countryName: 'Canada',
    score: 2454.92,
    algorithms: {
      o1: 55,
      ologN: 190,
      oN: 230,
      oN2: 200,
      o2N: 90
    },
    contests: {
      totalContests: 9,
      completedContests: 6,
      averageScore: 63.1,
      bestRank: 19
    },
    profileUrl: '/hackers/_loks_',
    avatarUrl: undefined
  },
  {
    id: '20',
    hackerName: 'thichph4trinh',
    rank: 20,
    country: 'VN',
    countryName: 'Vietnam',
    score: 2426.70,
    algorithms: {
      o1: 50,
      ologN: 185,
      oN: 225,
      oN2: 195,
      o2N: 85
    },
    contests: {
      totalContests: 7,
      completedContests: 4,
      averageScore: 61.9,
      bestRank: 20
    },
    profileUrl: '/hackers/thichph4trinh',
    avatarUrl: undefined
  }
];

// Mock pagination info
export const mockPaginationInfo: PaginationInfo = {
  currentPage: 1,
  totalPages: 92,
  itemsPerPage: 20,
  totalItems: 1840,
  hasNextPage: true,
  hasPrevPage: false
};

// Mock filters
export const mockFilters: LeaderboardFilters = {
  hackers: 'all',
  filterBy: null,
  country: undefined,
  company: undefined,
  school: undefined,
  hackerName: undefined
};

// Mock tabs
export const mockTabs: TabOption[] = [
  {
    id: 'algorithms',
    label: 'Algorithms',
    isActive: true
  },
  {
    id: 'contests',
    label: 'Contests',
    isActive: false
  }
];

// Complete mock data
export const mockLeaderboardData: LeaderboardData = {
  entries: mockLeaderboardEntries,
  pagination: mockPaginationInfo,
  filters: mockFilters
};

// Items per page options
export const itemsPerPageOptions = [10, 20, 50, 100];

// Performance metrics configuration
export const performanceMetrics = {
  o1: {
    label: 'O(1)',
    description: 'Constant Time',
    color: '#10B981'
  },
  ologN: {
    label: 'O(logN)',
    description: 'Logarithmic Time',
    color: '#3B82F6'
  },
  oN: {
    label: 'O(N)',
    description: 'Linear Time',
    color: '#F59E0B'
  },
  oN2: {
    label: 'O(N²)',
    description: 'Quadratic Time',
    color: '#EF4444'
  },
  o2N: {
    label: 'O(2^N)',
    description: 'Exponential Time',
    color: '#8B5CF6'
  }
};

// Table columns configuration
export const tableColumns = [
  {
    key: 'hacker',
    label: 'HACKER',
    sortable: true,
    align: 'left' as const,
    width: '200px'
  },
  {
    key: 'o1',
    label: 'O(1)',
    sortable: true,
    align: 'center' as const,
    width: '80px'
  },
  {
    key: 'ologN',
    label: 'O(logN)',
    sortable: true,
    align: 'center' as const,
    width: '80px'
  },
  {
    key: 'oN',
    label: 'O(N)',
    sortable: true,
    align: 'center' as const,
    width: '80px'
  },
  {
    key: 'oN2',
    label: 'O(N²)',
    sortable: true,
    align: 'center' as const,
    width: '80px'
  },
  {
    key: 'o2N',
    label: 'O(2^N)',
    sortable: true,
    align: 'center' as const,
    width: '80px'
  },
  {
    key: 'rank',
    label: 'RANK',
    sortable: true,
    align: 'left' as const,
    width: '100px'
  },
  {
    key: 'country',
    label: 'COUNTRY',
    sortable: true,
    align: 'left' as const,
    width: '120px'
  },
  {
    key: 'score',
    label: 'SCORE',
    sortable: true,
    align: 'right' as const,
    width: '100px'
  }
];

// Helper function to get country info by code
export const getCountryByCode = (code: string): CountryInfo | undefined => {
  return countries.find(country => country.code === code);
};

// Helper function to format score
export const formatScore = (score: number): string => {
  return score.toFixed(2);
};

// Helper function to format rank
export const formatRank = (rank: number): string => {
  return rank.toString().padStart(2, '0');
};
