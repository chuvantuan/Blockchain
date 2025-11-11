import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { examService } from '../services/examService';
import { ExamDetails } from '../utils/types';
import Button from '../components/atoms/Button';

interface ExamWithStatus extends ExamDetails {
	status?: 'not-started' | 'in-progress' | 'completed';
	score?: number;
	submissionId?: string;
}

export default function ExamPage(): JSX.Element {
	const navigate = useNavigate();
	const [exams, setExams] = useState<ExamWithStatus[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [hasFetched, setHasFetched] = useState(false);

	// ✅ FIX: Add guard to prevent duplicate fetch in React StrictMode
	useEffect(() => {
		if (!hasFetched) {
			loadExams();
			setHasFetched(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasFetched]);

	const loadExams = async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch all available exams
			const allExams = await examService.getAllExams();
			
			// Fetch user's submissions to check status
			const submissions = await examService.getMySubmissions();
			
			// Merge exam data with submission status
			const examsWithStatus: ExamWithStatus[] = allExams.map(exam => {
				const submission = submissions.find((s: any) => s.quizId === exam.id);
				
				if (submission) {
					// CRITICAL: Check if truly completed (has valid submittedAt)
					const hasValidSubmittedAt = submission.submittedAt && 
						submission.submittedAt !== null && 
						submission.submittedAt !== '' &&
						submission.submittedAt !== 'null';
					
					if (hasValidSubmittedAt) {
						return {
							...exam,
							status: 'completed' as const,
							score: submission.score,
							submissionId: submission.id
						};
					} else {
						return {
							...exam,
							status: 'in-progress' as const,
							submissionId: submission.id
						};
					}
				}
				
				return {
					...exam,
					status: 'not-started' as const
				};
			});

			setExams(examsWithStatus);
		} catch (err) {
			console.error('Error loading exams:', err);
			setError('Không thể tải danh sách bài thi');
		} finally {
			setLoading(false);
		}
	};

	const handleStartExam = (examId: string) => {
		navigate(`/exam/${examId}/pre-check`);
	};

	const handleViewResult = (examId: string, submissionId: string) => {
		navigate(`/exam/${examId}/result`);
	};

	const handleContinueExam = (examId: string) => {
		navigate(`/exam/${examId}`);
	};

	const getStatusBadge = (status?: string) => {
		switch (status) {
			case 'completed':
				return (
					<span style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '4px',
						padding: '4px 12px',
						borderRadius: '12px',
						fontSize: '12px',
						fontWeight: 600,
						background: '#dcfce7',
						color: '#166534'
					}}>
						<CheckCircle size={14} />
						Đã hoàn thành
					</span>
				);
			case 'in-progress':
				return (
					<span style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '4px',
						padding: '4px 12px',
						borderRadius: '12px',
						fontSize: '12px',
						fontWeight: 600,
						background: '#fef3c7',
						color: '#92400e'
					}}>
						<AlertCircle size={14} />
						Đang làm
					</span>
				);
			default:
				return (
					<span style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: '4px',
						padding: '4px 12px',
						borderRadius: '12px',
						fontSize: '12px',
						fontWeight: 600,
						background: '#e5e7eb',
						color: '#374151'
					}}>
						<Calendar size={14} />
						Chưa làm
					</span>
				);
		}
	};

	if (loading) {
		return (
			<div style={{
				minHeight: '100vh',
				background: 'var(--background)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '24px'
			}}>
				<div style={{ textAlign: 'center' }}>
					<div style={{
						width: '48px',
						height: '48px',
						border: '3px solid var(--muted)',
						borderTop: '3px solid var(--primary)',
						borderRadius: '50%',
						animation: 'spin 1s linear infinite',
						margin: '0 auto 16px'
					}} />
					<p style={{ color: 'var(--muted-foreground)' }}>Đang tải danh sách bài thi...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div style={{
				minHeight: '100vh',
				background: 'var(--background)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '24px'
			}}>
				<div style={{
					background: 'var(--card)',
					padding: '40px',
					borderRadius: 'var(--radius-lg)',
					textAlign: 'center',
					border: '1px solid var(--border)',
					maxWidth: '400px'
				}}>
					<AlertCircle size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
					<h2 style={{ marginBottom: '8px', color: 'var(--foreground)' }}>Lỗi</h2>
					<p style={{ color: 'var(--muted-foreground)', marginBottom: '24px' }}>{error}</p>
					<Button onClick={loadExams} variant="primary">Thử lại</Button>
				</div>
			</div>
		);
	}

	return (
		<div style={{
			minHeight: '100vh',
			background: 'var(--background)',
			padding: '24px'
		}}>
			<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
				{/* Header */}
				<div style={{ marginBottom: '32px' }}>
					<h1 style={{
						fontSize: '32px',
						fontWeight: 700,
						marginBottom: '8px',
						color: 'var(--foreground)'
					}}>
						Danh sách bài thi
					</h1>
					<p style={{ color: 'var(--muted-foreground)', fontSize: '16px' }}>
						Chọn bài thi để bắt đầu làm bài hoặc xem lại kết quả
					</p>
				</div>

				{/* Exams Grid */}
				{exams.length === 0 ? (
					<div style={{
						background: 'var(--card)',
						padding: '60px 24px',
						borderRadius: 'var(--radius-lg)',
						textAlign: 'center',
						border: '1px solid var(--border)'
					}}>
						<FileText size={64} style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }} />
						<h3 style={{ marginBottom: '8px', color: 'var(--foreground)' }}>Chưa có bài thi</h3>
						<p style={{ color: 'var(--muted-foreground)' }}>
							Hiện tại chưa có bài thi nào được phân công cho bạn
						</p>
					</div>
				) : (
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
						gap: '24px'
					}}>
						{exams.map((exam) => (
							<div
								key={exam.id}
								style={{
									background: 'var(--card)',
									border: '1px solid var(--border)',
									borderRadius: 'var(--radius-lg)',
									padding: '24px',
									transition: 'all 0.2s',
									cursor: 'pointer'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
									e.currentTarget.style.transform = 'translateY(-4px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.boxShadow = 'none';
									e.currentTarget.style.transform = 'translateY(0)';
								}}
							>
								{/* Status Badge */}
								<div style={{ marginBottom: '16px' }}>
									{getStatusBadge(exam.status)}
								</div>

								{/* Exam Title */}
								<h3 style={{
									fontSize: '20px',
									fontWeight: 600,
									marginBottom: '8px',
									color: 'var(--foreground)'
								}}>
									{exam.title}
								</h3>

								{/* Description */}
								<p style={{
									color: 'var(--muted-foreground)',
									fontSize: '14px',
									marginBottom: '16px',
									lineHeight: 1.5,
									minHeight: '42px'
								}}>
									{exam.description || 'Không có mô tả'}
								</p>

								{/* Exam Info */}
								<div style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '8px',
									marginBottom: '20px',
									padding: '12px',
									background: 'var(--muted)',
									borderRadius: 'var(--radius-md)'
								}}>
									<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
										<Clock size={16} style={{ color: 'var(--muted-foreground)' }} />
										<span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
											Thời gian: {exam.duration} phút
										</span>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
										<FileText size={16} style={{ color: 'var(--muted-foreground)' }} />
										<span style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
											Số câu hỏi: {exam.totalQuestions}
										</span>
									</div>
									{exam.status === 'completed' && exam.score !== undefined && (
										<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
											<CheckCircle size={16} style={{ color: '#10b981' }} />
											<span style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>
												Điểm: {exam.score}/100
											</span>
										</div>
									)}
								</div>

								{/* Actions */}
								<div style={{ display: 'flex', gap: '12px' }}>
									{exam.status === 'not-started' && (
										<Button
											onClick={() => handleStartExam(exam.id)}
											variant="primary"
											style={{ flex: 1 }}
										>
											Bắt đầu làm bài
										</Button>
									)}
									{exam.status === 'in-progress' && (
										<Button
											onClick={() => handleContinueExam(exam.id)}
											variant="primary"
											style={{ flex: 1 }}
										>
											Tiếp tục làm bài
										</Button>
									)}
									{exam.status === 'completed' && exam.submissionId && (
										<Button
											onClick={() => handleViewResult(exam.id, exam.submissionId!)}
											variant="secondary"
											style={{ flex: 1 }}
										>
											Xem kết quả
										</Button>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}


