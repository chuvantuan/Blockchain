import React, { useState } from 'react'
import Modal from '../../components/common/Modal'
import { BookOpen, ListChecks, PlusCircle } from 'lucide-react'
import courseApi, { type Quiz } from '../../../services/api/courseApi'

interface CourseQuizModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function CourseQuizModal({ isOpen, onClose }: CourseQuizModalProps): JSX.Element {
    const [quizId, setQuizId] = useState('')
    const [loading, setLoading] = useState(false)
	const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [error, setError] = useState<string | null>(null)

    const fetchQuiz = async () => {
        setError(null)
        setQuiz(null)
        if (!quizId.trim()) return
        setLoading(true)
        try {
            const res = await courseApi.getQuizDetails(quizId.trim())
			setQuiz(res.data ?? null)
        } catch (e: any) {
            setError(e?.message || 'Không lấy được chi tiết quiz')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Quản trị Quiz"
            maxWidth="900px"
            footer={
                <>
                    <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
                </>
            }
        >
            <div className="modal-content-wrapper">
                <div className="modal-form-section">
                    <div className="section-title">
                        <BookOpen />
                        <h4>Lấy chi tiết Quiz theo ID</h4>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <input
                            className="form-input"
                            placeholder="Nhập Quiz ID (UUID)"
                            value={quizId}
                            onChange={(e) => setQuizId(e.target.value)}
                            style={{ minWidth: 320 }}
                        />
                        <button className="btn btn-primary" onClick={fetchQuiz} disabled={loading}>
                            <ListChecks size={16} />
                            Xem chi tiết
                        </button>
                        <button className="btn btn-secondary" title="Tạo quiz (chưa hỗ trợ)" disabled>
                            <PlusCircle size={16} />
                            Tạo quiz (backend chưa hỗ trợ)
                        </button>
                    </div>
                    {error && <div style={{ color: 'var(--destructive)' }}>{error}</div>}
                </div>

                {loading ? (
                    <div>Đang tải quiz...</div>
                ) : quiz ? (
                    <div className="modal-detail-section">
                        <div className="section-title">
                            <ListChecks />
                            <h4>Chi tiết Quiz</h4>
                        </div>
                        <div style={{ marginBottom: 8, fontWeight: 600 }}>{quiz.title}</div>
                        <div style={{ color: 'var(--muted-foreground)', marginBottom: 12 }}>{quiz.description}</div>
                        <ul className="modal-list">
					{(quiz.questions || []).map((q, idx) => (
						<li key={q.id || idx} className="list-item">
                                    <div className="item-icon">Q{idx + 1}</div>
                                    <div className="item-content">
								<div className="item-title">{q.content}</div>
								<div className="item-subtitle" style={{ color: 'var(--muted-foreground)', fontSize: 12 }}>
									{q.type} • {Array.isArray(q.options) ? `${q.options.length} lựa chọn` : '—'}
                                        </div>
								{Array.isArray(q.options) && q.options.length > 0 && (
									<ul style={{ marginTop: 8, paddingLeft: 18, color: 'var(--muted-foreground)', fontSize: 12 }}>
										{q.options.map(option => (
											<li key={option.id || option.content}>
												{option.content}
												{option.isCorrect ? ' ✅' : ''}
											</li>
										))}
									</ul>
								)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </div>
        </Modal>
    )
}


