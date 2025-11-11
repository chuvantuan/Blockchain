import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Award, ArrowRight, Calendar, FileText, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRecentSubmissions } from '../hooks/useRecentSubmissions';
import Button from '../components/atoms/Button';

export default function RecentExamsPage(): JSX.Element {
	const navigate = useNavigate();
	const { exams, loading, error, refetch } = useRecentSubmissions();
	
	// Filter and pagination state
	const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'failed' | 'in-progress'>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	// Calculate statistics
	const stats = {
		total: exams.length,
		completed: exams.filter(e => e.status === 'completed').length,
		failed: exams.filter(e => e.status === 'failed').length,
		inProgress: exams.filter(e => e.status === 'in-progress').length,
		avgScore: exams.length > 0 
			? Math.round(exams.reduce((acc, e) => acc + (e.score || 0), 0) / exams.filter(e => e.score).length)
			: 0
	};

	// Filter exams based on status
	const filteredExams = useMemo(() => {
		if (filterStatus === 'all') return exams;
		return exams.filter(exam => exam.status === filterStatus);
	}, [exams, filterStatus]);

	// Pagination
	const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
	const paginatedExams = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredExams.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredExams, currentPage]);

	// Reset to page 1 when filter changes
	const handleFilterChange = (status: typeof filterStatus) => {
		setFilterStatus(status);
		setCurrentPage(1);
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'completed':
				return <CheckCircle size={20} style={{ color: '#10b981' }} />;
			case 'failed':
				return <XCircle size={20} style={{ color: '#ef4444' }} />;
			case 'in-progress':
				return <AlertCircle size={20} style={{ color: '#f59e0b' }} />;
			default:
				return <Clock size={20} style={{ color: '#6b7280' }} />;
		}
	};

	const getStatusBadge = (status: string) => {
		const styles = {
			completed: { bg: '#dcfce7', color: '#166534', text: 'Hoàn thành' },
			failed: { bg: '#fee2e2', color: '#991b1b', text: 'Chưa đạt' },
			'in-progress': { bg: '#fef3c7', color: '#92400e', text: 'Đang làm' }
		};

		const style = styles[status as keyof typeof styles] || { bg: '#e5e7eb', color: '#374151', text: 'Chưa xác định' };

		return (
			<span style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: '6px',
				padding: '4px 12px',
				borderRadius: '12px',
				fontSize: '13px',
				fontWeight: 600,
				background: style.bg,
				color: style.color
			}}>
				{getStatusIcon(status)}
				{style.text}
			</span>
		);
	};

	const handleViewResult = (examId: string, submissionId: string) => {
		navigate(`/exam/${examId}/result`);
	};

	const handleContinueExam = (examId: string) => {
		navigate(`/exam/${examId}`);
	};

	const handleViewAllExams = () => {
		navigate('/user/exam');
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
					<p style={{ color: 'var(--muted-foreground)' }}>Đang tải bài thi gần đây...</p>
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
					<Button onClick={refetch} variant="primary">Thử lại</Button>
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
			<div style={{ maxWidth: '1400px', margin: '0 auto' }}>
				{/* Header */}
				<div style={{ marginBottom: '32px' }}>
					<h1 style={{
						fontSize: '36px',
						fontWeight: 700,
						marginBottom: '8px',
						color: 'var(--foreground)',
						display: 'flex',
						alignItems: 'center',
						gap: '12px'
					}}>
						<TrendingUp size={36} style={{ color: 'var(--primary)' }} />
						Bài thi gần đây
					</h1>
					<p style={{ color: 'var(--muted-foreground)', fontSize: '16px' }}>
						Xem lại các bài thi bạn đã làm và theo dõi tiến độ học tập
					</p>
				</div>

				{/* Statistics Cards */}
				<div style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
					gap: '16px',
					marginBottom: '32px'
				}}>
					<div style={{
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						padding: '24px',
						borderRadius: 'var(--radius-lg)',
						color: 'white'
					}}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
							<FileText size={24} />
							<span style={{ fontSize: '14px', opacity: 0.9 }}>Tổng số bài</span>
						</div>
						<div style={{ fontSize: '32px', fontWeight: 700 }}>{stats.total}</div>
					</div>

					<div style={{
						background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
						padding: '24px',
						borderRadius: 'var(--radius-lg)',
						color: 'white'
					}}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
							<CheckCircle size={24} />
							<span style={{ fontSize: '14px', opacity: 0.9 }}>Hoàn thành</span>
						</div>
						<div style={{ fontSize: '32px', fontWeight: 700 }}>{stats.completed}</div>
					</div>

					<div style={{
						background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
						padding: '24px',
						borderRadius: 'var(--radius-lg)',
						color: 'white'
					}}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
							<XCircle size={24} />
							<span style={{ fontSize: '14px', opacity: 0.9 }}>Chưa đạt</span>
						</div>
						<div style={{ fontSize: '32px', fontWeight: 700 }}>{stats.failed}</div>
					</div>

					<div style={{
						background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
						padding: '24px',
						borderRadius: 'var(--radius-lg)',
						color: 'white'
					}}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
							<Award size={24} />
							<span style={{ fontSize: '14px', opacity: 0.9 }}>Điểm TB</span>
						</div>
						<div style={{ fontSize: '32px', fontWeight: 700 }}>{stats.avgScore}</div>
					</div>
				</div>

				{/* Filter Bar */}
				{exams.length > 0 && (
					<div style={{
						display: 'flex',
						gap: '12px',
						alignItems: 'center',
						marginBottom: '24px',
						flexWrap: 'wrap'
					}}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted-foreground)' }}>
							<Filter size={20} />
							<span style={{ fontWeight: 500 }}>Lọc:</span>
						</div>
						
						{[
							{ value: 'all', label: 'Tất cả', count: stats.total },
							{ value: 'completed', label: 'Hoàn thành', count: stats.completed },
							{ value: 'failed', label: 'Chưa đạt', count: stats.failed },
							{ value: 'in-progress', label: 'Đang làm', count: stats.inProgress }
						].map(filter => (
							<button
								key={filter.value}
								onClick={() => handleFilterChange(filter.value as typeof filterStatus)}
								style={{
									padding: '8px 16px',
									borderRadius: 'var(--radius-md)',
									border: filterStatus === filter.value ? '2px solid var(--primary)' : '1px solid var(--border)',
									background: filterStatus === filter.value ? 'var(--primary-light)' : 'var(--card)',
									color: filterStatus === filter.value ? 'var(--primary)' : 'var(--foreground)',
									fontWeight: filterStatus === filter.value ? 600 : 400,
									cursor: 'pointer',
									transition: 'all 0.2s',
									display: 'flex',
									alignItems: 'center',
									gap: '6px'
								}}
								onMouseEnter={(e) => {
									if (filterStatus !== filter.value) {
										e.currentTarget.style.borderColor = 'var(--primary)';
										e.currentTarget.style.background = 'var(--muted)';
									}
								}}
								onMouseLeave={(e) => {
									if (filterStatus !== filter.value) {
										e.currentTarget.style.borderColor = 'var(--border)';
										e.currentTarget.style.background = 'var(--card)';
									}
								}}
							>
								<span>{filter.label}</span>
								<span style={{
									padding: '2px 8px',
									borderRadius: '10px',
									fontSize: '12px',
									fontWeight: 600,
									background: filterStatus === filter.value ? 'var(--primary)' : 'var(--muted)',
									color: filterStatus === filter.value ? 'white' : 'var(--muted-foreground)'
								}}>
									{filter.count}
								</span>
							</button>
						))}
					</div>
				)}

				{/* Exams List */}
				{filteredExams.length === 0 ? (
					<div style={{
						background: 'var(--card)',
						padding: '60px 24px',
						borderRadius: 'var(--radius-lg)',
						textAlign: 'center',
						border: '1px solid var(--border)'
					}}>
						<FileText size={64} style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }} />
						<h3 style={{ marginBottom: '8px', color: 'var(--foreground)' }}>
							{exams.length === 0 ? 'Chưa có bài thi nào' : 'Không tìm thấy bài thi'}
						</h3>
						<p style={{ color: 'var(--muted-foreground)', marginBottom: '24px' }}>
							{exams.length === 0 
								? 'Bạn chưa làm bài thi nào. Hãy bắt đầu làm bài thi đầu tiên!'
								: `Không có bài thi nào với trạng thái "${filterStatus === 'completed' ? 'Hoàn thành' : filterStatus === 'failed' ? 'Chưa đạt' : 'Đang làm'}"`
							}
						</p>
						{exams.length === 0 && (
							<Button onClick={handleViewAllExams} variant="primary">
								Xem danh sách bài thi
							</Button>
						)}
					</div>
				) : (
					<>
						<div style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '16px'
						}}>
							<h2 style={{
								fontSize: '20px',
								fontWeight: 600,
								color: 'var(--foreground)'
							}}>
								Lịch sử làm bài ({filteredExams.length})
							</h2>
							<Button 
								onClick={handleViewAllExams} 
								variant="outline"
								style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
							>
								Xem tất cả bài thi <ArrowRight size={16} />
							</Button>
						</div>

						<div style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '16px'
						}}>
							{paginatedExams.map((exam) => (
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
										e.currentTarget.style.borderColor = 'var(--primary)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.boxShadow = 'none';
										e.currentTarget.style.borderColor = 'var(--border)';
									}}
								>
									<div style={{
										display: 'grid',
										gridTemplateColumns: '1fr auto',
										gap: '24px',
										alignItems: 'start'
									}}>
										{/* Left: Exam Info */}
										<div>
											<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
												{getStatusBadge(exam.status)}
												{exam.certificate && (
													<span style={{
														display: 'inline-flex',
														alignItems: 'center',
														gap: '4px',
														padding: '4px 12px',
														borderRadius: '12px',
														fontSize: '13px',
														fontWeight: 600,
														background: '#fef3c7',
														color: '#92400e'
													}}>
														<Award size={14} />
														Đủ điều kiện nhận chứng chỉ
													</span>
												)}
											</div>

											<h3 style={{
												fontSize: '20px',
												fontWeight: 600,
												marginBottom: '12px',
												color: 'var(--foreground)'
											}}>
												{exam.title}
											</h3>

											<div style={{
												display: 'flex',
												flexWrap: 'wrap',
												gap: '16px',
												color: 'var(--muted-foreground)',
												fontSize: '14px'
											}}>
												<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
													<Calendar size={16} />
													<span>{exam.date}</span>
												</div>
												<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
													<Clock size={16} />
													<span>{exam.duration}</span>
												</div>
												{exam.score !== undefined && (
													<div style={{
														display: 'flex',
														alignItems: 'center',
														gap: '6px',
														fontWeight: 600,
														color: exam.status === 'completed' ? '#10b981' : '#ef4444'
													}}>
														<Award size={16} />
														<span>{exam.score}/{exam.maxScore} điểm</span>
													</div>
												)}
											</div>
										</div>

										{/* Right: Actions */}
										<div style={{
											display: 'flex',
											flexDirection: 'column',
											gap: '8px',
											minWidth: '160px'
										}}>
											{exam.status === 'in-progress' && (
												<Button
													onClick={() => handleContinueExam(exam.quizId)}
													variant="primary"
													style={{ width: '100%' }}
												>
													Tiếp tục làm bài
												</Button>
											)}
											{(exam.status === 'completed' || exam.status === 'failed') && (
												<Button
													onClick={() => handleViewResult(exam.quizId, exam.id)}
													variant="secondary"
													style={{ width: '100%' }}
												>
													Xem kết quả
												</Button>
											)}
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								gap: '12px',
								marginTop: '32px'
							}}>
								<button
									onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
									disabled={currentPage === 1}
									style={{
										padding: '8px 12px',
										borderRadius: 'var(--radius-md)',
										border: '1px solid var(--border)',
										background: currentPage === 1 ? 'var(--muted)' : 'var(--card)',
										color: currentPage === 1 ? 'var(--muted-foreground)' : 'var(--foreground)',
										cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
										display: 'flex',
										alignItems: 'center',
										gap: '4px',
										transition: 'all 0.2s'
									}}
									onMouseEnter={(e) => {
										if (currentPage !== 1) {
											e.currentTarget.style.background = 'var(--muted)';
										}
									}}
									onMouseLeave={(e) => {
										if (currentPage !== 1) {
											e.currentTarget.style.background = 'var(--card)';
										}
									}}
								>
									<ChevronLeft size={16} />
									Trước
								</button>

								<div style={{ display: 'flex', gap: '8px' }}>
									{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
										<button
											key={page}
											onClick={() => setCurrentPage(page)}
											style={{
												padding: '8px 12px',
												borderRadius: 'var(--radius-md)',
												border: currentPage === page ? '2px solid var(--primary)' : '1px solid var(--border)',
												background: currentPage === page ? 'var(--primary)' : 'var(--card)',
												color: currentPage === page ? 'white' : 'var(--foreground)',
												fontWeight: currentPage === page ? 600 : 400,
												cursor: 'pointer',
												minWidth: '40px',
												transition: 'all 0.2s'
											}}
											onMouseEnter={(e) => {
												if (currentPage !== page) {
													e.currentTarget.style.background = 'var(--muted)';
												}
											}}
											onMouseLeave={(e) => {
												if (currentPage !== page) {
													e.currentTarget.style.background = 'var(--card)';
												}
											}}
										>
											{page}
										</button>
									))}
								</div>

								<button
									onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
									disabled={currentPage === totalPages}
									style={{
										padding: '8px 12px',
										borderRadius: 'var(--radius-md)',
										border: '1px solid var(--border)',
										background: currentPage === totalPages ? 'var(--muted)' : 'var(--card)',
										color: currentPage === totalPages ? 'var(--muted-foreground)' : 'var(--foreground)',
										cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
										display: 'flex',
										alignItems: 'center',
										gap: '4px',
										transition: 'all 0.2s'
									}}
									onMouseEnter={(e) => {
										if (currentPage !== totalPages) {
											e.currentTarget.style.background = 'var(--muted)';
										}
									}}
									onMouseLeave={(e) => {
										if (currentPage !== totalPages) {
											e.currentTarget.style.background = 'var(--card)';
										}
									}}
								>
									Sau
									<ChevronRight size={16} />
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}

