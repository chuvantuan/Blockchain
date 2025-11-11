import { CertificationDetail } from '../types/certificationDetail';

export const mockCertificationDetails: { [key: string]: CertificationDetail } = {
  'frontend-react': {
    id: 'frontend-react',
    title: 'Lập trình viên Frontend',
    subtitle: '(React)',
    description: 'Chứng minh chuyên môn của bạn trong việc xây dựng ứng dụng web hiện đại, responsive bằng React, JavaScript và CSS. Chứng chỉ này xác thực khả năng tạo giao diện người dùng tương tác và quản lý state component hiệu quả.',
    duration: '1 giờ',
    questions: '4 câu hỏi',
    level: 'Trung cấp',
    category: 'role',
    icon: 'react',
    color: '#61dafb',
    benefits: [
      'Nổi bật với nhà tuyển dụng bằng chứng chỉ kỹ năng React được xác minh',
      'Xác thực chuyên môn phát triển frontend của bạn',
      'Truy cập các cơ hội việc làm độc quyền',
      'Tăng uy tín chuyên nghiệp',
      'Tham gia cộng đồng lập trình viên được chứng chỉ'
    ],
    requirements: [
      'Hiểu biết cơ bản về HTML, CSS và JavaScript',
      'Kinh nghiệm với các khái niệm React cơ bản',
      'Kiến thức về vòng đời component và quản lý state',
      'Quen thuộc với JavaScript hiện đại (ES6+)'
    ],
    topics: [
      'React Components và JSX',
      'Quản lý State (useState, useEffect)',
      'Props và giao tiếp giữa các Component',
      'Xử lý sự kiện',
      'Render có điều kiện',
      'Lists và Keys',
      'CSS Styling và Responsive Design',
      'JavaScript cơ bản'
    ],
    faqs: [
      {
        id: 'what-is-test',
        question: 'Bài kiểm tra chứng chỉ là gì?',
        answer: 'Bài kiểm tra chứng chỉ là đánh giá tiêu chuẩn được thiết kế để đánh giá kỹ năng lập trình thực tế và kiến thức của bạn về các công nghệ cụ thể. Nó bao gồm các bài toán lập trình thực tế để kiểm tra khả năng giải quyết thử thách của bạn trong thời gian giới hạn.'
      },
      {
        id: 'types-of-tests',
        question: 'Các loại bài kiểm tra chứng chỉ khác nhau là gì?',
        answer: 'Chúng tôi cung cấp nhiều bài kiểm tra chứng chỉ bao gồm chứng chỉ dựa trên vai trò (Lập trình viên Frontend, Backend, Full Stack) và chứng chỉ dựa trên kỹ năng (JavaScript, Python, SQL, React, v.v.). Mỗi bài kiểm tra được thiết kế riêng để xác thực các năng lực cụ thể.'
      },
      {
        id: 'subject-matter',
        question: 'Nội dung kiểm tra trong bài thi là gì?',
        answer: 'Đối với chứng chỉ Lập trình viên Frontend (React), bạn sẽ được kiểm tra về kiến thức React cơ bản, vòng đời component, quản lý state, xử lý sự kiện, JSX, props, CSS styling và các khái niệm JavaScript. Bài kiểm tra tập trung vào ứng dụng thực tế thay vì kiến thức lý thuyết.'
      },
      {
        id: 'if-fail',
        question: 'Điều gì xảy ra nếu tôi trượt bài kiểm tra?',
        answer: 'Nếu bạn không vượt qua bài kiểm tra ở lần đầu tiên, bạn có thể thi lại sau thời gian chờ 7 ngày. Chúng tôi khuyến khích bạn ôn tập các chủ đề và luyện tập thêm trước khi thử lại. Không giới hạn số lần thi lại.'
      },
      {
        id: 'why-take',
        question: 'Tại sao tôi nên tham gia bài kiểm tra này?',
        answer: 'Chứng chỉ này giúp bạn nổi bật trên thị trường việc làm cạnh tranh, xác thực kỹ năng của bạn với nhà tuyển dụng, cung cấp quyền truy cập vào các cơ hội việc làm độc quyền và thể hiện cam kết của bạn với phát triển chuyên nghiệp trong lĩnh vực phát triển frontend.'
      },
      {
        id: 'duration',
        question: 'Thời lượng của bài kiểm tra là bao lâu?',
        answer: 'Bài kiểm tra chứng chỉ Lập trình viên Frontend (React) kéo dài 60 phút. Bao gồm thời gian đọc câu hỏi, viết code giải pháp và kiểm tra triển khai của bạn. Chúng tôi khuyến nghị quản lý thời gian hiệu quả để hoàn thành tất cả câu hỏi.'
      },
      {
        id: 'questions-count',
        question: 'Có bao nhiêu câu hỏi trong bài kiểm tra?',
        answer: 'Bài kiểm tra chứa 4 câu hỏi được thiết kế cẩn thận với độ khó tăng dần. Những câu hỏi này được thiết kế để đánh giá các khía cạnh khác nhau của phát triển React, từ tạo component cơ bản đến các tình huống quản lý state phức tạp.'
      }
    ],
    companyLogos: ['ORACLE', 'BANK OF AMERICA', 'Walmart', 'Uber', 'NUTANIX', 'Salesforce'],
    testimonialCount: '3 triệu'
  },
  'angular-basic': {
    id: 'angular-basic',
    title: 'Angular',
    subtitle: '(Cơ bản)',
    description: 'Nắm vững kiến thức cơ bản về phát triển Angular và học cách xây dựng ứng dụng đơn trang mạnh mẽ. Chứng chỉ này bao gồm các khái niệm Angular cốt lõi, components, services và routing.',
    duration: '45 phút',
    questions: '3 câu hỏi',
    level: 'Cơ bản',
    category: 'skill',
    icon: 'angular',
    color: '#dd0031',
    benefits: [
      'Xác thực kiến thức Angular cơ bản của bạn',
      'Thể hiện kỹ năng frontend framework',
      'Truy cập các cơ hội việc làm chuyên về Angular',
      'Xây dựng tự tin trong phát triển Angular',
      'Tham gia cộng đồng lập trình viên Angular'
    ],
    requirements: [
      'Hiểu biết cơ bản về HTML, CSS và JavaScript',
      'Quen thuộc với TypeScript cơ bản',
      'Kiến thức về các khái niệm phát triển web',
      'Hiểu về kiến trúc dựa trên component'
    ],
    topics: [
      'Angular Components',
      'TypeScript cơ bản',
      'Data Binding',
      'Directives',
      'Services và Dependency Injection',
      'Routing và Navigation',
      'Forms và Validation',
      'HTTP Client'
    ],
    faqs: [
      {
        id: 'what-is-test',
        question: 'Bài kiểm tra chứng chỉ là gì?',
        answer: 'Bài kiểm tra chứng chỉ là đánh giá tiêu chuẩn được thiết kế để đánh giá kỹ năng lập trình thực tế và kiến thức của bạn về các công nghệ cụ thể. Nó bao gồm các bài toán lập trình thực tế để kiểm tra khả năng giải quyết thử thách của bạn trong thời gian giới hạn.'
      },
      {
        id: 'types-of-tests',
        question: 'Các loại bài kiểm tra chứng chỉ khác nhau là gì?',
        answer: 'Chúng tôi cung cấp nhiều bài kiểm tra chứng chỉ bao gồm chứng chỉ dựa trên vai trò (Lập trình viên Frontend, Backend, Full Stack) và chứng chỉ dựa trên kỹ năng (JavaScript, Python, SQL, Angular, v.v.). Mỗi bài kiểm tra được thiết kế riêng để xác thực các năng lực cụ thể.'
      },
      {
        id: 'subject-matter',
        question: 'Nội dung kiểm tra trong bài thi là gì?',
        answer: 'Đối với chứng chỉ Angular (Cơ bản), bạn sẽ được kiểm tra về Angular components, TypeScript cơ bản, data binding, directives, services, routing, forms và HTTP client. Bài kiểm tra tập trung vào ứng dụng thực tế các khái niệm Angular.'
      },
      {
        id: 'if-fail',
        question: 'Điều gì xảy ra nếu tôi trượt bài kiểm tra?',
        answer: 'Nếu bạn không vượt qua bài kiểm tra ở lần đầu tiên, bạn có thể thi lại sau thời gian chờ 7 ngày. Chúng tôi khuyến khích bạn ôn tập các chủ đề và luyện tập thêm trước khi thử lại. Không giới hạn số lần thi lại.'
      },
      {
        id: 'why-take',
        question: 'Tại sao tôi nên tham gia bài kiểm tra này?',
        answer: 'Chứng chỉ này giúp bạn nổi bật trên thị trường việc làm cạnh tranh, xác thực kỹ năng Angular của bạn với nhà tuyển dụng, cung cấp quyền truy cập vào các cơ hội việc làm Angular và thể hiện cam kết của bạn trong việc học các framework frontend hiện đại.'
      },
      {
        id: 'duration',
        question: 'Thời lượng của bài kiểm tra là bao lâu?',
        answer: 'Bài kiểm tra chứng chỉ Angular (Cơ bản) kéo dài 45 phút. Bao gồm thời gian đọc câu hỏi, viết code giải pháp và kiểm tra triển khai của bạn. Chúng tôi khuyến nghị quản lý thời gian hiệu quả để hoàn thành tất cả câu hỏi.'
      },
      {
        id: 'questions-count',
        question: 'Có bao nhiêu câu hỏi trong bài kiểm tra?',
        answer: 'Bài kiểm tra chứa 3 câu hỏi được thiết kế cẩn thận với độ khó tăng dần. Những câu hỏi này được thiết kế để đánh giá các khía cạnh khác nhau của phát triển Angular, từ tạo component cơ bản đến triển khai service.'
      }
    ],
    companyLogos: ['Microsoft', 'Google', 'Adobe', 'PayPal', 'IBM', 'Intel'],
    testimonialCount: '2,5 triệu'
  },
  'csharp-basic': {
    id: 'csharp-basic',
    title: 'C#',
    subtitle: '(Cơ bản)',
    description: 'Học các kiến thức cơ bản về ngôn ngữ lập trình C# và các khái niệm lập trình hướng đối tượng. Chứng chỉ này bao gồm cú pháp cơ bản, kiểu dữ liệu, cấu trúc điều khiển và thiết kế class.',
    duration: '50 phút',
    questions: '3 câu hỏi',
    level: 'Cơ bản',
    category: 'skill',
    icon: 'csharp',
    color: '#239120',
    benefits: [
      'Xác thực kiến thức lập trình C# cơ bản',
      'Thể hiện kỹ năng phát triển .NET',
      'Truy cập các cơ hội việc làm lập trình viên C#',
      'Xây dựng tự tin trong lập trình hướng đối tượng',
      'Tham gia cộng đồng lập trình viên .NET'
    ],
    requirements: [
      'Hiểu biết cơ bản về các khái niệm lập trình',
      'Quen thuộc với lập trình hướng đối tượng',
      'Kiến thức về kiểu dữ liệu và biến',
      'Hiểu về cấu trúc điều khiển'
    ],
    topics: [
      'Cú pháp C# và Kiểu dữ liệu',
      'Biến và Constants',
      'Cấu trúc điều khiển (if, for, while)',
      'Methods và Functions',
      'Classes và Objects',
      'Kế thừa và Đa hình',
      'Xử lý ngoại lệ',
      'Collections và LINQ'
    ],
    faqs: [
      {
        id: 'what-is-test',
        question: 'Bài kiểm tra chứng chỉ là gì?',
        answer: 'Bài kiểm tra chứng chỉ là đánh giá tiêu chuẩn được thiết kế để đánh giá kỹ năng lập trình thực tế và kiến thức của bạn về các công nghệ cụ thể. Nó bao gồm các bài toán lập trình thực tế để kiểm tra khả năng giải quyết thử thách của bạn trong thời gian giới hạn.'
      },
      {
        id: 'types-of-tests',
        question: 'Các loại bài kiểm tra chứng chỉ khác nhau là gì?',
        answer: 'Chúng tôi cung cấp nhiều bài kiểm tra chứng chỉ bao gồm chứng chỉ dựa trên vai trò (Kỹ sư phần mềm, Lập trình viên Backend, Full Stack) và chứng chỉ dựa trên kỹ năng (C#, Java, Python, SQL, v.v.). Mỗi bài kiểm tra được thiết kế riêng để xác thực các năng lực cụ thể.'
      },
      {
        id: 'subject-matter',
        question: 'Nội dung kiểm tra trong bài thi là gì?',
        answer: 'Đối với chứng chỉ C# (Cơ bản), bạn sẽ được kiểm tra về cú pháp C#, kiểu dữ liệu, cấu trúc điều khiển, methods, classes, kế thừa, xử lý ngoại lệ và collections cơ bản. Bài kiểm tra tập trung vào ứng dụng thực tế các kiến thức C# cơ bản.'
      },
      {
        id: 'if-fail',
        question: 'Điều gì xảy ra nếu tôi trượt bài kiểm tra?',
        answer: 'Nếu bạn không vượt qua bài kiểm tra ở lần đầu tiên, bạn có thể thi lại sau thời gian chờ 7 ngày. Chúng tôi khuyến khích bạn ôn tập các chủ đề và luyện tập thêm trước khi thử lại. Không giới hạn số lần thi lại.'
      },
      {
        id: 'why-take',
        question: 'Tại sao tôi nên tham gia bài kiểm tra này?',
        answer: 'Chứng chỉ này giúp bạn nổi bật trên thị trường việc làm cạnh tranh, xác thực kỹ năng C# của bạn với nhà tuyển dụng, cung cấp quyền truy cập vào các cơ hội việc làm lập trình viên .NET và thể hiện cam kết của bạn trong việc học các ngôn ngữ lập trình hiện đại.'
      },
      {
        id: 'duration',
        question: 'Thời lượng của bài kiểm tra là bao lâu?',
        answer: 'Bài kiểm tra chứng chỉ C# (Cơ bản) kéo dài 50 phút. Bao gồm thời gian đọc câu hỏi, viết code giải pháp và kiểm tra triển khai của bạn. Chúng tôi khuyến nghị quản lý thời gian hiệu quả để hoàn thành tất cả câu hỏi.'
      },
      {
        id: 'questions-count',
        question: 'Có bao nhiêu câu hỏi trong bài kiểm tra?',
        answer: 'Bài kiểm tra chứa 3 câu hỏi được thiết kế cẩn thận với độ khó tăng dần. Những câu hỏi này được thiết kế để đánh giá các khía cạnh khác nhau của phát triển C#, từ cú pháp cơ bản đến các khái niệm lập trình hướng đối tượng.'
      }
    ],
    companyLogos: ['Microsoft', 'Stack Overflow', 'Unity', 'JetBrains', 'GitHub', 'Slack'],
    testimonialCount: '2 triệu'
  }
};
