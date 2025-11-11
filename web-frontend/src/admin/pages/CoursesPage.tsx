import React, { useState, useRef } from 'react'
import { BookOpen, Plus, Grid3X3, List, RefreshCw, Download, Upload, FileText, CheckCircle2, Archive, PauseCircle } from 'lucide-react'
import useCourses from '../hooks/useCourses'
import CourseGrid from '../components/courses/CourseGrid'
import CourseListTable from '../components/courses/CourseListTable'
import CourseFilterBar from '../components/courses/CourseFilterBar'
import CourseEditorModal from '../components/courses/CourseEditorModal'
import CourseDetailModal from '../modal/Courses/CourseDetailModal'
import { exportCoursesToExcel, importCoursesFromExcel, generateExcelTemplate } from '../utils/courseExcelHelpers'
import '../styles/common.css'
import '../styles/courses.css'

export default function CoursesPage(): JSX.Element {
	const {
		dashboard,
		courses,
		filters,
		updateFilter,
		clearFilters,
		addCourse,
		updateCourse,
		deleteCourse,
		toggleCourseStatus,
		isCourseEditorOpen,
		editingCourse,
		openCourseEditor,
		closeCourseEditor,
		saveCourse,
		selectedCourse,
		setSelectedCourse,
		loading,
		setLoading
	} = useCourses()

	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleAddCourse = () => openCourseEditor()
	const handleEditCourse = (course: any) => openCourseEditor(course)

	const handleDeleteCourse = (courseId: string) => {
		if (confirm('Bạn có chắc chắn muốn xóa khóa học này?')) {
			deleteCourse(courseId)
		}
	}

	const handleToggleCourseStatus = (courseId: string) => {
		toggleCourseStatus(courseId)
	}

	const handleCourseClick = (course: any) => {
		setSelectedCourse(course)
	}

	const handleExportCourses = () => {
		try {
			const filename = `courses-${new Date().toISOString().split('T')[0]}.xlsx`
			exportCoursesToExcel(courses, filename)
		} catch (error) {
			console.error('Export error:', error)
			alert('Có lỗi xảy ra khi xuất file Excel')
		}
	}

	const handleImportCourses = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		try {
			setLoading(true)
			const importedCourses = await importCoursesFromExcel(file)
			for (const courseForm of importedCourses) {
				await addCourse(courseForm)
			}
			alert(`Đã nhập thành công ${importedCourses.length} khóa học`)
		} catch (error) {
			console.error('Import error:', error)
			alert(`Lỗi nhập file: ${error instanceof Error ? error.message : 'Unknown error'}`)
		} finally {
			setLoading(false)
			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
	}

	const handleDownloadTemplate = () => {
		generateExcelTemplate()
	}

	return (
		<>
			<div className="courses-page">
				<header className="courses-header">
					<div className="courses-header-info">
						<h1 className="courses-title">Quản lý khóa học</h1>
						<p className="courses-subtitle">Quản lý danh sách khóa học dựa trên dữ liệu từ dịch vụ backend</p>
					</div>
					<div className="courses-header-actions">
						<button className="btn btn-secondary" onClick={handleDownloadTemplate} title="Tải template Excel">
							<FileText size={18} />
							Template
						</button>
						<button className="btn btn-secondary" onClick={handleImportCourses}>
							<Upload size={18} />
							Nhập Excel
						</button>
						<button className="btn btn-secondary" onClick={handleExportCourses}>
							<Download size={18} />
							Xuất Excel
						</button>
						<button className="btn btn-primary" onClick={handleAddCourse}>
							<Plus size={18} />
							Thêm khóa học
						</button>
					</div>
				</header>

				<div className="courses-stats-grid">
					<div className="stat-card">
						<div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
							<BookOpen size={20} />
						</div>
						<div className="stat-title">Tổng khóa học</div>
						<div className="stat-value">{dashboard.stats.totalCourses}</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}>
							<CheckCircle2 size={20} />
						</div>
						<div className="stat-title">Đã xuất bản</div>
						<div className="stat-value">{dashboard.stats.publishedCourses}</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
							<PauseCircle size={20} />
						</div>
						<div className="stat-title">Bản nháp</div>
						<div className="stat-value">{dashboard.stats.draftCourses}</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon" style={{ background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)' }}>
							<Archive size={20} />
						</div>
						<div className="stat-title">Đã lưu trữ</div>
						<div className="stat-value">{dashboard.stats.archivedCourses}</div>
					</div>
				</div>

				<div className="courses-toolbar">
					<div className="courses-toolbar-left">
						<div className="courses-view-toggle">
							<button
								className={`btn btn-icon btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
								onClick={() => setViewMode('grid')}
								title="Xem dạng lưới"
							>
								<Grid3X3 size={16} />
							</button>
							<button
								className={`btn btn-icon btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
								onClick={() => setViewMode('list')}
								title="Xem dạng danh sách"
							>
								<List size={16} />
							</button>
						</div>
						<div className="courses-total">{courses.length} khóa học</div>
					</div>
					<button className="btn btn-secondary btn-sm" onClick={() => window.location.reload()}>
						<RefreshCw size={16} />
						Làm mới
					</button>
				</div>

				<CourseFilterBar filters={filters} onFilterChange={updateFilter} onClearFilters={clearFilters} />

				<div className="courses-content">
					{viewMode === 'grid' ? (
						<CourseGrid
							courses={courses}
							onCourseClick={handleCourseClick}
							onEditCourse={handleEditCourse}
							onDeleteCourse={handleDeleteCourse}
							onToggleStatus={handleToggleCourseStatus}
							loading={loading}
							emptyMessage="Không có khóa học nào phù hợp với bộ lọc"
						/>
					) : (
						<CourseListTable
							courses={courses}
							onCourseClick={handleCourseClick}
							onEditCourse={handleEditCourse}
							onDeleteCourse={handleDeleteCourse}
							onToggleStatus={handleToggleCourseStatus}
							loading={loading}
							emptyMessage="Không có khóa học nào phù hợp với bộ lọc"
						/>
					)}
				</div>
			</div>

			<CourseEditorModal
				isOpen={isCourseEditorOpen}
				onClose={closeCourseEditor}
				onSave={saveCourse}
				editingCourse={editingCourse}
				title={editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
			/>

			<CourseDetailModal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} course={selectedCourse} />

			<input
				ref={fileInputRef}
				type="file"
				accept=".xlsx,.xls"
				onChange={handleFileChange}
				style={{ display: 'none' }}
			/>
		</>
	)
}