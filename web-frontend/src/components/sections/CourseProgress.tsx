import React, { useState, useEffect } from 'react'
import { X, BookOpen, Award, Clock, TrendingUp, CheckCircle, PlayCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CourseCard from '../atoms/CourseCard'
import courseApi from '../../services/api/courseApi'
import { useAppSelector } from '../../store/hooks'

interface Course {
    id: string
    title: string
    progress: number
    totalLessons: number
    completedLessons: number
    duration: string
    nextLesson?: string
    certificate?: boolean
}

interface CourseProgressProps {
    courses?: Course[]
    onContinueCourse?: (courseId: string) => void
    onViewCourse?: (courseId: string) => void
}

export default function CourseProgress({
    courses: propCourses,
    onContinueCourse,
    onViewCourse
}: CourseProgressProps): JSX.Element {
    const navigate = useNavigate()
    const { user } = useAppSelector((state) => state.auth)
    const [showCourseDetailModal, setShowCourseDetailModal] = useState(false)
    const [showCompletionModal, setShowCompletionModal] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [courses, setCourses] = useState<Course[]>(propCourses || [])
    const [loading, setLoading] = useState(!propCourses)

    useEffect(() => {
        if (!propCourses && user?.id) {
            fetchEnrolledCourses()
        }
    }, [propCourses, user])

    const fetchEnrolledCourses = async () => {
        if (!user?.id) return
        
        try {
            setLoading(true)
            // Fetch courses with progress
            const coursesResponse = await courseApi.getAllCourses(0, 4)
            const coursesData = coursesResponse.data.content
            
            // Fetch progress for each course and transform data
            const coursesWithProgress = await Promise.all(
                coursesData.slice(0, 4).map(async (course) => {
                    try {
                        const progressResponse = await courseApi.getStudentProgress(Number(user.id), course.id)
                        const progress = progressResponse.data
                        const materialsResponse = await courseApi.getCourseMaterials(course.id)
                        const materials = materialsResponse.data
                        
                        return {
                            id: course.id,
                            title: course.title,
                            progress: progress.progressPercentage,
                            totalLessons: materials.length,
                            completedLessons: progress.completedMaterials.length,
                            duration: `${course.duration} giờ`,
                            certificate: course.certificateAvailable
                        }
                    } catch (err) {
                        // If no progress, return with 0 progress
                        return {
                            id: course.id,
                            title: course.title,
                            progress: 0,
                            totalLessons: 0,
                            completedLessons: 0,
                            duration: `${course.duration} giờ`,
                            certificate: course.certificateAvailable
                        }
                    }
                })
            )
            
            setCourses(coursesWithProgress)
        } catch (err) {
            console.error('Error fetching enrolled courses:', err)
            // Set empty courses on error
            setCourses([])
        } finally {
            setLoading(false)
        }
    }

    const handleContinueCourse = (courseId: string) => {
        const course = courses.find(c => c.id === courseId)
        if (course) {
            if (course.progress === 100) {
                // Show completion modal
                setSelectedCourse(course)
                setShowCompletionModal(true)
            } else {
                // Navigate to continue course
                navigate(`/user/courses/${courseId}/learn`)
            }
            onContinueCourse?.(courseId)
        }
    }

    const handleViewCourse = (courseId: string) => {
        const course = courses.find(c => c.id === courseId)
        if (course) {
            setSelectedCourse(course)
            setShowCourseDetailModal(true)
            onViewCourse?.(courseId)
        }
    }

    const handleViewAllCourses = () => {
        navigate('/user/courses')
    }

    const handleViewCertificate = () => {
        if (selectedCourse) {
            navigate(`/user/certificate/${selectedCourse.id}`)
        }
    }

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'var(--primary)'
        if (progress >= 60) return 'var(--primary)'
        if (progress >= 40) return 'var(--accent)'
        return 'var(--destructive)'
    }

    const getProgressMessage = (progress: number) => {
        if (progress === 100) return 'Đã hoàn thành! 🎉'
        if (progress >= 80) return 'Sắp hoàn thành! 💪'
        if (progress >= 60) return 'Đang tiến bộ tốt! 👍'
        if (progress >= 40) return 'Tiếp tục phát huy! ✓'
        if (progress >= 20) return 'Đang bắt đầu'
        return 'Mới bắt đầu'
    }

    return (
        <>
            <div
                className="card stagger-load hover-lift interactive"
                style={{
                    animationDelay: '400ms',
                    height: '490px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
                        Tiến độ khóa học
                    </h3>
                    <button
                        onClick={handleViewAllCourses}
                        style={{
                            fontSize: '14px',
                            color: 'var(--primary)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: 500
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary-light)'
                            e.currentTarget.style.textDecoration = 'underline'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none'
                            e.currentTarget.style.textDecoration = 'none'
                        }}
                    >
                        Xem khóa học
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted-foreground)' }}>
                            Đang tải...
                        </div>
                    ) : courses.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted-foreground)' }}>
                            <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                            <p>Bạn chưa đăng ký khóa học nào</p>
                            <button
                                onClick={handleViewAllCourses}
                                style={{
                                    marginTop: '12px',
                                    padding: '8px 16px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Khám phá khóa học
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {courses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    onContinueCourse={handleContinueCourse}
                                    onViewCourse={handleViewCourse}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Course Detail Modal */}
            {showCourseDetailModal && selectedCourse && (
                <div 
                    onClick={() => setShowCourseDetailModal(false)}
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999,
                        backdropFilter: 'blur(4px)',
                        animation: 'fadeIn 0.2s ease',
                        padding: '20px',
                        boxSizing: 'border-box'
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--card)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '32px',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            animation: 'modalSlideIn 0.3s ease forwards'
                        }}
                    >
                        <button
                            onClick={() => setShowCourseDetailModal(false)}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'var(--muted)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--destructive)'
                                e.currentTarget.style.transform = 'scale(1.1)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--muted)'
                                e.currentTarget.style.transform = 'scale(1)'
                            }}
                        >
                            <X style={{ width: '20px', height: '20px' }} />
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            {/* Progress Circle */}
                            <div style={{
                                width: '120px',
                                height: '120px',
                                margin: '0 auto 24px',
                                background: `linear-gradient(135deg, ${getProgressColor(selectedCourse.progress)}, var(--accent))`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                            }}>
                                <span style={{ fontSize: '36px', fontWeight: 700, color: 'white' }}>
                                    {selectedCourse.progress}%
                                </span>
                                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)' }}>
                                    Hoàn thành
                                </span>
                            </div>

                            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                                {selectedCourse.title}
                            </h2>

                            <p style={{
                                fontSize: '18px',
                                fontWeight: 600,
                                color: getProgressColor(selectedCourse.progress),
                                marginBottom: '24px'
                            }}>
                                {getProgressMessage(selectedCourse.progress)}
                            </p>

                            {/* Stats Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '16px',
                                marginBottom: '24px',
                                textAlign: 'left'
                            }}>
                                <div style={{
                                    padding: '16px',
                                    background: 'var(--muted)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        <Clock style={{ width: '16px', height: '16px', color: 'var(--primary)', marginRight: '8px' }} />
                                        <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                                            Thời lượng
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
                                        {selectedCourse.duration}
                                    </p>
                                </div>

                                <div style={{
                                    padding: '16px',
                                    background: 'var(--muted)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        <BookOpen style={{ width: '16px', height: '16px', color: 'var(--primary)', marginRight: '8px' }} />
                                        <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                                            Bài học
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
                                        {selectedCourse.completedLessons}/{selectedCourse.totalLessons}
                                    </p>
                                </div>

                                <div style={{
                                    padding: '16px',
                                    background: 'var(--muted)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        <TrendingUp style={{ width: '16px', height: '16px', color: 'var(--primary)', marginRight: '8px' }} />
                                        <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                                            Tiến độ
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
                                        {selectedCourse.progress}%
                                    </p>
                                </div>

                                <div style={{
                                    padding: '16px',
                                    background: 'var(--muted)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                        <Award style={{ width: '16px', height: '16px', color: 'var(--primary)', marginRight: '8px' }} />
                                        <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
                                            Chứng chỉ
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
                                        {selectedCourse.certificate ? 'Có' : 'Không'}
                                    </p>
                                </div>
                            </div>

                            {/* Next Lesson Info */}
                            {selectedCourse.nextLesson && selectedCourse.progress < 100 && (
                                <div style={{
                                    padding: '16px',
                                    background: 'var(--primary-light)',
                                    borderRadius: 'var(--radius-md)',
                                    borderLeft: '4px solid var(--primary)',
                                    marginBottom: '24px',
                                    textAlign: 'left'
                                }}>
                                    <p style={{ margin: 0, fontSize: '14px' }}>
                                        <strong>Bài học tiếp theo:</strong>
                                    </p>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--primary)' }}>
                                        {selectedCourse.nextLesson}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button
                                    onClick={() => {
                                        setShowCourseDetailModal(false)
                                        handleContinueCourse(selectedCourse.id)
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)'
                                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <PlayCircle style={{ width: '20px', height: '20px' }} />
                                    {selectedCourse.progress === 100 ? 'Xem lại' : 'Tiếp tục học'}
                                </button>

                                {selectedCourse.certificate && selectedCourse.progress === 100 && (
                                    <button
                                        onClick={handleViewCertificate}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'var(--muted)',
                                            color: 'var(--foreground)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--border)'
                                            e.currentTarget.style.borderColor = 'var(--primary)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'var(--muted)'
                                            e.currentTarget.style.borderColor = 'var(--border)'
                                        }}
                                    >
                                        <Award style={{ width: '20px', height: '20px' }} />
                                        Xem chứng chỉ
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Completion Modal */}
            {showCompletionModal && selectedCourse && selectedCourse.progress === 100 && (
                <div 
                    onClick={() => setShowCompletionModal(false)}
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 99999,
                        backdropFilter: 'blur(4px)',
                        animation: 'fadeIn 0.2s ease',
                        padding: '20px',
                        boxSizing: 'border-box'
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'var(--card)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '48px 32px',
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            animation: 'modalSlideIn 0.3s ease forwards',
                            textAlign: 'center'
                        }}
                    >
                        <button
                            onClick={() => setShowCompletionModal(false)}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'var(--muted)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--destructive)'
                                e.currentTarget.style.transform = 'scale(1.1)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--muted)'
                                e.currentTarget.style.transform = 'scale(1)'
                            }}
                        >
                            <X style={{ width: '20px', height: '20px' }} />
                        </button>

                        {/* Success Icon */}
                        <div style={{
                            width: '100px',
                            height: '100px',
                            margin: '0 auto 24px',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '50px'
                        }}>
                            🎉
                        </div>

                        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
                            Chúc mừng!
                        </h2>

                        <p style={{ fontSize: '16px', color: 'var(--muted-foreground)', marginBottom: '24px', lineHeight: 1.6 }}>
                            Bạn đã hoàn thành khóa học<br />
                            <strong style={{ color: 'var(--foreground)' }}>{selectedCourse.title}</strong>
                        </p>

                        <div style={{
                            background: 'var(--muted)',
                            padding: '16px',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '24px'
                        }}>
                            <CheckCircle style={{
                                width: '40px',
                                height: '40px',
                                color: 'var(--primary)',
                                marginBottom: '12px'
                            }} />
                            <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted-foreground)' }}>
                                Hoàn thành {selectedCourse.totalLessons} bài học
                            </p>
                            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--muted-foreground)' }}>
                                Tổng thời lượng: {selectedCourse.duration}
                            </p>
                        </div>

                        {selectedCourse.certificate && (
                            <button
                                onClick={handleViewCertificate}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    marginBottom: '12px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                <Award style={{ width: '20px', height: '20px' }} />
                                Nhận chứng chỉ
                            </button>
                        )}

                        <button
                            onClick={() => setShowCompletionModal(false)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'var(--muted)',
                                color: 'var(--foreground)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--border)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--muted)'
                            }}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Add animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </>
    )
}