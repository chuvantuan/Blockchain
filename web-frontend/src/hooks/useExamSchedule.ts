import { useState, useEffect } from 'react'
import { getAllQuizzes, getMyAllSubmissions } from '../services/api/onlineExamApi'

interface Quiz {
	id: string
	title: string
	description?: string
	timeLimit?: number
	timeLimitMinutes?: number
	duration?: number
	questions?: any[]
	questionCount?: number
	scheduledDate?: string
	startTime?: string
	endTime?: string
	status?: 'upcoming' | 'ongoing' | 'completed'
	participantCount?: number
	hasSubmission?: boolean
	submittedAt?: string
}

interface FilterOptions {
	timeRange: 'all' | 'today' | 'week' | 'month'
	status: 'all' | 'upcoming' | 'ongoing' | 'completed'
	searchQuery: string
}

export function useExamSchedule(filters: FilterOptions) {
	const [schedules, setSchedules] = useState<Quiz[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [hasFetched, setHasFetched] = useState(false)
	
	// ✅ FIX: Add guard for initial fetch + re-fetch only when filters actually change
	useEffect(() => {
		if (!hasFetched || filters.timeRange !== 'all' || filters.status !== 'all' || filters.searchQuery !== '') {
			fetchSchedules()
			setHasFetched(true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters.timeRange, filters.status, filters.searchQuery])
	
	const fetchSchedules = async () => {
		try {
			setLoading(true)
			setError(null)
			
			// Fetch all quizzes using onlineExamApi
			let quizzes = await getAllQuizzes()
			
			// Fetch user's submissions to determine actual status
			let submissions: any[] = []
			try {
				submissions = await getMyAllSubmissions()
			} catch (err) {
				console.error('Error fetching submissions:', err)
			}
			
			// Determine status based on user submissions
			quizzes = quizzes.map((quiz: Quiz, index: number) => {
				const now = new Date()
				
				// Check if user has submission for this quiz
				const submission = submissions.find((s: any) => s.quizId === quiz.id)
				
				// Determine status based on submission
				let status: 'upcoming' | 'ongoing' | 'completed' = 'ongoing'
				
				// CRITICAL: Check if quiz is actually completed
				// submittedAt can be: null, undefined, "", or a valid date string
				// We ONLY consider it completed if submittedAt has a REAL value
				const hasValidSubmittedAt = submission?.submittedAt && 
					submission.submittedAt !== null && 
					submission.submittedAt !== '' &&
					submission.submittedAt !== 'null' // In case backend sends string "null"
				
			if (hasValidSubmittedAt) {
				// User has completed this quiz - HIGHEST PRIORITY
				status = 'completed'
			} else if (submission) {
				// User started but hasn't submitted yet - still ongoing
				status = 'ongoing'
			} else {
				// Not started yet - show as ongoing (available to take)
				status = 'ongoing'
			}
				
				// Use today's date as default scheduled date (can be enhanced later with real scheduling)
				const scheduledDate = quiz.scheduledDate || new Date().toISOString()
				
				return {
					...quiz,
					scheduledDate,
					startTime: scheduledDate,
					status,
					questionCount: quiz.questions?.length || 0,
					duration: quiz.timeLimit || quiz.timeLimitMinutes || 60,
					participantCount: quiz.participantCount || 0, // Use real count from backend
					hasSubmission: !!submission,
					submittedAt: submission?.submittedAt
				}
			})
			
			// Apply filters
			let filtered = quizzes
			
			// Filter by status
			if (filters.status !== 'all') {
				filtered = filtered.filter((q: Quiz) => q.status === filters.status)
			}
			
			// Filter by time range
			if (filters.timeRange !== 'all') {
				const now = new Date()
				filtered = filtered.filter((q: Quiz) => {
					const examDate = new Date(q.scheduledDate || q.startTime || '')
					
					switch (filters.timeRange) {
						case 'today':
							return examDate.toDateString() === now.toDateString()
						case 'week':
							const weekFromNow = new Date(now)
							weekFromNow.setDate(weekFromNow.getDate() + 7)
							return examDate >= now && examDate <= weekFromNow
						case 'month':
							const monthFromNow = new Date(now)
							monthFromNow.setMonth(monthFromNow.getMonth() + 1)
							return examDate >= now && examDate <= monthFromNow
						default:
							return true
					}
				})
			}
			
			// Filter by search query
			if (filters.searchQuery) {
				const query = filters.searchQuery.toLowerCase()
				filtered = filtered.filter((q: Quiz) => 
					q.title?.toLowerCase().includes(query) ||
					q.description?.toLowerCase().includes(query)
				)
			}
			
			// Sort by scheduled date
			filtered.sort((a: Quiz, b: Quiz) => {
				const dateA = new Date(a.scheduledDate || a.startTime || '')
				const dateB = new Date(b.scheduledDate || b.startTime || '')
				return dateA.getTime() - dateB.getTime()
			})
			
			setSchedules(filtered)
		} catch (err: any) {
			console.error('Error fetching exam schedules:', err)
			setError(err.message || 'Không thể tải lịch thi')
		} finally {
			setLoading(false)
		}
	}
	
	return { schedules, loading, error, refetch: fetchSchedules }
}

