import { useState } from 'react'

export function usePlagiarismCheck() {
	const [score, setScore] = useState<number>(0)

	const checkText = async (text: string) => {
		// Placeholder similarity calculation
		const normalized = text.trim().length
		setScore(Math.min(100, Math.round((normalized % 37) * 2.5)))
	}

	return { score, checkText }
}


