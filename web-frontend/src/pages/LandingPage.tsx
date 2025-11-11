import React from 'react'
import HeroSection from '../components/sections/HeroSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import CTASection from '../components/sections/CTASection'

export default function LandingPage(): JSX.Element {
	return (
		<div style={{
			minHeight: '100vh',
			background: 'var(--background)',
			color: 'var(--foreground)',
			fontFamily: 'var(--font-sans)'
		}}>
			<HeroSection />
			<FeaturesSection />
			<TestimonialsSection />
			<CTASection />
		</div>
	)
}