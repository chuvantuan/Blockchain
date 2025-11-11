import React, { useState } from 'react'
import { Star, Info, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../atoms/Badge'
import InterviewCard from '../atoms/InterviewCard'

interface MockInterview {
    id: string
    title: string
    description: string
    duration: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    isLocked: boolean
    isFree: boolean
    isNew?: boolean
}

interface MockInterviewsProps {
    interviews?: MockInterview[]
    onStartInterview?: (interviewId: string) => void
    onUnlockInterview?: (interviewId: string) => void
}

export default function MockInterviews({
    interviews = [
        {
            id: '1',
            title: 'Kỹ sư phần mềm',
            description: 'Giải quyết vấn đề (Trung bình)',
            duration: '60 phút',
            difficulty: 'Medium',
            isLocked: false,
            isFree: true,
            isNew: true
        },
        {
            id: '2',
            title: 'Lập trình viên Frontend',
            description: 'React (Trung bình)',
            duration: '60 phút',
            difficulty: 'Medium',
            isLocked: true,
            isFree: false
        },
        {
            id: '3',
            title: 'Lập trình viên Backend',
            description: 'Node (Trung bình)',
            duration: '60 phút',
            difficulty: 'Medium',
            isLocked: true,
            isFree: false
        },
        {
            id: '4',
            title: 'Thiết kế hệ thống',
            description: 'Thiết kế kiến trúc (Trung bình)',
            duration: '60 phút',
            difficulty: 'Medium',
            isLocked: true,
            isFree: false
        },
        {
            id: '5',
            title: 'Khoa học dữ liệu',
            description: 'Python & Pandas (Khó)',
            duration: '90 phút',
            difficulty: 'Hard',
            isLocked: true,
            isFree: false
        }
    ],
    onStartInterview,
    onUnlockInterview
}: MockInterviewsProps): JSX.Element {
    const navigate = useNavigate()
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showUnlockModal, setShowUnlockModal] = useState(false)
    const [selectedInterview, setSelectedInterview] = useState<MockInterview | null>(null)

    const handleStartInterview = (interviewId: string) => {
        const interview = interviews.find(i => i.id === interviewId)
        if (interview && !interview.isLocked) {
            // Navigate to interview page
            navigate(`/user/interview/${interviewId}`)
            onStartInterview?.(interviewId)
        }
    }

    const handleUnlockInterview = (interviewId: string) => {
        const interview = interviews.find(i => i.id === interviewId)
        if (interview) {
            setSelectedInterview(interview)
            setShowUnlockModal(true)
            onUnlockInterview?.(interviewId)
        }
    }

    const handleLearnMore = () => {
        setShowInfoModal(true)
    }

    const handlePurchasePremium = () => {
        // Navigate to pricing/payment page
        navigate('/user/premium')
        setShowUnlockModal(false)
    }

    return (
        <>
            <div className="card stagger-load hover-lift interactive" style={{
                animationDelay: '100ms',
                height: '370px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, marginRight: '8px' }}>
                            Phỏng vấn mô phỏng AI
                        </h2>
                        <Badge variant="primary">
                            Mới
                        </Badge>
                    </div>
                    <button
                        onClick={handleLearnMore}
                        style={{
                            color: 'var(--primary)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--primary-light)'
                            e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none'
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                    >
                        <Info style={{ width: '16px', height: '16px' }} />
                        Tìm hiểu thêm
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', minHeight: 0 }}>
                    {/* Interview Cards Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '12px'
                    }}>
                        {interviews.map((interview) => (
                            <InterviewCard
                                key={interview.id}
                                interview={interview}
                                onStartInterview={handleStartInterview}
                                onUnlockInterview={handleUnlockInterview}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Info Modal */}
            {showInfoModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.2s ease'
                }}>
                    <div style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '32px',
                        maxWidth: '600px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        position: 'relative',
                        boxShadow: 'var(--shadow-xl)',
                        animation: 'slideInUp 0.3s ease'
                    }}>
                        <button
                            onClick={() => setShowInfoModal(false)}
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

                        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>
                            Phỏng vấn mô phỏng AI
                        </h2>

                        <div style={{ color: 'var(--foreground)', lineHeight: 1.6 }}>
                            <p style={{ marginBottom: '16px' }}>
                                <strong>Phỏng vấn mô phỏng AI</strong> là công cụ luyện tập phỏng vấn được hỗ trợ bởi trí tuệ nhân tạo, giúp bạn chuẩn bị cho các buổi phỏng vấn thực tế.
                            </p>

                            <h3 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                                Tính năng nổi bật:
                            </h3>
                            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                                <li style={{ marginBottom: '8px' }}>🤖 AI phỏng vấn thông minh với câu hỏi động</li>
                                <li style={{ marginBottom: '8px' }}>📊 Đánh giá chi tiết về kỹ năng và điểm mạnh/yếu</li>
                                <li style={{ marginBottom: '8px' }}>💡 Gợi ý cải thiện dựa trên hiệu suất</li>
                                <li style={{ marginBottom: '8px' }}>🎯 Phỏng vấn theo từng vị trí cụ thể</li>
                                <li style={{ marginBottom: '8px' }}>⏱️ Mô phỏng áp lực thời gian thực tế</li>
                            </ul>

                            <h3 style={{ fontSize: '20px', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>
                                Các loại phỏng vấn:
                            </h3>
                            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                                <li style={{ marginBottom: '8px' }}>Kỹ sư phần mềm - Giải quyết thuật toán</li>
                                <li style={{ marginBottom: '8px' }}>Frontend Developer - React, Vue, Angular</li>
                                <li style={{ marginBottom: '8px' }}>Backend Developer - Node.js, Python, Java</li>
                                <li style={{ marginBottom: '8px' }}>Thiết kế hệ thống - Kiến trúc quy mô lớn</li>
                                <li style={{ marginBottom: '8px' }}>Khoa học dữ liệu - ML, AI, Data Analysis</li>
                            </ul>

                            <div style={{
                                marginTop: '24px',
                                padding: '16px',
                                background: 'var(--primary-light)',
                                borderRadius: 'var(--radius-md)',
                                borderLeft: '4px solid var(--primary)'
                            }}>
                                <p style={{ margin: 0, fontWeight: 500 }}>
                                    💡 <strong>Mẹo:</strong> Hãy luyện tập thường xuyên để cải thiện kỹ năng phỏng vấn của bạn. Mỗi buổi phỏng vấn sẽ giúp bạn tự tin hơn!
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowInfoModal(false)}
                            style={{
                                marginTop: '24px',
                                width: '100%',
                                padding: '12px',
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
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
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}

            {/* Unlock Premium Modal */}
            {showUnlockModal && selectedInterview && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.2s ease'
                }}>
                    <div style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '32px',
                        maxWidth: '500px',
                        width: '90%',
                        position: 'relative',
                        boxShadow: 'var(--shadow-xl)',
                        animation: 'slideInUp 0.3s ease'
                    }}>
                        <button
                            onClick={() => setShowUnlockModal(false)}
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
                            <div style={{
                                width: '80px',
                                height: '80px',
                                margin: '0 auto 24px',
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '40px'
                            }}>
                                🔒
                            </div>

                            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
                                Nâng cấp Premium
                            </h2>

                            <p style={{ color: 'var(--muted-foreground)', marginBottom: '24px', lineHeight: 1.6 }}>
                                Phỏng vấn <strong>{selectedInterview.title}</strong> là nội dung Premium. Nâng cấp tài khoản để truy cập không giới hạn!
                            </p>

                            <div style={{
                                background: 'var(--muted)',
                                padding: '20px',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '24px',
                                textAlign: 'left'
                            }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                                    Premium bao gồm:
                                </h3>
                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                    <li style={{ marginBottom: '8px' }}>✅ Truy cập tất cả phỏng vấn mô phỏng</li>
                                    <li style={{ marginBottom: '8px' }}>✅ Báo cáo chi tiết về hiệu suất</li>
                                    <li style={{ marginBottom: '8px' }}>✅ Phỏng vấn không giới hạn</li>
                                    <li style={{ marginBottom: '8px' }}>✅ Hỗ trợ ưu tiên</li>
                                </ul>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setShowUnlockModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: 'var(--muted)',
                                        color: 'var(--foreground)',
                                        border: 'none',
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
                                    Để sau
                                </button>
                                <button
                                    onClick={handlePurchasePremium}
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
                                        transition: 'all 0.2s ease'
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
                                    Nâng cấp ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}