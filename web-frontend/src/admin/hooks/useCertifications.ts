import { useState, useEffect, useCallback } from 'react'
import { 
	CertificateTemplate, 
	IssuedCertificate, 
	CertificateForm, 
	CertificateFilters, 
	CertificateDashboard,
	CertificateStatus 
} from '../types/certification'
import { 
	mockCertificateTemplates, 
	mockIssuedCertificates, 
	mockCertificateDashboard 
} from '../mock/certifications'

export default function useCertifications() {
	const [templates, setTemplates] = useState<CertificateTemplate[]>(mockCertificateTemplates)
	const [issuedCertificates, setIssuedCertificates] = useState<IssuedCertificate[]>(mockIssuedCertificates)
	const [dashboard, setDashboard] = useState<CertificateDashboard>(mockCertificateDashboard)
	const [filters, setFilters] = useState<CertificateFilters>({
		search: '',
		category: 'all',
		level: 'all',
		status: 'all',
		organization: 'all',
		course: 'all',
		isActive: 'all'
	})
	const [loading, setLoading] = useState(false)

	// Filtered data
	const filteredTemplates = templates.filter(template => {
		const matchesSearch = !filters.search || 
			template.name.toLowerCase().includes(filters.search.toLowerCase()) ||
			template.description.toLowerCase().includes(filters.search.toLowerCase()) ||
			template.issuer.toLowerCase().includes(filters.search.toLowerCase())
		
		const matchesCategory = filters.category === 'all' || template.category === filters.category
		const matchesLevel = filters.level === 'all' || template.level === filters.level
		const matchesActive = filters.isActive === 'all' || template.isActive === filters.isActive

		return matchesSearch && matchesCategory && matchesLevel && matchesActive
	})

	const filteredIssuedCertificates = issuedCertificates.filter(certificate => {
		const matchesSearch = !filters.search || 
			certificate.recipientName.toLowerCase().includes(filters.search.toLowerCase()) ||
			certificate.certificateName.toLowerCase().includes(filters.search.toLowerCase()) ||
			certificate.organizationName.toLowerCase().includes(filters.search.toLowerCase()) ||
			certificate.verificationCode.toLowerCase().includes(filters.search.toLowerCase())
		
		const matchesStatus = filters.status === 'all' || certificate.status === filters.status
		const matchesOrganization = filters.organization === 'all' || certificate.organizationId === filters.organization
		const matchesCourse = filters.course === 'all' || certificate.courseId === filters.course

		return matchesSearch && matchesStatus && matchesOrganization && matchesCourse
	})

	// CRUD Operations for Templates
	const addTemplate = useCallback((templateForm: CertificateForm) => {
		const newTemplate: CertificateTemplate = {
			id: `cert-template-${Date.now()}`,
			...templateForm,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
		setTemplates(prev => [newTemplate, ...prev])
		updateDashboardStats()
	}, [])

	const updateTemplate = useCallback((templateForm: CertificateForm, templateId: string) => {
		setTemplates(prev => prev.map(template => 
			template.id === templateId 
				? { ...template, ...templateForm, updatedAt: new Date().toISOString() }
				: template
		))
		updateDashboardStats()
	}, [])

	const deleteTemplate = useCallback((templateId: string) => {
		setTemplates(prev => prev.filter(template => template.id !== templateId))
		updateDashboardStats()
	}, [])

	const duplicateTemplate = useCallback((template: CertificateTemplate) => {
		const duplicatedTemplate: CertificateTemplate = {
			...template,
			id: `cert-template-${Date.now()}`,
			name: `${template.name} (Bản sao)`,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
		setTemplates(prev => [duplicatedTemplate, ...prev])
		updateDashboardStats()
	}, [])

	const toggleTemplateStatus = useCallback((templateId: string) => {
		setTemplates(prev => prev.map(template => 
			template.id === templateId 
				? { ...template, isActive: !template.isActive, updatedAt: new Date().toISOString() }
				: template
		))
		updateDashboardStats()
	}, [])

	// CRUD Operations for Issued Certificates
	const addIssuedCertificate = useCallback((certificateData: Partial<IssuedCertificate>) => {
		const newCertificate: IssuedCertificate = {
			id: `issued-cert-${Date.now()}`,
			certificateId: certificateData.certificateId || '',
			certificateName: certificateData.certificateName || '',
			recipientId: certificateData.recipientId || '',
			recipientName: certificateData.recipientName || '',
			recipientEmail: certificateData.recipientEmail || '',
			organizationId: certificateData.organizationId || '',
			organizationName: certificateData.organizationName || '',
			courseId: certificateData.courseId,
			courseName: certificateData.courseName,
			issuedAt: new Date().toISOString(),
			expiresAt: certificateData.expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
			status: 'issued' as CertificateStatus,
			verificationCode: `CERT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
			blockchainHash: certificateData.blockchainHash,
			metadata: certificateData.metadata || {
				score: 0,
				grade: 'N/A',
				completionDate: new Date().toISOString(),
				issuedBy: 'System Admin',
				issuedByTitle: 'Administrator',
				verificationUrl: '',
				additionalInfo: {}
			},
			downloadUrl: certificateData.downloadUrl,
			viewUrl: certificateData.viewUrl
		}
		setIssuedCertificates(prev => [newCertificate, ...prev])
		updateDashboardStats()
	}, [])

	const updateIssuedCertificate = useCallback((certificateData: Partial<IssuedCertificate>, certificateId: string) => {
		setIssuedCertificates(prev => prev.map(certificate => 
			certificate.id === certificateId 
				? { ...certificate, ...certificateData }
				: certificate
		))
		updateDashboardStats()
	}, [])

	const deleteIssuedCertificate = useCallback((certificateId: string) => {
		setIssuedCertificates(prev => prev.filter(certificate => certificate.id !== certificateId))
		updateDashboardStats()
	}, [])

	const toggleCertificateStatus = useCallback((certificateId: string, newStatus: CertificateStatus) => {
		setIssuedCertificates(prev => prev.map(certificate => 
			certificate.id === certificateId 
				? { ...certificate, status: newStatus }
				: certificate
		))
		updateDashboardStats()
	}, [])

	// Filter operations
	const updateFilter = useCallback((key: keyof CertificateFilters, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }))
	}, [])

	const clearFilters = useCallback(() => {
		setFilters({
			search: '',
			category: 'all',
			level: 'all',
			status: 'all',
			organization: 'all',
			course: 'all',
			isActive: 'all'
		})
	}, [])

	// Dashboard stats update
	const updateDashboardStats = useCallback(() => {
		const stats = {
			totalTemplates: templates.length,
			activeTemplates: templates.filter(t => t.isActive).length,
			totalIssued: issuedCertificates.length,
			activeCertificates: issuedCertificates.filter(c => c.status === 'active').length,
			expiredCertificates: issuedCertificates.filter(c => c.status === 'expired').length,
			revokedCertificates: issuedCertificates.filter(c => c.status === 'revoked').length,
			pendingCertificates: issuedCertificates.filter(c => c.status === 'pending').length,
			totalRecipients: new Set(issuedCertificates.map(c => c.recipientId)).size,
			totalOrganizations: new Set(issuedCertificates.map(c => c.organizationId)).size,
			averageValidityPeriod: templates.reduce((sum, t) => sum + t.validityPeriod, 0) / templates.length || 0,
			mostPopularCategory: getMostPopularCategory(),
			mostPopularLevel: getMostPopularLevel(),
			certificatesByCategory: getCertificatesByCategory(),
			certificatesByLevel: getCertificatesByLevel(),
			certificatesByStatus: getCertificatesByStatus(),
			monthlyIssuance: getMonthlyIssuance(),
			topOrganizations: getTopOrganizations(),
			topCourses: getTopCourses()
		}

		setDashboard(prev => ({
			...prev,
			stats
		}))
	}, [templates, issuedCertificates])

	// Helper functions for stats
	const getMostPopularCategory = () => {
		const categoryCount: Record<string, number> = {}
		templates.forEach(template => {
			categoryCount[template.category] = (categoryCount[template.category] || 0) + 1
		})
		return Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0]?.[0] || 'course_completion'
	}

	const getMostPopularLevel = () => {
		const levelCount: Record<string, number> = {}
		templates.forEach(template => {
			levelCount[template.level] = (levelCount[template.level] || 0) + 1
		})
		return Object.entries(levelCount).sort(([,a], [,b]) => b - a)[0]?.[0] || 'beginner'
	}

	const getCertificatesByCategory = () => {
		const categoryCount: Record<string, number> = {}
		templates.forEach(template => {
			categoryCount[template.category] = (categoryCount[template.category] || 0) + 1
		})
		return Object.entries(categoryCount).map(([category, count]) => ({ category: category as any, count }))
	}

	const getCertificatesByLevel = () => {
		const levelCount: Record<string, number> = {}
		templates.forEach(template => {
			levelCount[template.level] = (levelCount[template.level] || 0) + 1
		})
		return Object.entries(levelCount).map(([level, count]) => ({ level: level as any, count }))
	}

	const getCertificatesByStatus = () => {
		const statusCount: Record<string, number> = {}
		issuedCertificates.forEach(certificate => {
			statusCount[certificate.status] = (statusCount[certificate.status] || 0) + 1
		})
		return Object.entries(statusCount).map(([status, count]) => ({ status: status as any, count }))
	}

	const getMonthlyIssuance = () => {
		const monthlyCount: Record<string, number> = {}
		issuedCertificates.forEach(certificate => {
			const month = new Date(certificate.issuedAt).toISOString().slice(0, 7)
			monthlyCount[month] = (monthlyCount[month] || 0) + 1
		})
		return Object.entries(monthlyCount).map(([month, count]) => ({ month, count }))
	}

	const getTopOrganizations = () => {
		const orgCount: Record<string, { name: string; count: number }> = {}
		issuedCertificates.forEach(certificate => {
			if (!orgCount[certificate.organizationId]) {
				orgCount[certificate.organizationId] = { name: certificate.organizationName, count: 0 }
			}
			orgCount[certificate.organizationId].count++
		})
		return Object.entries(orgCount)
			.map(([organizationId, data]) => ({ organizationId, organizationName: data.name, count: data.count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5)
	}

	const getTopCourses = () => {
		const courseCount: Record<string, { name: string; count: number }> = {}
		issuedCertificates.forEach(certificate => {
			if (certificate.courseId) {
				if (!courseCount[certificate.courseId]) {
					courseCount[certificate.courseId] = { name: certificate.courseName || 'Unknown', count: 0 }
				}
				courseCount[certificate.courseId].count++
			}
		})
		return Object.entries(courseCount)
			.map(([courseId, data]) => ({ courseId, courseName: data.name, count: data.count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 5)
	}

	// Real-time data simulation
	useEffect(() => {
		const interval = setInterval(() => {
			// Simulate new certificate issuance
			if (Math.random() < 0.1) { // 10% chance every 5 seconds
				const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
				if (randomTemplate) {
					const newCertificate = {
						certificateId: randomTemplate.id,
						certificateName: randomTemplate.name,
						recipientId: `user-${Date.now()}`,
						recipientName: `Học viên ${Math.floor(Math.random() * 1000)}`,
						recipientEmail: `student${Math.floor(Math.random() * 1000)}@email.com`,
						organizationId: `org-${Math.floor(Math.random() * 5) + 1}`,
						organizationName: `Tổ chức ${Math.floor(Math.random() * 5) + 1}`,
						courseId: `course-${Math.floor(Math.random() * 10) + 1}`,
						courseName: `Khóa học ${Math.floor(Math.random() * 10) + 1}`,
						expiresAt: new Date(Date.now() + randomTemplate.validityPeriod * 30 * 24 * 60 * 60 * 1000).toISOString(),
						status: 'issued' as CertificateStatus,
						blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`,
						metadata: {
							score: Math.floor(Math.random() * 40) + 60, // 60-100
							grade: ['A', 'B+', 'B', 'C+', 'C'][Math.floor(Math.random() * 5)],
							completionDate: new Date().toISOString(),
							issuedBy: 'System Auto',
							issuedByTitle: 'Auto Issuer',
							verificationUrl: `https://eduplatform.com/verify/CERT-${Date.now()}`,
							additionalInfo: {}
						}
					}
					addIssuedCertificate(newCertificate)
				}
			}
		}, 5000)

		return () => clearInterval(interval)
	}, [templates, addIssuedCertificate])

	// Update dashboard stats when data changes
	useEffect(() => {
		updateDashboardStats()
	}, [templates, issuedCertificates, updateDashboardStats])

	return {
		// Data
		templates: filteredTemplates,
		allTemplates: templates,
		issuedCertificates: filteredIssuedCertificates,
		allIssuedCertificates: issuedCertificates,
		dashboard,
		filters,
		
		// Template operations
		addTemplate,
		updateTemplate,
		deleteTemplate,
		duplicateTemplate,
		toggleTemplateStatus,
		
		// Certificate operations
		addIssuedCertificate,
		updateIssuedCertificate,
		deleteIssuedCertificate,
		toggleCertificateStatus,
		
		// Filter operations
		updateFilter,
		clearFilters,
		
		// State
		loading,
		totalTemplates: templates.length,
		totalIssuedCertificates: issuedCertificates.length,
		filteredTemplatesCount: filteredTemplates.length,
		filteredIssuedCertificatesCount: filteredIssuedCertificates.length
	}
}
