import { useEffect, useState } from 'react'
import multisigApi, { IdentityUser } from '../services/api/multisigApi'
import { parseOwnerIds } from '../utils/multisig'

export type OwnerPreviewEntry = {
	userId: string
	status: 'loading' | 'success' | 'error'
	user?: IdentityUser
	error?: string
}

export const useOwnerPreview = (rawInput: string) => {
	const [entries, setEntries] = useState<OwnerPreviewEntry[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const ids = parseOwnerIds(rawInput)

		if (ids.length === 0) {
			setEntries([])
			setLoading(false)
			return
		}

		let cancelled = false
		setEntries(ids.map((id) => ({ userId: id, status: 'loading' as const })))
		setLoading(true)

		const timer = typeof window !== 'undefined' ? window.setTimeout(fetchPreviews, 350) : null
		if (timer === null) {
			void fetchPreviews()
		}

		async function fetchPreviews() {
			try {
				const results = await Promise.all(
					ids.map(async (id) => {
						try {
							const user = await multisigApi.getIdentityUserById(id)
							return {
								userId: id,
								status: 'success' as const,
								user,
							}
						} catch (error: any) {
							return {
								userId: id,
								status: 'error' as const,
								error: error?.message || 'Không tìm thấy sinh viên',
							}
						}
					}),
				)

				if (!cancelled) {
					setEntries(results)
				}
			} finally {
				if (!cancelled) {
					setLoading(false)
				}
			}
		}

		return () => {
			cancelled = true
			if (timer !== null) {
				window.clearTimeout(timer)
			}
		}
	}, [rawInput])

	return { entries, loading }
}


