import React, { useState, useEffect } from 'react'
import { Star, TrendingUp, Award, Calendar, Zap, Trophy } from 'lucide-react'
import StatCard from '../atoms/StatCard'
import DailyStreakCard from '../atoms/DailyStreakCard'

interface WelcomeBannerProps {
	userName?: string
	level?: number
	xp?: number
	totalExams?: number
	certificates?: number
	streak?: number
}

export default function WelcomeBanner({
	userName = 'User',
	level = 5,
	xp = 2500,
	totalExams = 12,
	certificates = 3,
	streak = 7
}: WelcomeBannerProps): JSX.Element {
	const [animatedXP, setAnimatedXP] = useState(0)

	// Calculate XP for next level (e.g., 1000 XP per level)
	const xpPerLevel = 1000
	const currentLevelXP = xp % xpPerLevel
	const nextLevelXP = xpPerLevel
	const xpProgress = (currentLevelXP / nextLevelXP) * 100

	// Animate XP counter on mount
	useEffect(() => {
		let start = 0
		const end = currentLevelXP
		const duration = 1500
		const increment = end / (duration / 16)

		const timer = setInterval(() => {
			start += increment
			if (start >= end) {
				setAnimatedXP(end)
				clearInterval(timer)
			} else {
				setAnimatedXP(Math.floor(start))
			}
		}, 16)

		return () => clearInterval(timer)
	}, [currentLevelXP])
	return (
		<div style={{
			background: 'var(--gradient-card)',
			borderRadius: '20px',
			padding: '32px',
			border: '1px solid var(--border)',
			boxShadow: 'var(--shadow-md)',
			marginBottom: '24px',
			position: 'relative',
			overflow: 'hidden',
			transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
		}}>
			{/* Animated Background Circles */}
			<div style={{
				position: 'absolute',
				top: '-50px',
				right: '-50px',
				width: '300px',
				height: '300px',
				background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 15%, transparent) 0%, transparent 70%)',
				borderRadius: '50%',
				animation: 'float 6s ease-in-out infinite',
				zIndex: 0,
				opacity: 0.5
			}} />
			<div style={{
				position: 'absolute',
				bottom: '-30px',
				left: '-30px',
				width: '200px',
				height: '200px',
				background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 12%, transparent) 0%, transparent 70%)',
				borderRadius: '50%',
				animation: 'float 8s ease-in-out infinite reverse',
				zIndex: 0,
				opacity: 0.5
			}} />

			{/* Floating Particles */}
			<div style={{
				position: 'absolute',
				top: '20%',
				left: '10%',
				width: '4px',
				height: '4px',
				background: 'var(--primary)',
				borderRadius: '50%',
				opacity: 0.3,
				animation: 'twinkle 3s ease-in-out infinite'
			}} />
			<div style={{
				position: 'absolute',
				top: '60%',
				right: '15%',
				width: '3px',
				height: '3px',
				background: 'var(--accent)',
				borderRadius: '50%',
				opacity: 0.4,
				animation: 'twinkle 4s ease-in-out infinite 0.5s'
			}} />
			<div style={{
				position: 'absolute',
				top: '40%',
				right: '30%',
				width: '5px',
				height: '5px',
				background: 'var(--primary)',
				borderRadius: '50%',
				opacity: 0.2,
				animation: 'twinkle 5s ease-in-out infinite 1s'
			}} />

			{/* Main Content */}
			<div style={{ position: 'relative', zIndex: 1 }}>
				{/* Header Section with Level Badge */}
				<div style={{
					marginBottom: '28px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}>
					<div style={{ flex: 1 }}>
						<h1 style={{
							fontSize: '32px',
							fontWeight: 800,
							marginBottom: '8px',
							margin: 0,
							color: 'var(--foreground)',
							background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							animation: 'slideInLeft 0.6s ease-out'
						}}>
							Chào mừng trở lại, {userName}! 👋
						</h1>
						<p style={{
							fontSize: '16px',
							color: 'var(--muted-foreground)',
							margin: 0,
							fontWeight: 500,
							animation: 'slideInLeft 0.6s ease-out 0.1s backwards'
						}}>
							Sẵn sàng tiếp tục hành trình học tập của bạn chưa?
						</p>
					</div>

					{/* Level Badge */}
					<div style={{
						background: 'linear-gradient(135deg, var(--primary), var(--accent))',
						borderRadius: '16px',
						padding: '16px 24px',
						display: 'flex',
						alignItems: 'center',
						gap: '12px',
						boxShadow: 'var(--shadow-lg)',
						animation: 'scaleIn 0.6s ease-out 0.2s backwards',
						position: 'relative',
						overflow: 'hidden'
					}}>
						<div style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: 'linear-gradient(45deg, transparent 30%, color-mix(in srgb, var(--background) 20%, transparent) 50%, transparent 70%)',
							animation: 'shimmerMove 3s infinite'
						}} />
						<Trophy style={{ width: '32px', height: '32px', color: 'white', position: 'relative' }} />
						<div style={{ position: 'relative' }}>
							<div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
								CẤP ĐỘ
							</div>
							<div style={{ fontSize: '28px', color: 'white', fontWeight: 800, lineHeight: 1 }}>
								{level}
							</div>
						</div>
					</div>
				</div>

				{/* XP Progress Bar */}
				<div style={{
					background: 'var(--muted)',
					borderRadius: '12px',
					padding: '20px',
					marginBottom: '28px',
					border: '1px solid var(--border)',
					animation: 'slideInUp 0.6s ease-out 0.3s backwards'
				}}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
							<Zap style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
							<span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>
								Kinh nghiệm
							</span>
						</div>
						<span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
							{animatedXP} / {nextLevelXP} XP
						</span>
					</div>
					<div style={{
						width: '100%',
						height: '12px',
						background: 'var(--background)',
						borderRadius: '999px',
						overflow: 'hidden',
						position: 'relative',
						boxShadow: 'var(--shadow-inner)'
					}}>
						<div style={{
							height: '100%',
							width: `${xpProgress}%`,
							background: 'linear-gradient(90deg, var(--primary), var(--accent))',
							borderRadius: '999px',
							transition: 'width 1s ease-out',
							position: 'relative',
							overflow: 'hidden'
						}}>
							<div style={{
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--background) 30%, transparent), transparent)',
								animation: 'progressShine 2s infinite'
							}} />
						</div>
					</div>
					<div style={{
						marginTop: '8px',
						fontSize: '12px',
						color: 'var(--muted-foreground)',
						textAlign: 'center',
						fontWeight: 500
					}}>
						Còn {nextLevelXP - currentLevelXP} XP nữa để đạt cấp {level + 1}
					</div>
				</div>

				{/* Stats Grid - Two Column Layout */}
				<div style={{
					display: 'grid',
					gridTemplateColumns: '2fr 1fr',
					gap: '24px',
					alignItems: 'start'
				}}>
					{/* Left Column - Stats */}
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(2, 1fr)',
						gap: '16px'
					}}>
						<div style={{ animation: 'slideInUp 0.6s ease-out 0.4s backwards' }}>
							<StatCard
								title="Tổng XP"
								value={xp.toLocaleString()}
								icon={<TrendingUp style={{ width: '28px', height: '28px' }} />}
								gradient="primary"
							/>
						</div>
						<div style={{ animation: 'slideInUp 0.6s ease-out 0.45s backwards' }}>
							<StatCard
								title="Bài thi đã làm"
								value={totalExams}
								icon={<Calendar style={{ width: '28px', height: '28px' }} />}
								gradient="accent"
							/>
						</div>
						<div style={{ animation: 'slideInUp 0.6s ease-out 0.5s backwards' }}>
							<StatCard
								title="Chứng chỉ"
								value={certificates}
								icon={<Award style={{ width: '28px', height: '28px' }} />}
								gradient="primary"
							/>
						</div>
						<div style={{ animation: 'slideInUp 0.6s ease-out 0.55s backwards' }}>
							<StatCard
								title="Ngày liên tiếp"
								value={streak}
								icon={<Star style={{ width: '28px', height: '28px' }} />}
								gradient="accent"
							/>
						</div>
					</div>

					{/* Right Column - Daily Streak */}
					<div style={{
						background: 'var(--background)',
						borderRadius: 'var(--radius-lg)',
						padding: '24px',
						border: '1px solid var(--border)',
						boxShadow: 'var(--shadow-sm)',
						height: 'fit-content',
						animation: 'slideInUp 0.6s ease-out 0.6s backwards'
					}}>
						<DailyStreakCard
							currentStreak={streak}
							weeklyProgress={[true, true, true, true, true, true, true]}
						/>
					</div>
				</div>
			</div>

			{/* CSS Animations */}
			<style>{`
				@keyframes float {
					0%, 100% { transform: translate(0, 0) scale(1); }
					50% { transform: translate(-20px, -20px) scale(1.05); }
				}

				@keyframes twinkle {
					0%, 100% { opacity: 0.2; transform: scale(1); }
					50% { opacity: 0.8; transform: scale(1.5); }
				}

				@keyframes slideInLeft {
					from {
						opacity: 0;
						transform: translateX(-30px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				@keyframes slideInUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes scaleIn {
					from {
						opacity: 0;
						transform: scale(0.8);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}

				@keyframes progressShine {
					0% { transform: translateX(-100%); }
					100% { transform: translateX(400%); }
				}

				@keyframes shimmerMove {
					0% { transform: translateX(-100%); }
					100% { transform: translateX(200%); }
				}
			`}</style>
		</div>
	)
}