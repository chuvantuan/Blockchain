import { useEffect, useRef, useState } from 'react'

export function useExamTimer(initialSeconds: number) {
	const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds)
	const intervalRef = useRef<number | null>(null)

	useEffect(() => {
		intervalRef.current = window.setInterval(() => {
			setSecondsLeft((s) => Math.max(0, s - 1))
		}, 1000)
		return () => {
			if (intervalRef.current) window.clearInterval(intervalRef.current)
		}
	}, [])

	return { secondsLeft }
}


