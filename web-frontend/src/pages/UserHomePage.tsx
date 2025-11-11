import { useState } from 'react'
import { useAppSelector } from '../store/hooks'
import { useQuizzes } from '../hooks/useQuizzes'
import WelcomeBanner from '../components/sections/WelcomeBanner'
import MockInterviews from '../components/sections/MockInterviews'
import PracticeSkills from '../components/sections/PracticeSkills'
import TokenWallet from '../components/atoms/TokenWallet'
import RecentExams from '../components/sections/RecentExams'
import CourseProgress from '../components/sections/CourseProgress'
import UpcomingExams from '../components/sections/UpcomingExams'
import Footer from '../components/layouts/Footer'
import RewardStoreModal from '../components/molecules/RewardStoreModal'
import styles from '../assets/css/UserHomePage.module.css'

export default function UserHomePage(): JSX.Element {
	const { user } = useAppSelector((state) => state.auth)
	const { quizzes, loading: quizzesLoading } = useQuizzes()
	const [showRewardStore, setShowRewardStore] = useState(false)
	const handleStartInterview = (interviewId: string) => {
		console.log(`Start interview ${interviewId}`)
	}

	const handleUnlockInterview = (interviewId: string) => {
		console.log(`Unlock interview ${interviewId}`)
	}

	const handleSkillClick = (skillId: string) => {
		console.log(`Practice skill ${skillId}`)
	}

	const handleViewExam = (examId: string) => {
		console.log(`View exam ${examId}`)
	}

	const handleRetakeExam = (examId: string) => {
		console.log(`Retake exam ${examId}`)
	}

	const handleContinueCourse = (courseId: string) => {
		console.log(`Continue course ${courseId}`)
	}

	const handleViewCourse = (courseId: string) => {
		console.log(`View course ${courseId}`)
	}

	return (
		<div className={styles.userHomePage}>
			{/* Background Pattern */}
			<div className={styles.userHomePattern} />
			
			<main style={{
				paddingTop: 'var(--space-24)',
				maxWidth: '1400px',
				margin: '0 auto',
				padding: 'var(--space-24) var(--space-6) 0',
				position: 'relative',
				zIndex: 2
			}}>
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 'var(--space-8)'
				}}>
					{/* Welcome Banner */}
					<WelcomeBanner 
						userName={user?.name || 'User'} 
						level={5} 
						xp={2500}
						totalExams={12}
						certificates={3}
						streak={7}
					/>

					{/* Main Content - Flexbox Layout */}
					<div style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '16px',
						marginBottom: '32px'
					}}>
						{/* Row 1 - Mock Interviews và Token Wallet */}
						<div style={{
							display: 'flex',
							gap: '16px'
						}}>
							<div style={{
								flex: '2',
								minHeight: '280px'
							}}>
								{/* Mock Interviews */}
								<MockInterviews 
									onStartInterview={handleStartInterview}
									onUnlockInterview={handleUnlockInterview}
								/>
							</div>

							<div style={{
								flex: '1',
								minHeight: '280px'
							}}>
								{/* Token Wallet */}
								<TokenWallet
									userId={user?.id}
								/>
							</div>
						</div>

						{/* Row 2 - Practice Skills Full Width */}
						<div style={{
							minHeight: '280px'
						}}>
							{/* Practice Skills */}
							<PracticeSkills 
								onSkillClick={handleSkillClick}
							/>
						</div>

						{/* Row 3 - Recent Exams, Course Progress, Upcoming Exams */}
						<div style={{
							display: 'flex',
							gap: '16px'
						}}>
							<div style={{
								flex: '1',
								minHeight: '280px'
							}}>
								{/* Recent Exams */}
								<RecentExams 
									onViewExam={handleViewExam}
									onRetakeExam={handleRetakeExam}
								/>
							</div>

							<div style={{
								flex: '1',
								minHeight: '280px'
							}}>
								{/* Course Progress */}
								<CourseProgress 
									onContinueCourse={handleContinueCourse}
									onViewCourse={handleViewCourse}
								/>
							</div>

							<div style={{
								flex: '1',
								minHeight: '280px'
							}}>
								{/* Upcoming Exams */}
							<UpcomingExams exams={quizzes} />
							</div>
						</div>

					</div>
				</div>
		</main>

		{/* Footer */}
		<Footer />

		{/* Modals - Rendered at page level for full screen display */}
		<RewardStoreModal
			isOpen={showRewardStore}
			onClose={() => setShowRewardStore(false)}
			userId={user?.id || 'user-123'}
		/>
	</div>
)
}