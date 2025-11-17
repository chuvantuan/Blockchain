import { useState, useEffect } from 'react'
import axios from 'axios'

// Use API Gateway for all requests
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/exam`

interface Submission {
	id: string
	quizId: string
	studentId: number
	score: number | null
	submittedAt: string | null
	startedAt: string | null
	timeSpentSeconds: number | null
	correctAnswers: number | null
	wrongAnswers: number | null
	totalQuestions: number | null
}

interface Quiz {
	id: string
	title: string
	timeLimit: number
}

interface RecentExam {
	id: string
	quizId: string
	title: string
	score?: number
	maxScore: number
	status: 'completed' | 'in-progress' | 'failed'
	date: string
	duration: string
	certificate?: boolean
	submittedAt?: string
	startedAt?: string
}

export function useRecentSubmissions() {
	const [exams, setExams] = useState<RecentExam[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [hasFetched, setHasFetched] = useState(false)

	// ✅ FIX: Add guard to prevent duplicate fetch in React StrictMode
	useEffect(() => {
		if (!hasFetched) {
			fetchRecentSubmissions()
			setHasFetched(true)
		}
	}, [hasFetched])

	const fetchRecentSubmissions = async () => {
		try {
			setLoading(true)
			const token = localStorage.getItem('accessToken')
			if (!token) {
				setError('Not authenticated')
				setLoading(false)
				return
			}

			// Fetch submissions via API Gateway
			const subsResponse = await axios.get(`${API_BASE_URL}/my-submissions`, {
				headers: { Authorization: `Bearer ${token}` }
			})

			if (!subsResponse.data.success) {
				throw new Error('Failed to fetch submissions')
			}

			const submissions: Submission[] = subsResponse.data.data || []

			// Filter to only get recent completed or in-progress submissions
			const recentSubmissions = submissions
				.filter(sub => sub.submittedAt || sub.startedAt) // Must have started at least
				.sort((a, b) => {
					// Sort by submittedAt or startedAt (most recent first)
					const dateA = new Date(a.submittedAt || a.startedAt || 0).getTime()
					const dateB = new Date(b.submittedAt || b.startedAt || 0).getTime()
					return dateB - dateA
				})
				.slice(0, 10) // Get top 10 most recent

			// Fetch quiz details for each submission
			const quizIds = [...new Set(recentSubmissions.map(sub => sub.quizId))]
			const quizDetailsPromises = quizIds.map(async (quizId) => {
				try {
					const quizResponse = await axios.get(`${API_BASE_URL}/quizzes/${quizId}`, {
						headers: { Authorization: `Bearer ${token}` }
					})
					return quizResponse.data.success ? quizResponse.data.data : null
				} catch {
					return null
				}
			})

			const quizDetails = await Promise.all(quizDetailsPromises)
			const quizMap = new Map<string, Quiz>()
			quizDetails.forEach((quiz: Quiz | null) => {
				if (quiz) {
					quizMap.set(quiz.id, quiz)
				}
			})

			// Transform to RecentExam format
			const recentExams: RecentExam[] = recentSubmissions.map(sub => {
				const quiz = quizMap.get(sub.quizId)
				const hasValidSubmittedAt = sub.submittedAt && 
					sub.submittedAt !== null && 
					sub.submittedAt !== '' &&
					sub.submittedAt !== 'null'

			let status: 'completed' | 'in-progress' | 'failed' = 'in-progress'
			if (hasValidSubmittedAt) {
				// Check if passed or failed
				// Score is already a percentage (0-100), no need to calculate
				const percentage = sub.score || 0
				status = percentage >= 60 ? 'completed' : 'failed'
			}

				// Calculate duration
				let duration = 'N/A'
				if (sub.timeSpentSeconds) {
					const minutes = Math.floor(sub.timeSpentSeconds / 60)
					duration = `${minutes} phút`
				} else if (quiz?.timeLimit) {
					duration = `${quiz.timeLimit} phút`
				}

				// Format date
				const dateToUse = hasValidSubmittedAt ? sub.submittedAt : sub.startedAt
				const relativeDate = dateToUse ? formatRelativeTime(dateToUse) : 'N/A'

			// Certificate eligibility (>= 80%)
			// Score is already a percentage (0-100)
			const certificate = sub.score ? sub.score >= 80 : false

			return {
				id: sub.id,
				quizId: sub.quizId,
				title: quiz?.title || 'Bài thi không xác định',
				score: sub.score || undefined,
				maxScore: 100, // Score is always out of 100 (percentage)
				status,
				date: relativeDate,
				duration,
				certificate,
				submittedAt: sub.submittedAt || undefined,
				startedAt: sub.startedAt || undefined
			}
			})

			setExams(recentExams)
			setError(null)
		} catch (err: any) {
			console.error('Error fetching recent submissions:', err)
			setError(err.message || 'Failed to fetch recent submissions')
		} finally {
			setLoading(false)
		}
	}

	return {
		exams,
		loading,
		error,
		refetch: () => {
			setHasFetched(false)
			fetchRecentSubmissions()
		}
	}
}

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
	const now = new Date()
	const date = new Date(dateString)
	const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
	
	if (diffInMinutes < 1) return 'Vừa xong'
	if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
	if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
	return `${Math.floor(diffInMinutes / 1440)} ngày trước`
}

