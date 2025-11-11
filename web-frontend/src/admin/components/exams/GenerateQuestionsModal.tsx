import React, { useState, useMemo } from 'react'
import Modal from '../common/Modal'
import { Shuffle, Search, AlertCircle, Check } from 'lucide-react'
import { Exam, EnumOption } from '../../types/exam'

interface GenerateQuestionsModalProps {
	isOpen: boolean
	onClose: () => void
	onGenerate: (examId: string, config: GenerateConfig) => Promise<void>
	exams: Exam[] // Danh sách đề thi đang có
	subjects?: string[]
	difficulties?: EnumOption[]
}

interface GenerateConfig {
	difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
	useCustomDistribution: boolean
	easyCount?: number
	mediumCount?: number
	hardCount?: number
}

const DEFAULT_DIFFICULTIES = [
	{ code: 'easy', labelVi: 'Chỉ câu dễ' },
	{ code: 'medium', labelVi: 'Chỉ câu trung bình' },
	{ code: 'hard', labelVi: 'Chỉ câu khó' },
	{ code: 'mixed', labelVi: 'Trộn lẫn (Dễ + TB + Khó)' },
]

export default function GenerateQuestionsModal({
	isOpen,
	onClose,
	onGenerate,
	exams,
	subjects: propSubjects,
	difficulties: propDifficulties
}: GenerateQuestionsModalProps): JSX.Element {
	
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedExamId, setSelectedExamId] = useState<string | null>(null)
	const [selectedSubject, setSelectedSubject] = useState<string>('all')
	const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed')
	const [useCustomDistribution, setUseCustomDistribution] = useState(false)
	const [easyCount, setEasyCount] = useState(10)
	const [mediumCount, setMediumCount] = useState(15)
	const [hardCount, setHardCount] = useState(5)
	const [isGenerating, setIsGenerating] = useState(false)

	const eligibleExams = useMemo(() => {
		return exams.filter(exam => (exam.assignedQuestionCount ?? 0) === 0)
	}, [exams])

	// Get unique subjects from exams
	const availableSubjects = useMemo(() => {
		const subjects = new Set(eligibleExams.map(e => e.subject))
		return Array.from(subjects).sort()
	}, [eligibleExams])

	// Use API difficulties or fallback
	const availableDifficulties = useMemo(() => {
		if (propDifficulties && propDifficulties.length > 0) {
			return [
				{ code: 'mixed', labelVi: 'Trộn lẫn (Dễ + TB + Khó)' },
				...propDifficulties.map(d => ({ code: d.code, labelVi: `Chỉ ${d.labelVi.toLowerCase()}` }))
			]
		}
		return DEFAULT_DIFFICULTIES
	}, [propDifficulties])

	// Filter exams
	const filteredExams = useMemo(() => {
		return eligibleExams.filter(exam => {
			const matchSearch = searchTerm === '' || 
				exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(exam.description || '').toLowerCase().includes(searchTerm.toLowerCase())
			
			const matchSubject = selectedSubject === 'all' || exam.subject === selectedSubject
			
			return matchSearch && matchSubject
		})
	}, [eligibleExams, searchTerm, selectedSubject])

	const selectedExam = useMemo(() => {
		return eligibleExams.find(e => e.id === selectedExamId)
	}, [eligibleExams, selectedExamId])

	const handleGenerate = async () => {
		if (!selectedExamId || !selectedExam) return

		setIsGenerating(true)
		try {
			const config: GenerateConfig = {
				difficulty,
				useCustomDistribution,
				...(useCustomDistribution && difficulty === 'mixed' && {
					easyCount,
					mediumCount,
					hardCount
				})
			}
			
			await onGenerate(selectedExamId, config)
			resetForm()
		} catch (error) {
			console.error('Error generating questions:', error)
		} finally {
			setIsGenerating(false)
		}
	}

	const resetForm = () => {
		setSearchTerm('')
		setSelectedExamId(null)
		setSelectedSubject('all')
		setDifficulty('mixed')
		setUseCustomDistribution(false)
		setEasyCount(10)
		setMediumCount(15)
		setHardCount(5)
	}

	const handleClose = () => {
		if (!isGenerating) {
			resetForm()
			onClose()
		}
	}

	// Validate custom distribution
	const isValidDistribution = () => {
		if (!selectedExam) return false
		if (!useCustomDistribution || difficulty !== 'mixed') return true
		return (easyCount + mediumCount + hardCount) === selectedExam.totalQuestions
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title="Sinh câu hỏi ngẫu nhiên cho đề thi"
			maxWidth="800px"
			footer={
				<>
					<button 
						className="btn btn-secondary"
						onClick={handleClose}
						disabled={isGenerating}
					>
						Hủy
					</button>
					<button 
						className="btn btn-primary"
						onClick={handleGenerate}
						disabled={!selectedExamId || !isValidDistribution() || isGenerating}
					>
						<Shuffle size={18} />
						{isGenerating ? 'Đang sinh câu hỏi...' : 'Sinh câu hỏi'}
					</button>
				</>
			}
		>
			<div className="modal-content-wrapper">
				{/* Step 1: Select Exam */}
				<div className="modal-form-group">
				<label className="form-label" style={{ fontSize: '15px', marginBottom: '12px', display: 'block' }}>
					Bước 1: Chọn đề thi <span className="required">*</span>
					</label>

				{/* Search and Filter */}
				<div style={{ marginBottom: '12px' }}>
					<div style={{ position: 'relative' }}>
						<Search 
							size={18} 
							style={{ 
								position: 'absolute', 
								left: '12px', 
								top: '50%', 
								transform: 'translateY(-50%)',
								color: 'var(--muted-foreground)' 
							}} 
						/>
						<input
							type="text"
							className="form-input"
							placeholder="Tìm kiếm đề thi..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							style={{ paddingLeft: '40px' }}
						/>
					</div>
				</div>
				<div style={{ marginBottom: '12px' }}>
					<select
						className="form-select"
						value={selectedSubject}
						onChange={(e) => setSelectedSubject(e.target.value)}
						style={{ width: '100%' }}
					>
						<option value="all">Tất cả môn học</option>
						{availableSubjects.map(subject => (
							<option key={subject} value={subject}>{subject}</option>
						))}
					</select>
					</div>

					{/* Exam List */}
					<div style={{
						border: '1px solid var(--border)',
						borderRadius: 'var(--radius-md)',
						maxHeight: '300px',
						overflowY: 'auto',
						background: 'var(--card)'
					}}>
				{filteredExams.length === 0 ? (
							<div style={{
								padding: '32px',
								textAlign: 'center',
								color: 'var(--muted-foreground)'
							}}>
								<AlertCircle size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
						<p>Không có đề thi nào chưa có câu hỏi.</p>
						{eligibleExams.length === 0 && (
							<p style={{ marginTop: '8px', fontSize: '13px' }}>
								Tất cả đề thi hiện tại đã có câu hỏi. Vui lòng tạo đề mới hoặc xóa câu hỏi cũ.
							</p>
						)}
							</div>
						) : (
							filteredExams.map(exam => (
								<div
									key={exam.id}
									onClick={() => setSelectedExamId(exam.id)}
									style={{
										padding: '12px 16px',
										borderBottom: '1px solid var(--border)',
										cursor: 'pointer',
										background: selectedExamId === exam.id ? 'var(--accent)' : 'transparent',
										transition: 'all 0.2s',
										display: 'flex',
										alignItems: 'center',
										gap: '12px'
									}}
									onMouseEnter={(e) => {
										if (selectedExamId !== exam.id) {
											e.currentTarget.style.background = 'var(--muted)'
										}
									}}
									onMouseLeave={(e) => {
										if (selectedExamId !== exam.id) {
											e.currentTarget.style.background = 'transparent'
										}
									}}
								>
									<div style={{
										width: '20px',
										height: '20px',
										borderRadius: '50%',
										border: '2px solid',
										borderColor: selectedExamId === exam.id ? 'var(--primary)' : 'var(--border)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										flexShrink: 0,
										background: selectedExamId === exam.id ? 'var(--primary)' : 'transparent'
									}}>
										{selectedExamId === exam.id && (
											<Check size={12} style={{ color: 'white' }} />
										)}
									</div>
									<div style={{ flex: 1 }}>
										<div style={{ 
											fontWeight: 600, 
											marginBottom: '4px',
											color: 'var(--foreground)'
										}}>
											{exam.title}
										</div>
										<div style={{ 
											fontSize: '13px', 
											color: 'var(--muted-foreground)',
											display: 'flex',
											gap: '12px',
											flexWrap: 'wrap'
										}}>
							<span>📚 {exam.subject}</span>
							<span>❓ {exam.assignedQuestionCount}/{exam.totalQuestions} câu</span>
											<span>⏱️ {exam.duration} phút</span>
										</div>
									</div>
								</div>
							))
						)}
					</div>

				{filteredExams.length > 0 && (
						<div style={{ 
							marginTop: '8px', 
							fontSize: '13px', 
							color: 'var(--muted-foreground)' 
						}}>
						Hiển thị {filteredExams.length} / {eligibleExams.length} đề thi đủ điều kiện
						</div>
					)}
				</div>

				{/* Step 2: Configure Generation (only show if exam is selected) */}
				{selectedExam && (
					<>
						<div style={{
							height: '1px',
							background: 'var(--border)',
							margin: '24px 0'
						}} />

						<div>
							<label className="form-label" style={{ fontSize: '15px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
								<Shuffle size={18} />
								Bước 2: Cấu hình sinh câu hỏi
							</label>

							<div style={{
								padding: '12px',
								background: 'var(--muted)',
								borderRadius: 'var(--radius-md)',
								marginBottom: '16px',
								fontSize: '13px',
								lineHeight: '1.6'
							}}>
								<div><strong>Đề thi đã chọn:</strong> {selectedExam.title}</div>
								<div><strong>Số câu hỏi cần sinh:</strong> {selectedExam.totalQuestions} câu</div>
							</div>

							<div className="modal-form-group">
								<label className="form-label">Độ khó <span className="required">*</span></label>
								<select
									className="form-select"
									value={difficulty}
									onChange={(e) => setDifficulty(e.target.value as any)}
								>
									{availableDifficulties.map(d => (
										<option key={d.code} value={d.code}>{d.labelVi}</option>
									))}
								</select>
							</div>

							{difficulty === 'mixed' && (
								<>
									<div className="modal-form-group">
										<label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
											<input
												type="checkbox"
												checked={useCustomDistribution}
												onChange={(e) => {
													setUseCustomDistribution(e.target.checked)
													if (e.target.checked) {
														// Auto-calculate reasonable distribution
														const total = selectedExam.totalQuestions
														const easy = Math.floor(total * 0.3)
														const hard = Math.floor(total * 0.2)
														const medium = total - easy - hard
														setEasyCount(easy)
														setMediumCount(medium)
														setHardCount(hard)
													}
												}}
												style={{ 
													cursor: 'pointer',
													width: '16px',
													height: '16px',
													flexShrink: 0,
													margin: 0
												}}
											/>
											<span style={{ fontSize: '14px', fontWeight: 500 }}>
												Tùy chỉnh phân bổ độ khó
											</span>
										</label>
									</div>

									{useCustomDistribution && (
										<div className="modal-form-group">
											<div 
												style={{ 
													padding: '12px',
													background: 'var(--muted)',
													borderRadius: 'var(--radius-md)',
													marginBottom: '16px',
													display: 'flex',
													alignItems: 'center',
													gap: '8px',
													fontSize: '13px'
												}}
											>
												<AlertCircle size={16} />
												<span>
													Tổng phải bằng {selectedExam.totalQuestions} câu. 
													Hiện tại: {easyCount + mediumCount + hardCount} câu
												</span>
											</div>

											<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
												<div>
													<label className="form-label">Số câu dễ</label>
													<input
														type="number"
														className="form-input"
														value={easyCount}
														onChange={(e) => setEasyCount(parseInt(e.target.value) || 0)}
														min="0"
														max={selectedExam.totalQuestions}
													/>
												</div>

												<div>
													<label className="form-label">Số câu trung bình</label>
													<input
														type="number"
														className="form-input"
														value={mediumCount}
														onChange={(e) => setMediumCount(parseInt(e.target.value) || 0)}
														min="0"
														max={selectedExam.totalQuestions}
													/>
												</div>

												<div>
													<label className="form-label">Số câu khó</label>
													<input
														type="number"
														className="form-input"
														value={hardCount}
														onChange={(e) => setHardCount(parseInt(e.target.value) || 0)}
														min="0"
														max={selectedExam.totalQuestions}
													/>
												</div>
											</div>

											{!isValidDistribution() && (
												<div 
													style={{ 
														padding: '12px',
														background: '#fee',
														border: '1px solid #fcc',
														borderRadius: 'var(--radius-md)',
														color: '#c33',
														fontSize: '13px',
														display: 'flex',
														alignItems: 'center',
														gap: '8px'
													}}
												>
													<AlertCircle size={16} />
													<span>
														Tổng số câu ({easyCount + mediumCount + hardCount}) 
														phải bằng {selectedExam.totalQuestions}
													</span>
												</div>
											)}
										</div>
									)}
								</>
							)}

							<div 
								style={{ 
									marginTop: '16px',
									padding: '16px',
									background: 'var(--accent)',
									color: 'var(--accent-foreground)',
									borderRadius: 'var(--radius-md)',
									fontSize: '13px',
									lineHeight: '1.6'
								}}
							>
								<strong style={{ display: 'block', marginBottom: '4px' }}>💡 Lưu ý:</strong>
								Hệ thống sẽ tự động chọn ngẫu nhiên câu hỏi từ ngân hàng đề thi 
								theo môn học <strong>{selectedExam.subject}</strong> và độ khó đã chọn.
							</div>
						</div>
					</>
				)}
			</div>
		</Modal>
	)
}

