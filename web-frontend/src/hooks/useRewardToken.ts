import { useState } from 'react'

export function useRewardToken() {
	const [balance, setBalance] = useState<number>(0)

	const reward = async (amount: number) => {
		setBalance((b) => b + amount)
	}

	return { balance, reward }
}


