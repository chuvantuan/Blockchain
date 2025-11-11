import { Certification, CertificationSection } from '../types/certification';

export const mockCertifications: Certification[] = [
  // Role Certifications
  {
    id: 'frontend-react',
    title: 'Lập trình viên Frontend (React)',
    level: 'Trung cấp',
    category: 'role',
    icon: 'react',
    color: '#61dafb',
    description: 'Bao gồm các chủ đề như cơ bản React, vòng đời component, quản lý state và các pattern React hiện đại.'
  },
  {
    id: 'software-engineer',
    title: 'Kỹ sư phần mềm',
    level: 'Nâng cao',
    category: 'role',
    icon: 'code',
    color: '#007acc',
    description: 'Bao gồm các chủ đề như thiết kế hệ thống, thuật toán, cấu trúc dữ liệu và nguyên lý kiến trúc phần mềm.'
  },
  {
    id: 'software-engineer-intern',
    title: 'Thực tập sinh Kỹ sư phần mềm',
    level: 'Cơ bản',
    category: 'role',
    icon: 'code',
    color: '#28a745',
    description: 'Bao gồm các chủ đề như giải quyết vấn đề và SQL.'
  },
  
  // Skill Certifications
  {
    id: 'angular-basic',
    title: 'Angular (Cơ bản)',
    level: 'Cơ bản',
    category: 'skill',
    icon: 'angular',
    color: '#dd0031',
    description: 'Bao gồm các chủ đề như components, services, directives và các khái niệm Angular cơ bản.'
  },
  {
    id: 'angular-intermediate',
    title: 'Angular (Trung cấp)',
    level: 'Trung cấp',
    category: 'skill',
    icon: 'angular',
    color: '#dd0031',
    description: 'Bao gồm các chủ đề như routing nâng cao, forms, HTTP client và quản lý state.'
  },
  {
    id: 'csharp-basic',
    title: 'C# (Cơ bản)',
    level: 'Cơ bản',
    category: 'skill',
    icon: 'csharp',
    color: '#239120',
    description: 'Bao gồm các chủ đề như biến, cấu trúc điều khiển, classes và các khái niệm OOP cơ bản.'
  },
  {
    id: 'css-basic',
    title: 'CSS (Cơ bản)',
    level: 'Cơ bản',
    category: 'skill',
    icon: 'css',
    color: '#1572b6',
    description: 'Bao gồm các chủ đề như selectors, properties, layouts và responsive design.'
  },
  {
    id: 'go-basic',
    title: 'Go (Cơ bản)',
    level: 'Cơ bản',
    category: 'skill',
    icon: 'go',
    color: '#00add8',
    description: 'Bao gồm các chủ đề như cú pháp, goroutines, channels và concurrency cơ bản.'
  },
  {
    id: 'go-intermediate',
    title: 'Go (Trung cấp)',
    level: 'Trung cấp',
    category: 'skill',
    icon: 'go',
    color: '#00add8',
    description: 'Bao gồm các chủ đề như interfaces, xử lý lỗi, testing và các pattern nâng cao.'
  },
  {
    id: 'java-basic',
    title: 'Java (Cơ bản)',
    level: 'Cơ bản',
    category: 'skill',
    icon: 'java',
    color: '#f89820',
    description: 'Bao gồm các chủ đề như cú pháp, OOP, collections và các khái niệm Java cơ bản.'
  },
  {
    id: 'javascript-basic',
    title: 'JavaScript (Cơ bản)',
    level: 'Cơ bản',
    category: 'skill',
    icon: 'javascript',
    color: '#f7df1e',
    description: 'Bao gồm các chủ đề như biến, hàm, objects và thao tác DOM.'
  },
  {
    id: 'javascript-intermediate',
    title: 'JavaScript (Trung cấp)',
    level: 'Trung cấp',
    category: 'skill',
    icon: 'javascript',
    color: '#f7df1e',
    description: 'Bao gồm các chủ đề như closures, prototypes, lập trình bất đồng bộ và tính năng ES6+.'
  },
  {
    id: 'python-basic',
    title: 'Python (Cơ bản)',
    level: 'Cơ bản',
    category: 'skill',
    icon: 'python',
    color: '#3776ab',
    description: 'Bao gồm các chủ đề như cú pháp, kiểu dữ liệu, hàm và các khái niệm Python cơ bản.'
  },
  {
    id: 'python-intermediate',
    title: 'Python (Trung cấp)',
    level: 'Trung cấp',
    category: 'skill',
    icon: 'python',
    color: '#3776ab',
    description: 'Bao gồm các chủ đề như OOP, decorators, generators và các tính năng Python nâng cao.'
  },
  {
    id: 'react-basic',
    title: 'React (Cơ bản)',
    level: 'Cơ bản',
    category: 'skill',
    icon: 'react',
    color: '#61dafb',
    description: 'Bao gồm các chủ đề như components, JSX, props, state và các khái niệm React cơ bản.'
  },
  {
    id: 'typescript-basic',
    title: 'TypeScript (Cơ bản)',
    level: 'Cơ bản',
    category: 'skill',
    icon: 'typescript',
    color: '#3178c6',
    description: 'Bao gồm các chủ đề như types, interfaces, classes và các khái niệm TypeScript cơ bản.'
  }
];

export const certificationSections: CertificationSection[] = [
  {
    title: 'Chứng chỉ vai trò của bạn',
    certifications: mockCertifications.filter(cert => cert.category === 'role')
  },
  {
    title: 'Chứng chỉ kỹ năng của bạn',
    certifications: mockCertifications.filter(cert => cert.category === 'skill')
  }
];
