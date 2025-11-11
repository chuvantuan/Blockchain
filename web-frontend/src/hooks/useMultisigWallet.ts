import { useState } from 'react'
import { connectWallet } from '../services/blockchain/walletService'

export function useMultisigWallet() {
	const [address, setAddress] = useState<string | null>(null)

	const connect = async () => {
		const addr = await connectWallet()
		setAddress(addr)
	}

	return { address, connect }
}


