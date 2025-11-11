/**
 * Adapter để chuyển đổi giữa Backend CourseResponse và Frontend Course types
 * Giải quyết vấn đề không khớp giữa backend đơn giản và frontend cần nhiều field
 */

import { type Course as ApiCourse } from '../services/api/courseApi'
import { type Course as AdminCourse } from '../admin/types/course'

/**
 * Backend CourseResponse structure (thực tế từ API)
 */
interface BackendCourseResponse {
  id: string
  instructorId?: number
  title: string
  slug?: string
  description: string
  thumbnailUrl?: string
  visibility?: string
  createdAt: string
  updatedAt: string
}

/**
 * Chuyển từ Backend CourseResponse → Frontend Admin Course
 * Điền giá trị mặc định cho các field backend không có
 */
export function backendToAdminCourse(backend: BackendCourseResponse | ApiCourse): AdminCourse {
  const backendAny = backend as any
  const visibility = backendAny.visibility || (backendAny as BackendCourseResponse).visibility
  const isPublished = visibility === 'published' || backendAny.isPublished === true
  const status = visibility === 'published' ? 'published' : 
                 visibility === 'draft' ? 'draft' : 
                 backendAny.status || 'draft'

  return {
    id: backend.id,
    title: backend.title,
    description: backend.description || '',
    shortDescription: (backend as any).shortDescription || backend.description?.substring(0, 150) || '',
    category: (backend as any).category || {
      id: '',
      name: 'Chưa phân loại',
      description: '',
      icon: '📚',
      color: '#999999',
      isActive: true,
      courseCount: 0
    },
    instructor: (backend as any).instructor || {
      id: String((backend as any).instructorId || (backend as BackendCourseResponse).instructorId || ''),
      name: 'Giảng viên',
      email: '',
      bio: '',
      specialties: [],
      experience: 0,
      rating: 0,
      studentCount: 0,
      courseCount: 0,
      isVerified: false,
      socialLinks: []
    },
    level: (backend as any).level || 'beginner',
    duration: (backend as any).duration || 0,
    price: (backend as any).price || 0,
    tokenSymbol: (backend as any).tokenSymbol || 'LEARN',
    thumbnail: (backend as any).thumbnailUrl || (backend as BackendCourseResponse).thumbnailUrl || (backend as any).thumbnail || '',
    videoUrl: (backend as any).videoUrl,
    tags: (backend as any).tags || [],
    status: status as any,
    isPublished,
    isFeatured: (backend as any).isFeatured || false,
    enrollmentCount: (backend as any).enrollmentCount || 0,
    maxEnrollments: (backend as any).maxEnrollments,
    rating: (backend as any).rating || 0,
    reviewCount: (backend as any).reviewCount || 0,
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt,
    publishedAt: isPublished ? backend.createdAt : undefined,
    lessons: (backend as any).lessons || [],
    prerequisites: (backend as any).prerequisites || [],
    learningOutcomes: (backend as any).learningOutcomes || [],
    certificateAvailable: (backend as any).certificateAvailable || false,
    certificateTemplate: (backend as any).certificateTemplate
  }
}

/**
 * Chuyển từ Frontend CourseForm → Backend CreateCourseRequest
 * Chỉ lấy các field backend hỗ trợ
 */
export function courseFormToBackendCreateRequest(course: {
  id?: string
  title: string
  description?: string
  shortDescription?: string
  instructorId?: string
  thumbnail?: string
  isPublished?: boolean
  status?: string
}): {
  id?: string
  title: string
  instructorId?: number
  description?: string
  thumbnailUrl?: string
  visibility?: string
} {
  // Generate UUID nếu không có (backend yêu cầu)
  const courseId = course.id || crypto.randomUUID()
  
  return {
    id: courseId,
    title: course.title || '',
    instructorId: course.instructorId ? Number(course.instructorId) : undefined,
    description: course.description || course.shortDescription || '',
    thumbnailUrl: course.thumbnail,
    visibility: course.isPublished ? 'published' : (course.status || 'draft')
  }
}

/**
 * Chuyển từ Frontend CourseForm → Backend UpdateCourseRequest
 * Chỉ lấy các field backend hỗ trợ
 */
export function courseFormToBackendUpdateRequest(course: {
  title?: string
  description?: string
  shortDescription?: string
  thumbnail?: string
  isPublished?: boolean
  status?: string
}): {
  title?: string
  description?: string
  thumbnailUrl?: string
  visibility?: string
} {
  return {
    title: course.title,
    description: course.description || course.shortDescription,
    thumbnailUrl: course.thumbnail,
    visibility: course.isPublished ? 'published' : (course.status || 'draft')
  }
}

/**
 * Helper để map nhiều courses
 */
export function mapBackendCoursesToAdmin(courses: (BackendCourseResponse | ApiCourse)[]): AdminCourse[] {
  return courses.map(backendToAdminCourse)
}

/**
 * Helper để extract status/isPublished từ backend visibility
 */
export function extractCourseStatus(backend: BackendCourseResponse | ApiCourse): {
  status: 'draft' | 'published' | 'archived' | 'suspended'
  isPublished: boolean
} {
  const backendAny = backend as any
  const visibility = backendAny.visibility || ''
  
  if (visibility === 'published' || backendAny.isPublished === true) {
    return { status: 'published', isPublished: true }
  }
  if (visibility === 'draft' || backendAny.status === 'draft') {
    return { status: 'draft', isPublished: false }
  }
  if (visibility === 'archived' || backendAny.status === 'archived') {
    return { status: 'archived', isPublished: false }
  }
  if (visibility === 'suspended' || backendAny.status === 'suspended') {
    return { status: 'suspended', isPublished: false }
  }
  
  return { status: 'draft', isPublished: false }
}

/**
 * Helper để lấy thumbnail từ backend (có thể là thumbnailUrl hoặc thumbnail)
 */
export function getCourseThumbnail(backend: BackendCourseResponse | ApiCourse): string {
  const backendAny = backend as any
  return backendAny.thumbnailUrl || backendAny.thumbnail || ''
}

/**
 * Helper để lấy giá trị an toàn cho các field backend không có
 */
export function getCourseField<T>(backend: BackendCourseResponse | ApiCourse, field: string, defaultValue: T): T {
  const backendAny = backend as any
  return backendAny[field] !== undefined ? backendAny[field] : defaultValue
}

