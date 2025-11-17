import React from 'react'
import HeroSection from '../components/sections/HeroSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import CTASection from '../components/sections/CTASection'
import styles from '../assets/css/LandingPage.module.css'

export default function LandingPage(): JSX.Element {
	return (
		<div className={styles.page}>
			<HeroSection />
			<FeaturesSection />
			<TestimonialsSection />
			<CTASection />
		</div>
	)
}