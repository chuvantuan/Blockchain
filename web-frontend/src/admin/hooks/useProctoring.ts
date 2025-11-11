import { useState, useMemo, useCallback, useEffect } from 'react'
import { ProctoringSession, ProctoringFilters, SessionStats } from '../types/proctoring'
import { proctoringApi } from '../services/proctoringApi'
// Import adapter để convert giữa backend và frontend
import { 
	backendSessionToProctoringSession,
	mapBackendSessionsToProctoringSessions 
} from '../../utils/proctoringAdapter'

export default function useProctoring() {
	const [sessions, setSessions] = useState<ProctoringSession[]>([])
	const [loading, setLoading] = useState(true)
	const [filters, setFilters] = useState<ProctoringFilters>({
		search: '',
		status: 'all',
		riskLevel: 'all',
		examId: 'all'
	})
	const [selectedSession, setSelectedSession] = useState<ProctoringSession | null>(null)
	const [autoRefresh, setAutoRefresh] = useState(true)

	// Filter sessions
	const filteredSessions = useMemo(() => {
		let result = [...sessions]

		// Search
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			result = result.filter(s =>
				s.userName.toLowerCase().includes(searchLower) ||
				s.examTitle.toLowerCase().includes(searchLower) ||
				s.userId.toLowerCase().includes(searchLower)
			)
		}

		// Status filter
		if (filters.status !== 'all') {
			result = result.filter(s => s.status === filters.status)
		}

		// Risk level filter
		if (filters.riskLevel !== 'all') {
			result = result.filter(s => s.riskLevel === filters.riskLevel)
		}

		// Exam filter
		if (filters.examId !== 'all') {
			result = result.filter(s => s.examId === filters.examId)
		}

		return result
	}, [sessions, filters])

	// Calculate stats
	const stats: SessionStats = useMemo(() => {
		const activeSessions = sessions.filter(s => s.status === 'active')
		const highRiskSessions = activeSessions.filter(s => 
			s.riskLevel === 'high' || s.riskLevel === 'critical'
		)
		const totalViolations = activeSessions.reduce((sum, s) => sum + s.totalViolations, 0)
		
		const riskScores = activeSessions.map(s => {
			switch (s.riskLevel) {
				case 'low': return 1
				case 'medium': return 2
				case 'high': return 3
				case 'critical': return 4
				default: return 0
			}
		})
		const avgRiskLevel = riskScores.length > 0 
			? riskScores.reduce((sum: number, score) => sum + score, 0) / riskScores.length
			: 0

		return {
			totalActive: activeSessions.length,
			totalViolations,
			highRiskSessions: highRiskSessions.length,
			avgRiskLevel
		}
	}, [sessions])

	// Get unique exams
	const exams = useMemo(() => {
		const uniqueExams = Array.from(
			new Set(sessions.map(s => JSON.stringify({ id: s.examId, title: s.examTitle })))
		).map(str => JSON.parse(str))
		return uniqueExams
	}, [sessions])

	// ✅ FIX: Make transformSession a plain function to avoid re-triggering useEffect
	const transformSession = (s: any): ProctoringSession => {
		const events = s.events || []
		// Use adapter to convert backend session to frontend format
		return backendSessionToProctoringSession(s, events)
	}

	// Fetch sessions from API
	useEffect(() => {
		const fetchSessions = async () => {
			setLoading(true)
			try {
				const data = await proctoringApi.getAllSessions()
				
				// Backend already includes events in response, but fetch separately for reliability
				const sessionsWithEvents = await Promise.all(
					data.map(async (session: any) => {
						// Use events from include if available, otherwise fetch separately
						let events = session.events || []
						
						// If no events in response, fetch separately
						if (!events || events.length === 0) {
							try {
								events = await proctoringApi.getEventsBySession(session.id)
							} catch (error) {
								console.error(`Error fetching events for session ${session.id}:`, error)
								events = []
							}
						}
						
						return { ...session, events }
					})
				)
				
				const transformedSessions = sessionsWithEvents.map(transformSession)
				setSessions(transformedSessions)
			} catch (error) {
				console.error('Error fetching sessions:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchSessions()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Update filter
	const updateFilter = useCallback((key: keyof ProctoringFilters, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}, [])

	// ✅ FIX: Auto refresh without transformSession in dependency to avoid re-creating interval
	useEffect(() => {
		if (!autoRefresh) return

		const interval = setInterval(async () => {
			try {
				const data = await proctoringApi.getAllSessions()
				
				// Use events from include if available, otherwise fetch separately
				const sessionsWithEvents = await Promise.all(
					data.map(async (session: any) => {
						let events = session.events || []
						
						if (!events || events.length === 0) {
							try {
								events = await proctoringApi.getEventsBySession(session.id)
							} catch (error) {
								console.error(`Error fetching events for session ${session.id}:`, error)
								events = []
							}
						}
						
						return { ...session, events }
					})
				)
				
				const transformedSessions = sessionsWithEvents.map(transformSession)
				setSessions(transformedSessions)
			} catch (error) {
				console.error('Error refreshing sessions:', error)
			}
		}, 5000) // Update every 5 seconds

		return () => clearInterval(interval)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [autoRefresh])

	// Terminate session
	const terminateSession = useCallback(async (sessionId: string) => {
		const success = await proctoringApi.terminateSession(sessionId)
		if (success) {
			setSessions(prev => prev.map(s =>
				s.id === sessionId
					? {
						...s,
						status: 'terminated' as const,
						endTime: new Date().toISOString()
					}
					: s
			))
			if (selectedSession?.id === sessionId) {
				setSelectedSession(null)
			}
		}
	}, [selectedSession])

	// Send warning
	const sendWarning = useCallback((sessionId: string) => {
		// In real app, this would trigger a notification to the student
		console.log(`Warning sent to session ${sessionId}`)
		// Could add a warning event to violations here
	}, [])

	// Resolve violation
	const resolveViolation = useCallback(async (sessionId: string, violationId: string) => {
		const success = await proctoringApi.reviewEvent(violationId, true)
		if (success) {
			setSessions(prev => prev.map(s =>
				s.id === sessionId
					? {
						...s,
						violations: s.violations.map(v =>
							v.id === violationId ? { ...v, resolved: true } : v
						)
					}
					: s
			))
		}
	}, [])

	// Update risk level based on violations
	useEffect(() => {
		setSessions(prev => prev.map(session => {
			if (session.status !== 'active') return session

			const unresolvedViolations = session.violations.filter(v => !v.resolved).length
			const criticalViolations = session.violations.filter(v => 
				v.severity === 'critical' && !v.resolved
			).length

			let riskLevel: typeof session.riskLevel = 'low'
			
			if (criticalViolations > 0 || unresolvedViolations >= 5) {
				riskLevel = 'critical'
			} else if (unresolvedViolations >= 3) {
				riskLevel = 'high'
			} else if (unresolvedViolations >= 1) {
				riskLevel = 'medium'
			}

			return { ...session, riskLevel }
		}))
	}, [sessions.map(s => s.violations.length).join(',')])

	return {
		sessions: filteredSessions,
		allSessions: sessions,
		filters,
		updateFilter,
		stats,
		exams,
		selectedSession,
		setSelectedSession,
		autoRefresh,
		setAutoRefresh,
		terminateSession,
		sendWarning,
		resolveViolation,
		loading
	}
}

