import React, { useState } from 'react'
import Modal from '../../components/common/Modal'
import { BookOpen, ListChecks, PlusCircle } from 'lucide-react'
import courseApi, { type Quiz, type CreateQuizRequest } from '../../../services/api/courseApi'

interface CourseQuizModalProps {
    isOpen: boolean
    onClose: () => void
	courseId?: string
}

export default function CourseQuizModal({ isOpen, onClose, courseId }: CourseQuizModalProps): JSX.Element {
    const [quizId, setQuizId] = useState('')
    const [loading, setLoading] = useState(false)
	const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [error, setError] = useState<string | null>(null)
	const [tab, setTab] = useState<'view' | 'create'>('view')
	const [creating, setCreating] = useState(false)
	const [form, setForm] = useState<CreateQuizRequest>({
		title: '',
		description: '',
		timeLimit: 30,
		passingScore: 60,
		questions: [
			{
				content: '',
				type: 'multiple',
				options: [
					{ content: '', isCorrect: true },
					{ content: '' }
				]
			}
		]
	})

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

	const addQuestion = () => {
		setForm(prev => ({
			...prev,
			questions: [
				...prev.questions,
				{ content: '', type: 'multiple', options: [{ content: '', isCorrect: true }, { content: '' }] }
			]
		}))
	}

	const removeQuestion = (idx: number) => {
		setForm(prev => ({
			...prev,
			questions: prev.questions.filter((_, i) => i !== idx)
		}))
	}

	const addOption = (qIdx: number) => {
		setForm(prev => {
			const next = { ...prev }
			next.questions[qIdx].options = [...(next.questions[qIdx].options || []), { content: '' }]
			return next
		})
	}

	const removeOption = (qIdx: number, oIdx: number) => {
		setForm(prev => {
			const next = { ...prev }
			next.questions[qIdx].options = (next.questions[qIdx].options || []).filter((_, i) => i !== oIdx)
			return next
		})
	}

	const updateQuestion = (qIdx: number, field: 'content' | 'type', value: string) => {
		setForm(prev => {
			const next = { ...prev }
			;(next.questions[qIdx] as any)[field] = value
			return next
		})
	}

	const updateOption = (qIdx: number, oIdx: number, field: 'content' | 'isCorrect', value: any) => {
		setForm(prev => {
			const next = { ...prev }
			const options = next.questions[qIdx].options || []
			;(options[oIdx] as any)[field] = value
			// Ensure at least one correct
			if (field === 'isCorrect' && value === true) {
				// allow multi-correct; do nothing special
			}
			return next
		})
	}

	const handleCreate = async () => {
		if (!courseId) {
			setError('Thiếu courseId để tạo quiz')
			return
		}
		if (!form.title.trim() || form.questions.length === 0) {
			setError('Vui lòng nhập tiêu đề và ít nhất 1 câu hỏi')
			return
		}
		try {
			setCreating(true)
			setError(null)
			// Clean form
			const payload: CreateQuizRequest = {
				title: form.title.trim(),
				description: form.description?.trim() || undefined,
				// Backend expects timeLimitMinutes
				timeLimit: undefined,
				passingScore: form.passingScore,
				questions: form.questions.map((q, idx) => {
					const options = (q.options || [])
						.map(o => ({ content: o.content.trim(), isCorrect: !!o.isCorrect }))
						.filter(o => o.content.length > 0)
					// ensure at least 1 option
					if (options.length === 0) {
						options.push({ content: 'Đáp án 1', isCorrect: true })
					}
					// ensure at least one correct
					if (!options.some(o => o.isCorrect)) {
						options[0].isCorrect = true
					}
					return {
						content: q.content.trim(),
						type: q.type,
						displayOrder: idx + 1,
						options
					}
				}).filter(q => q.content.length > 0)
			}
			// Map field name for backend timeLimitMinutes
			const body: any = {
				...payload,
				timeLimitMinutes: form.timeLimit
			}
			const res = await courseApi.createQuiz(courseId, body)
			// Show created quiz details if backend returns it
			if (res.data) {
				try {
					const id = (res.data as any).id || (res.data as any).quizId
					if (id) {
						const detail = await courseApi.getQuizDetails(id)
						setQuiz(detail.data ?? null)
						setTab('view')
					}
				} catch {}
			}
		} catch (e: any) {
			setError(e?.message || 'Tạo quiz thất bại')
		} finally {
			setCreating(false)
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
					<div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
						<button className={`btn ${tab === 'view' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('view')}>Xem quiz</button>
						<button className={`btn ${tab === 'create' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('create')}>Tạo quiz</button>
					</div>
					{tab === 'view' && (
						<>
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
						</>
					)}
					{tab === 'create' && (
						<>
							<div className="section-title">
								<PlusCircle />
								<h4>Tạo quiz mới cho khóa học</h4>
							</div>
							<div style={{ display: 'grid', gap: 8 }}>
								<input className="form-input" placeholder="Tiêu đề" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
								<textarea className="form-textarea" rows={3} placeholder="Mô tả" value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} />
								<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
									<input className="form-input" type="number" placeholder="Thời gian (phút)" value={form.timeLimit ?? ''} onChange={e => setForm(prev => ({ ...prev, timeLimit: Number(e.target.value) || undefined }))} style={{ maxWidth: 180 }} />
									<input className="form-input" type="number" placeholder="Điểm đạt (%)" value={form.passingScore ?? ''} onChange={e => setForm(prev => ({ ...prev, passingScore: Number(e.target.value) || undefined }))} style={{ maxWidth: 180 }} />
								</div>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<h5 style={{ margin: 0 }}>Câu hỏi</h5>
									<button className="btn btn-secondary" type="button" onClick={addQuestion}>Thêm câu hỏi</button>
								</div>
								{form.questions.map((q, qi) => (
									<div key={qi} className="modal-card">
										<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
											<input className="form-input" placeholder={`Nội dung câu hỏi #${qi + 1}`} value={q.content} onChange={e => updateQuestion(qi, 'content', e.target.value)} style={{ minWidth: 260, flex: 1 }} />
											<select className="form-input" value={q.type} onChange={e => updateQuestion(qi, 'type', e.target.value)} style={{ maxWidth: 180 }}>
												<option value="multiple">Multiple choice</option>
												<option value="single">Single choice</option>
											</select>
											<button className="btn btn-secondary" type="button" onClick={() => removeQuestion(qi)}>Xóa</button>
										</div>
										<div style={{ marginTop: 8 }}>
											<h6 style={{ margin: '8px 0' }}>Đáp án</h6>
											{(q.options || []).map((opt, oi) => (
												<div key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
													<input className="form-input" placeholder={`Đáp án #${oi + 1}`} value={opt.content} onChange={e => updateOption(qi, oi, 'content', e.target.value)} style={{ flex: 1, minWidth: 220 }} />
													<label className="form-checkbox">
														<input type="checkbox" checked={!!opt.isCorrect} onChange={e => updateOption(qi, oi, 'isCorrect', e.target.checked)} />
														<span>Đúng</span>
													</label>
													<button className="btn btn-secondary" type="button" onClick={() => removeOption(qi, oi)}>Xóa</button>
												</div>
											))}
											<button className="btn btn-secondary" type="button" onClick={() => addOption(qi)}>Thêm đáp án</button>
										</div>
									</div>
								))}
								<div>
									<button className="btn btn-primary" type="button" onClick={handleCreate} disabled={creating}>
										{creating ? 'Đang tạo...' : 'Tạo quiz'}
									</button>
								</div>
							</div>
						</>
					)}
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


