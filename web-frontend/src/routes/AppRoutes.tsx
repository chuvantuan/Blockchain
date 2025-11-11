import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import AdminRoutes from '../admin/routes/AdminRoutes'
import UserLayout from '../components/layouts/UserLayout'
import AuthLayout from '../components/layouts/AuthLayout'
import ProtectedRoute from '../components/ProtectedRoute'
import UserHomePage from '../pages/UserHomePage'
import PreparePage from '../pages/PreparePage'
import LandingPage from '../pages/LandingPage'
import ExamPage from '../pages/ExamPage'
import RecentExamsPage from '../pages/RecentExamsPage'
import { ExamPreCheckPage } from '../pages/ExamPreCheckPage'
import { ExamTakingPage } from '../pages/ExamTakingPage'
import { ExamResultPage } from '../pages/ExamResultPage'
import { ExamDetailPage } from '../pages/ExamDetailPage'
import ExamSchedulePage from '../pages/ExamSchedulePage'
import RewardPage from '../pages/RewardPage'
import CertifyPage from '../pages/CertifyPage'
import CertificationDetailPage from '../pages/CertificationDetailPage'
import CompetePage from '../pages/CompetePage'
import ContestDetailPage from '../pages/ContestDetailPage'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import LeaderboardPage from '../pages/LeaderboardPage'
import RewardStorePage from '../pages/RewardStorePage'
import CopyrightPage from '../pages/CopyrightPage'
import CheckDuplicatePage from '../pages/CheckDuplicatePage'
import UserCoursesPage from '../pages/UserCoursesPage'
import CourseDetailPage from '../pages/CourseDetailPage'
import CourseLearnPage from '../pages/CourseLearnPage'
import MultisigWalletPage from '../pages/MultisigWalletPage'
import { checkAuth } from '../store/slices/authSlice'

export default function AppRoutes(): JSX.Element {
	const dispatch = useAppDispatch()
	const { loggedIn } = useAppSelector((state) => state.auth)

	// Check authentication on app load
	useEffect(() => {
		dispatch(checkAuth())
	}, [dispatch])
	return (
		<BrowserRouter>
			<Routes>
			<Route path="/auth/*" element={<AuthLayout />} />
			<Route path="/login" element={<Navigate to="/auth" replace />} />
			
			{/* Admin Routes */}
			<Route path="/admin/*" element={
				<ProtectedRoute requiredRole="admin">
					<AdminRoutes />
				</ProtectedRoute>
			} />
				
				{/* Landing Page */}
				<Route path="/" element={<LandingPage />} />
				
				{/* User Routes */}
				<Route path="/user/*" element={
					<ProtectedRoute requiredRole="user">
						<UserLayout />
					</ProtectedRoute>
				}>
			<Route index element={<UserHomePage />} />
			<Route path="home" element={<UserHomePage />} />
			<Route path="prepare" element={<UserHomePage />} />
                <Route path="certify" element={<CertifyPage />} />
                <Route path="certify/:certificationId" element={<CertificationDetailPage />} />
                <Route path="compete" element={<CompetePage />} />
                <Route path="compete/:contestId" element={<ContestDetailPage />} />
			<Route path="exam" element={<ExamPage />} />
			<Route path="exams/recent" element={<RecentExamsPage />} />
			<Route path="exams/schedule" element={<ExamSchedulePage />} />
			<Route path="courses" element={<UserCoursesPage />} />
			<Route path="courses/:courseId" element={<CourseDetailPage />} />
			<Route path="reward" element={<RewardPage />} />
			<Route path="rewards" element={<RewardPage />} />
			<Route path="rewards/store" element={<RewardStorePage />} />
			<Route path="copyright" element={<CopyrightPage />} />
			<Route path="check-duplicate" element={<CheckDuplicatePage />} />
			<Route path="multisig" element={<MultisigWalletPage />} />
			<Route path="profile" element={<ProfilePage />} />
			<Route path="settings" element={<SettingsPage />} />
			<Route path="leaderboard" element={<LeaderboardPage />} />
			</Route>
				
			{/* Exam Routes - Standalone pages without layout */}
			<Route path="/exam/:examId/pre-check" element={
				<ProtectedRoute requiredRole="user">
					<ExamPreCheckPage />
				</ProtectedRoute>
			} />
			<Route path="/exam/:examId/take" element={
				<ProtectedRoute requiredRole="user">
					<ExamTakingPage />
				</ProtectedRoute>
			} />
			<Route path="/exam/:examId/result" element={
				<ProtectedRoute requiredRole="user">
					<ExamResultPage />
				</ProtectedRoute>
			} />
			<Route path="/exam/:examId/detail" element={
				<ProtectedRoute requiredRole="user">
					<ExamDetailPage />
				</ProtectedRoute>
			} />
			
			{/* Course Learning - Standalone page without layout */}
			<Route path="/user/courses/:courseId/learn" element={
				<ProtectedRoute requiredRole="user">
					<CourseLearnPage />
				</ProtectedRoute>
			} />
				
				<Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
			</Routes>
		</BrowserRouter>
	)
}


