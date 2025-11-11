import { useState, useEffect, useCallback } from 'react'
import { 
	Organization, 
	OrganizationForm, 
	OrganizationFilters, 
	OrganizationDashboard,
	OrganizationStatus,
	OrganizationType,
	OrganizationSize,
	SubscriptionPlan,
	SubscriptionStatus,
	VerificationStatus
} from '../types/organization'
import { mockOrganizations, mockOrganizationDashboard } from '../mock/organizations'

export default function useOrganizations() {
	const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations)
	const [dashboard, setDashboard] = useState<OrganizationDashboard>(mockOrganizationDashboard)
	const [loading, setLoading] = useState(false)
	const [filters, setFilters] = useState<OrganizationFilters>({
		search: '',
		type: 'all',
		status: 'all',
		size: 'all',
		subscriptionPlan: 'all',
		subscriptionStatus: 'all',
		verificationStatus: 'all',
		industry: 'all',
		country: 'all',
		city: 'all',
		isActive: 'all',
		isVerified: 'all',
		isPremium: 'all',
		showAdvanced: false
	})

	// Filter organizations based on current filters
	const filteredOrganizations = organizations.filter(organization => {
		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			if (!organization.name.toLowerCase().includes(searchLower) &&
				!organization.shortDescription.toLowerCase().includes(searchLower) &&
				!organization.industry.toLowerCase().includes(searchLower) &&
				!organization.city.toLowerCase().includes(searchLower) &&
				!organization.country.toLowerCase().includes(searchLower)) {
				return false
			}
		}

		// Type filter
		if (filters.type !== 'all' && organization.type !== filters.type) {
			return false
		}

		// Status filter
		if (filters.status !== 'all' && organization.status !== filters.status) {
			return false
		}

		// Size filter
		if (filters.size !== 'all' && organization.size !== filters.size) {
			return false
		}

		// Subscription plan filter
		if (filters.subscriptionPlan !== 'all' && organization.subscriptionPlan !== filters.subscriptionPlan) {
			return false
		}

		// Subscription status filter
		if (filters.subscriptionStatus !== 'all' && organization.subscriptionStatus !== filters.subscriptionStatus) {
			return false
		}

		// Verification status filter
		if (filters.verificationStatus !== 'all' && organization.verificationStatus !== filters.verificationStatus) {
			return false
		}

		// Industry filter
		if (filters.industry !== 'all' && organization.industry !== filters.industry) {
			return false
		}

		// Country filter
		if (filters.country !== 'all' && organization.country !== filters.country) {
			return false
		}

		// City filter
		if (filters.city !== 'all' && organization.city !== filters.city) {
			return false
		}

		// Active filter
		if (filters.isActive !== 'all' && organization.isActive !== filters.isActive) {
			return false
		}

		// Verified filter
		if (filters.isVerified !== 'all' && organization.isVerified !== filters.isVerified) {
			return false
		}

		// Premium filter
		if (filters.isPremium !== 'all' && organization.isPremium !== filters.isPremium) {
			return false
		}

		// Date range filters
		if (filters.createdFrom) {
			const createdDate = new Date(organization.createdAt)
			const fromDate = new Date(filters.createdFrom)
			if (createdDate < fromDate) {
				return false
			}
		}

		if (filters.createdTo) {
			const createdDate = new Date(organization.createdAt)
			const toDate = new Date(filters.createdTo)
			if (createdDate > toDate) {
				return false
			}
		}

		// Employee range filters
		if (filters.employeesFrom !== undefined && organization.employees < filters.employeesFrom) {
			return false
		}

		if (filters.employeesTo !== undefined && organization.employees > filters.employeesTo) {
			return false
		}

		// Revenue range filters
		if (filters.revenueFrom !== undefined && organization.revenue < filters.revenueFrom) {
			return false
		}

		if (filters.revenueTo !== undefined && organization.revenue > filters.revenueTo) {
			return false
		}

		return true
	})

	// Update filters
	const updateFilter = useCallback((key: keyof OrganizationFilters, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}, [])

	// Clear all filters
	const clearFilters = useCallback(() => {
		setFilters({
			search: '',
			type: 'all',
			status: 'all',
			size: 'all',
			subscriptionPlan: 'all',
			subscriptionStatus: 'all',
			verificationStatus: 'all',
			industry: 'all',
			country: 'all',
			city: 'all',
			isActive: 'all',
			isVerified: 'all',
			isPremium: 'all',
			showAdvanced: false
		})
	}, [])

	// Add new organization
	const addOrganization = useCallback((organizationForm: OrganizationForm) => {
		const newOrganization: Organization = {
			id: `org-${Date.now()}`,
			...organizationForm,
			departments: Math.floor(Math.random() * 20) + 1,
			courses: Math.floor(Math.random() * 100) + 1,
			students: Math.floor(Math.random() * 5000) + 100,
			instructors: Math.floor(Math.random() * 200) + 10,
			admins: Math.floor(Math.random() * 10) + 1,
			subscriptionStatus: 'active' as SubscriptionStatus,
			subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
			features: [],
			settings: {
				timezone: 'Asia/Ho_Chi_Minh',
				language: 'vi',
				dateFormat: 'DD/MM/YYYY',
				currency: 'VND',
				notifications: {
					email: true,
					sms: false,
					push: true,
					marketing: false,
					updates: true,
					security: false
				},
				privacy: {
					dataSharing: false,
					analytics: true,
					marketing: false,
					thirdParty: false
				},
				learning: {
					certificates: true,
					badges: false,
					gamification: false,
					socialLearning: false,
					offlineMode: false
				},
				security: {
					twoFactor: false,
					sso: false,
					passwordPolicy: true,
					sessionTimeout: 480,
					ipWhitelist: false
				}
			},
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			lastLoginAt: new Date().toISOString(),
			isActive: organizationForm.status === 'active',
			isVerified: false,
			isPremium: organizationForm.subscriptionPlan === 'enterprise' || organizationForm.subscriptionPlan === 'professional',
			verificationStatus: 'not_verified' as VerificationStatus,
			notes: organizationForm.notes || ''
		}

		setOrganizations(prev => [newOrganization, ...prev])
		updateDashboardStats()
	}, [])

	// Update organization
	const updateOrganization = useCallback((organizationForm: OrganizationForm, organizationId: string) => {
		setOrganizations(prev => prev.map(org => 
			org.id === organizationId 
				? {
					...org,
					...organizationForm,
					updatedAt: new Date().toISOString(),
					isActive: organizationForm.status === 'active',
					isPremium: organizationForm.subscriptionPlan === 'enterprise' || organizationForm.subscriptionPlan === 'professional'
				}
				: org
		))
		updateDashboardStats()
	}, [])

	// Delete organization
	const deleteOrganization = useCallback((organizationId: string) => {
		setOrganizations(prev => prev.filter(org => org.id !== organizationId))
		updateDashboardStats()
	}, [])

	// Toggle organization status
	const toggleOrganizationStatus = useCallback((organizationId: string, newStatus: OrganizationStatus) => {
		setOrganizations(prev => prev.map(org => 
			org.id === organizationId 
				? {
					...org,
					status: newStatus,
					isActive: newStatus === 'active',
					updatedAt: new Date().toISOString()
				}
				: org
		))
		updateDashboardStats()
	}, [])

	// Update dashboard stats
	const updateDashboardStats = useCallback(() => {
		const stats = {
			totalOrganizations: organizations.length,
			activeOrganizations: organizations.filter(org => org.status === 'active').length,
			inactiveOrganizations: organizations.filter(org => org.status === 'inactive').length,
			pendingOrganizations: organizations.filter(org => org.status === 'pending').length,
			verifiedOrganizations: organizations.filter(org => org.verificationStatus === 'verified').length,
			premiumOrganizations: organizations.filter(org => org.isPremium).length,
			totalEmployees: organizations.reduce((sum, org) => sum + org.employees, 0),
			totalStudents: organizations.reduce((sum, org) => sum + org.students, 0),
			totalCourses: organizations.reduce((sum, org) => sum + org.courses, 0),
			totalRevenue: organizations.reduce((sum, org) => sum + org.revenue, 0),
			averageEmployees: organizations.length > 0 ? Math.round(organizations.reduce((sum, org) => sum + org.employees, 0) / organizations.length) : 0,
			averageStudents: organizations.length > 0 ? Math.round(organizations.reduce((sum, org) => sum + org.students, 0) / organizations.length) : 0,
			averageCourses: organizations.length > 0 ? Math.round(organizations.reduce((sum, org) => sum + org.courses, 0) / organizations.length) : 0,
			topIndustries: [] as Array<{ industry: string; count: number }>,
			topCountries: [] as Array<{ country: string; count: number }>,
			subscriptionDistribution: [] as Array<{ plan: SubscriptionPlan; count: number }>,
			sizeDistribution: [] as Array<{ size: OrganizationSize; count: number }>,
			monthlyGrowth: [] as Array<{ month: string; count: number }>
		}

		// Calculate top industries
		const industryCounts: Record<string, number> = {}
		organizations.forEach(org => {
			industryCounts[org.industry] = (industryCounts[org.industry] || 0) + 1
		})
		stats.topIndustries = Object.entries(industryCounts)
			.map(([industry, count]) => ({ industry, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5)

		// Calculate top countries
		const countryCounts: Record<string, number> = {}
		organizations.forEach(org => {
			countryCounts[org.country] = (countryCounts[org.country] || 0) + 1
		})
		stats.topCountries = Object.entries(countryCounts)
			.map(([country, count]) => ({ country, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5)

		// Calculate subscription distribution
		const subscriptionCounts: Record<SubscriptionPlan, number> = {
			free: 0,
			basic: 0,
			professional: 0,
			enterprise: 0,
			custom: 0
		}
		organizations.forEach(org => {
			subscriptionCounts[org.subscriptionPlan]++
		})
		stats.subscriptionDistribution = Object.entries(subscriptionCounts)
			.map(([plan, count]) => ({ plan: plan as SubscriptionPlan, count }))
			.filter(item => item.count > 0)

		// Calculate size distribution
		const sizeCounts: Record<OrganizationSize, number> = {
			startup: 0,
			small: 0,
			medium: 0,
			large: 0,
			enterprise: 0
		}
		organizations.forEach(org => {
			sizeCounts[org.size]++
		})
		stats.sizeDistribution = Object.entries(sizeCounts)
			.map(([size, count]) => ({ size: size as OrganizationSize, count }))
			.filter(item => item.count > 0)

		setDashboard(prev => ({
			...prev,
			stats
		}))
	}, [organizations])

	// Simulate real-time updates
	useEffect(() => {
		const interval = setInterval(() => {
			// Randomly update some organization stats
			setOrganizations(prev => prev.map(org => {
				if (Math.random() < 0.1) { // 10% chance to update
					return {
						...org,
						students: org.students + Math.floor(Math.random() * 10),
						courses: org.courses + Math.floor(Math.random() * 2),
						lastLoginAt: new Date().toISOString()
					}
				}
				return org
			}))
		}, 30000) // Update every 30 seconds

		return () => clearInterval(interval)
	}, [])

	// Update dashboard when organizations change
	useEffect(() => {
		updateDashboardStats()
	}, [organizations, updateDashboardStats])

	return {
		// Data
		organizations: filteredOrganizations,
		allOrganizations: organizations,
		dashboard,
		filters,
		
		// State
		loading,
		
		// Actions
		updateFilter,
		clearFilters,
		addOrganization,
		updateOrganization,
		deleteOrganization,
		toggleOrganizationStatus,
		
		// Computed
		totalCount: organizations.length,
		filteredCount: filteredOrganizations.length
	}
}
