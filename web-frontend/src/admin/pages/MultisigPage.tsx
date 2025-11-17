import React, { FormEvent, Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import {
	AlertCircle,
	CheckCircle2,
	ClipboardList,
	FilePlus2,
	Link2,
	ListChecks,
	Play,
	RefreshCw,
	Search,
	Send,
	ShieldCheck,
	Users,
	Wallet,
} from 'lucide-react'
import multisigApi, {
	ConfirmTransactionRequest,
	CreateWalletRequest,
	getAllWallets,
	LinkWalletRequest,
	MultisigTransaction,
	MultisigWallet,
	OwnerCredentialResponse,
	SubmitTransactionRequest,
} from '../../services/api/multisigApi'
import { getAllUsers } from '../../services/api/userApi'
import { formatWeiToEth } from '../../utils/multisig'
	const parseOwnerUserIds = (input: string): number[] => {
		return input
			.split(/[,\n]/)
			.map((s) => s.trim())
			.filter((s) => s.length > 0 && !isNaN(Number(s)))
			.map((s) => Number(s));
	};
import '../styles/common.css'
import '../styles/form.css'
import '../styles/table.css'
import '../styles/multisig.css'

type AlertState = {
	type: 'success' | 'error' | 'info'
	message: string
	details?: string
} | null

type TransactionFilters = {
	status: 'all' | 'submitted' | 'confirmed' | 'executed' | 'failed'
	search: string
}

type TrackedWallet = MultisigWallet & { lastLoadedAt?: string; ownerUserIds?: number[] }

const MultisigPage = (): JSX.Element => {
	const [alertState, setAlertState] = useState<AlertState>(null)
	const [createLoading, setCreateLoading] = useState(false)
	const [linkLoading, setLinkLoading] = useState(false)
	const [loadingWallet, setLoadingWallet] = useState(false)
	const [transactionsLoading, setTransactionsLoading] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState<Record<string, boolean>>({})
	const [executeLoading, setExecuteLoading] = useState<Record<string, boolean>>({})
	const [ownerCredential, setOwnerCredential] = useState<OwnerCredentialResponse | null>(null)
	const [credentialLoading, setCredentialLoading] = useState(false)

	const [walletIdInput, setWalletIdInput] = useState('')
	const [activeWalletId, setActiveWalletId] = useState<string | null>(null)
	const [wallet, setWallet] = useState<MultisigWallet | null>(null)
	const [trackedWallets, setTrackedWallets] = useState<TrackedWallet[]>([])
	const [allWallets, setAllWallets] = useState<MultisigWallet[]>([])
	const [allWalletsLoading, setAllWalletsLoading] = useState(false)
	const [availableUsers, setAvailableUsers] = useState<any[]>([])
	const [availableUsersLoading, setAvailableUsersLoading] = useState(false)
	const [useManualInput, setUseManualInput] = useState(false)
	const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
	const [transactions, setTransactions] = useState<MultisigTransaction[]>([])
	const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)
	
	// Debug: Log transactions state changes
	useEffect(() => {
		console.log('[MultisigPage] transactions state updated:', transactions.length, 'items')
		if (transactions.length > 0) {
			console.log('[MultisigPage] transactions:', transactions)
		}
	}, [transactions])

	const [createForm, setCreateForm] = useState({
		name: '',
		description: '',
		ownerUserIdsText: '',
		threshold: 1,
	})

	const [linkForm, setLinkForm] = useState({
		name: '',
		description: '',
		contractAddress: '',
		ownerUserIdsText: '',
	})

	const [transactionForm, setTransactionForm] = useState({
		destination: '',
		value: '',
		data: '',
		description: '',
	})

	const [confirmKeys, setConfirmKeys] = useState<Record<string, string>>({})
	const [transactionFilters, setTransactionFilters] = useState<TransactionFilters>({
		status: 'all',
		search: '',
	})

	const showAlert = useCallback((alert: AlertState) => {
		setAlertState(alert)
		if (alert) {
			setTimeout(() => {
				setAlertState(null)
			}, 5000)
		}
	}, [])

	// Helper function to extract ownerUserIds from ownerDetails
	const extractOwnerUserIds = useCallback((wallet: MultisigWallet): number[] => {
		if (wallet.ownerDetails && wallet.ownerDetails.length > 0) {
			return wallet.ownerDetails.map(owner => owner.userId).filter((id): id is number => id != null)
		}
		return []
	}, [])

	const upsertTrackedWallet = useCallback((next: MultisigWallet, loadedAt?: string) => {
		setTrackedWallets((prev) => {
			const ownerUserIds = extractOwnerUserIds(next)
			const exists = prev.find((item) => item.id === next.id)
			if (exists) {
				return prev.map((item) =>
					item.id === next.id
						? {
								...next,
								ownerUserIds,
								lastLoadedAt: loadedAt ?? item.lastLoadedAt,
						  }
						: item,
				)
			}
			return [{ ...next, ownerUserIds, lastLoadedAt: loadedAt }, ...prev]
		})
	}, [extractOwnerUserIds])

	const fetchAllWallets = useCallback(async () => {
		setAllWalletsLoading(true)
		try {
			const wallets = await multisigApi.getAllWallets()
			setAllWallets(wallets)
			// Also update tracked wallets with all available wallets
			// Extract ownerUserIds from ownerDetails for each wallet
			setTrackedWallets(wallets.map(wallet => {
				const ownerUserIds = wallet.ownerDetails 
					? wallet.ownerDetails.map(owner => owner.userId).filter((id): id is number => id != null)
					: []
				return { 
					...wallet, 
					ownerUserIds,
					lastLoadedAt: new Date().toISOString() 
				}
			}))
		} catch (error: any) {
			showAlert({
				type: 'error',
				message: 'Không thể tải danh sách ví',
				details: error.message,
			})
		} finally {
			setAllWalletsLoading(false)
		}
	}, [showAlert])

	const fetchAvailableUsers = useCallback(async () => {
		setAvailableUsersLoading(true)
		try {
			const users = await getAllUsers()
			setAvailableUsers(users)
		} catch (error: any) {
			console.warn('Không thể tải danh sách người dùng từ user-service:', error.message)
			// Không hiển thị alert lỗi vì đây là tính năng phụ
			// Người dùng vẫn có thể tạo ví bằng cách khác
			setAvailableUsers([])
		} finally {
			setAvailableUsersLoading(false)
		}
	}, [])

	const fetchWallet = useCallback(
		async (walletId: string, options?: { suppressAlert?: boolean; track?: boolean }) => {
			if (!walletId) return
			setLoadingWallet(true)
			try {
				const data = await multisigApi.getWalletById(walletId)
				setWallet(data)
				setActiveWalletId(walletId)
				const now = new Date().toISOString()
				if (options?.track !== false) {
					upsertTrackedWallet(data, now)
				}
				if (!options?.suppressAlert) {
					showAlert({
						type: 'success',
						message: 'Đã tải thông tin ví multisig',
					})
				}
			} catch (error: any) {
				setWallet(null)
				showAlert({
					type: 'error',
					message: 'Không thể tải ví multisig',
					details: error.message,
				})
			} finally {
				setLoadingWallet(false)
			}
		},
		[showAlert, upsertTrackedWallet],
	)

	const fetchTransactions = useCallback(
		async (walletId: string) => {
			if (!walletId) {
				console.log('[MultisigPage] fetchTransactions: walletId is empty')
				return
			}
			console.log('[MultisigPage] fetchTransactions: Starting fetch for walletId:', walletId)
			setTransactionsLoading(true)
			try {
				console.log('[MultisigPage] fetchTransactions: Calling API...')
				const data = await multisigApi.getTransactionsByWallet(walletId)
				console.log('[MultisigPage] fetchTransactions: API response:', data)
				console.log('[MultisigPage] fetchTransactions: Response type:', Array.isArray(data) ? 'array' : typeof data)
				console.log('[MultisigPage] fetchTransactions: Response length:', Array.isArray(data) ? data.length : 'N/A')
				
				if (!Array.isArray(data)) {
					console.error('[MultisigPage] fetchTransactions: Response is not an array!', data)
					showAlert({
						type: 'error',
						message: 'Dữ liệu giao dịch không đúng định dạng',
						details: 'API trả về dữ liệu không phải là mảng',
					})
					return
				}
				
				const sorted = [...data].sort((a, b) => {
					const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
					const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
					return bTime - aTime
				})
				console.log('[MultisigPage] fetchTransactions: Setting transactions state with', sorted.length, 'items')
				setTransactions(sorted)
				setLastSyncedAt(new Date().toISOString())
			} catch (error: any) {
				console.error('[MultisigPage] fetchTransactions: Error:', error)
				showAlert({
					type: 'error',
					message: 'Không thể tải danh sách giao dịch',
					details: error.message,
				})
			} finally {
				setTransactionsLoading(false)
			}
		},
		[showAlert],
	)

	const handleCreateWallet = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		let ownerUserIds: number[] = []

		if (useManualInput) {
			ownerUserIds = parseOwnerUserIds(createForm.ownerUserIdsText)
			if (ownerUserIds.length === 0) {
				showAlert({
					type: 'error',
					message: 'Vui lòng nhập ít nhất 1 ID người dùng hợp lệ (ví dụ: 1,2,3)',
				})
				return
			}
		} else {
			if (selectedUserIds.length === 0) {
				showAlert({
					type: 'error',
					message: 'Vui lòng chọn ít nhất 1 người dùng làm chủ sở hữu',
				})
				return
			}
			ownerUserIds = selectedUserIds
		}

		const payload: CreateWalletRequest = {
			name: createForm.name.trim(),
			description: createForm.description.trim() || undefined,
			ownerUserIds,
			threshold: Number(createForm.threshold),
		}

		if (!payload.name) {
			showAlert({
				type: 'error',
				message: 'Tên ví không được để trống',
			})
			return
		}

		if (Number.isNaN(payload.threshold) || payload.threshold < 1) {
			showAlert({
				type: 'error',
				message: 'Ngưỡng chữ ký phải là số nguyên dương',
			})
			return
		}

		setCreateLoading(true)
		try {
			const newWallet = await multisigApi.createWallet(payload)
			setCreateForm({
				name: '',
				description: '',
				ownerUserIdsText: '',
				threshold: 1,
			})
			setSelectedUserIds([])
			setUseManualInput(false)
			setWalletIdInput(newWallet.id)
			await fetchWallet(newWallet.id, { suppressAlert: true })
			await fetchTransactions(newWallet.id)
			showAlert({
				type: 'success',
				message: 'Tạo ví multisig thành công',
			})
		} catch (error: any) {
			showAlert({
				type: 'error',
				message: 'Không thể tạo ví multisig',
				details: error.message,
			})
		} finally {
			setCreateLoading(false)
		}
	}

	const handleLinkWallet = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const ownerUserIds = parseOwnerUserIds(linkForm.ownerUserIdsText)
		const payload: LinkWalletRequest = {
			name: linkForm.name.trim(),
			description: linkForm.description.trim() || undefined,
			contractAddress: linkForm.contractAddress.trim(),
			...(ownerUserIds.length > 0 && { ownerUserIds }),
		}

		if (!payload.name || !payload.contractAddress) {
			showAlert({
				type: 'error',
				message: 'Tên ví và địa chỉ contract không được để trống',
			})
			return
		}

		setLinkLoading(true)
		try {
			const linkedWallet = await multisigApi.linkWallet(payload)
			setLinkForm({
				name: '',
				description: '',
				contractAddress: '',
				ownerUserIdsText: '',
			})
			setWalletIdInput(linkedWallet.id)
			await fetchWallet(linkedWallet.id, { suppressAlert: true })
			await fetchTransactions(linkedWallet.id)
			showAlert({
				type: 'success',
				message: 'Liên kết ví multisig thành công',
			})
		} catch (error: any) {
			showAlert({
				type: 'error',
				message: 'Không thể liên kết ví multisig',
				details: error.message,
			})
		} finally {
			setLinkLoading(false)
		}
	}

	const handleLoadWallet = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!walletIdInput.trim()) {
			showAlert({
				type: 'error',
				message: 'Vui lòng nhập ID ví multisig hoặc chọn từ danh sách theo dõi',
			})
			return
		}
		await fetchWallet(walletIdInput.trim())
		await fetchTransactions(walletIdInput.trim())
	}

	const handleSelectTrackedWallet = async (walletId: string) => {
		setWalletIdInput(walletId)
		await fetchWallet(walletId, { suppressAlert: true })
		await fetchTransactions(walletId)
		showAlert({
			type: 'info',
			message: 'Đã chuyển tới ví được theo dõi',
		})
	}

	const handleSubmitTransaction = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!activeWalletId) {
			showAlert({
				type: 'error',
				message: 'Vui lòng tải thông tin ví trước',
			})
			return
		}

		const payload: SubmitTransactionRequest = {
			destination: transactionForm.destination.trim(),
			value: transactionForm.value,
			data: transactionForm.data.trim() || undefined,
			description: transactionForm.description.trim() || undefined,
		}

		if (!payload.destination || payload.value === '') {
			showAlert({
				type: 'error',
				message: 'Địa chỉ nhận và số lượng ETH không được để trống',
			})
			return
		}

		setSubmitLoading(true)
		try {
			const transaction = await multisigApi.submitTransaction(activeWalletId, payload)
			setTransactionForm({
				destination: '',
				value: '',
				data: '',
				description: '',
			})
			await fetchTransactions(activeWalletId)
			showAlert({
				type: 'success',
				message: 'Đã tạo giao dịch multisig mới',
			})
		} catch (error: any) {
			showAlert({
				type: 'error',
				message: 'Không thể tạo giao dịch',
				details: error.message,
			})
		} finally {
			setSubmitLoading(false)
		}
	}

	const handleConfirmTransaction = async (transactionId: string) => {
		const walletId = activeWalletId
		if (!walletId) return
		
		// Kiểm tra nếu đang loading thì không cho phép click lại
		if (confirmLoading[transactionId]) return
		
		const payload: ConfirmTransactionRequest = {}
		const candidateKey = confirmKeys[transactionId]?.trim()
		if (candidateKey && candidateKey.length > 0) {
			payload.privateKey = candidateKey
		}
		setConfirmLoading((prev) => ({ ...prev, [transactionId]: true }))
		try {
			const updated = await multisigApi.confirmTransaction(transactionId, payload)
			setTransactions((prev) =>
				prev.map((tx) => (tx.id === updated.id ? { ...tx, ...updated } : tx)),
			)
			// Refresh danh sách giao dịch để cập nhật trạng thái mới nhất
			if (activeWalletId) {
				await fetchTransactions(activeWalletId)
			}
			showAlert({
				type: 'success',
				message: 'Đã xác nhận giao dịch thành công',
			})
		} catch (error: any) {
			// Lấy thông báo lỗi từ response
			const errorMessage = error.response?.data?.message || error.message || 'Không thể xác nhận giao dịch'
			showAlert({
				type: 'error',
				message: 'Không thể xác nhận giao dịch',
				details: errorMessage,
			})
		} finally {
			setConfirmLoading((prev) => ({ ...prev, [transactionId]: false }))
		}
	}

	const handleExecuteTransaction = async (transactionId: string) => {
		if (!activeWalletId) return
		setExecuteLoading((prev) => ({ ...prev, [transactionId]: true }))
		try {
			const updated = await multisigApi.executeTransaction(transactionId)
			setTransactions((prev) =>
				prev.map((tx) => (tx.id === updated.id ? { ...tx, ...updated } : tx)),
			)
			showAlert({
				type: 'success',
				message: 'Đã thực thi giao dịch trên blockchain',
			})
		} catch (error: any) {
			showAlert({
				type: 'error',
				message: 'Không thể thực thi giao dịch',
				details: error.message,
			})
		} finally {
			setExecuteLoading((prev) => ({ ...prev, [transactionId]: false }))
		}
	}

	const pendingTransactions = useMemo(
		() => transactions.filter((tx) => tx.status !== 'executed'),
		[transactions],
	)

	const executedTransactions = useMemo(
		() => transactions.filter((tx) => tx.status === 'executed'),
		[transactions],
	)

	const filteredTransactions = useMemo(() => {
		console.log('[MultisigPage] filteredTransactions: transactions count:', transactions.length)
		console.log('[MultisigPage] filteredTransactions: filter status:', transactionFilters.status)
		console.log('[MultisigPage] filteredTransactions: filter search:', transactionFilters.search)
		
		const searchText = transactionFilters.search.trim().toLowerCase()
		const filtered = transactions.filter((tx) => {
			if (transactionFilters.status !== 'all' && tx.status !== transactionFilters.status) {
				return false
			}
			if (searchText) {
				// Build search target from transaction fields
				let target = `${tx.id} ${tx.destination} ${tx.txHash ?? ''} ${tx.txIndexOnChain}`.toLowerCase()
				
				// Also search in wallet owner emails if wallet and ownerDetails are available
				if (wallet?.ownerDetails && wallet.ownerDetails.length > 0) {
					// Try to get emails from identity field
					const ownerEmails = wallet.ownerDetails
						.map(owner => {
							// Check if identity exists and has email
							if (owner.identity?.email) {
								return owner.identity.email
							}
							// If identity doesn't have email, try to find in availableUsers
							if (availableUsers && availableUsers.length > 0) {
								const user = availableUsers.find(u => 
									u.id?.toString() === owner.userId?.toString() || 
									u.userId?.toString() === owner.userId?.toString()
								)
								return user?.email || ''
							}
							return ''
						})
						.filter(email => email)
						.join(' ')
					target += ' ' + ownerEmails.toLowerCase()
					
					// Also search in owner addresses
					const ownerAddresses = wallet.ownerDetails
						.map(owner => owner.address || '')
						.filter(addr => addr)
						.join(' ')
					target += ' ' + ownerAddresses.toLowerCase()
					
					// Search in confirmation addresses
					if (tx.confirmations && tx.confirmations.length > 0) {
						target += ' ' + tx.confirmations.join(' ').toLowerCase()
					}
				}
				
				if (!target.includes(searchText)) {
					return false
				}
			}
			return true
		})
		
		console.log('[MultisigPage] filteredTransactions: filtered count:', filtered.length)
		if (transactions.length > 0 && searchText) {
			console.log('[MultisigPage] filteredTransactions: Sample transaction:', transactions[0])
			console.log('[MultisigPage] filteredTransactions: Wallet ownerDetails:', wallet?.ownerDetails)
			if (wallet?.ownerDetails && wallet.ownerDetails.length > 0) {
				console.log('[MultisigPage] filteredTransactions: First ownerDetail structure:', JSON.stringify(wallet.ownerDetails[0], null, 2))
				wallet.ownerDetails.forEach((owner, idx) => {
					console.log(`[MultisigPage] Owner ${idx}: userId=${owner.userId}, address=${owner.address}, identity=`, owner.identity)
				})
			}
		}
		return filtered
	}, [transactions, transactionFilters, wallet, availableUsers])

	const totalWalletValue = useMemo(() => {
		try {
			const wei = transactions.reduce((acc, tx) => {
				const numericValue = tx.value ?? '0'
				return acc + BigInt(numericValue)
			}, BigInt(0))
			return formatWeiToEth(wei.toString())
		} catch {
			return '0'
		}
	}, [transactions])

	const readyToExecuteCount = useMemo(() => {
		if (!wallet) return 0
		return pendingTransactions.filter(
			(tx) => (tx.confirmations?.length || 0) >= wallet.threshold && tx.status !== 'executed',
		).length
	}, [pendingTransactions, wallet])

	// Get all user IDs that are already used in tracked wallets
	const usedUserIds = useMemo(() => {
		const ids = new Set<number>()
		trackedWallets.forEach(wallet => {
			if (wallet.ownerUserIds && wallet.ownerUserIds.length > 0) {
				wallet.ownerUserIds.forEach(id => {
					const idNum = typeof id === 'string' ? Number(id) : id
					if (!isNaN(idNum)) {
						ids.add(idNum)
					}
				})
			}
		})
		return ids
	}, [trackedWallets])

	// Filter available users to exclude those already used in tracked wallets
	const availableUsersForSelection = useMemo(() => {
		return availableUsers.filter(user => !usedUserIds.has(user.id))
	}, [availableUsers, usedUserIds])

	// Automatically remove selected user IDs that are already used in tracked wallets
	useEffect(() => {
		if (selectedUserIds.length > 0 && usedUserIds.size > 0) {
			const validSelectedIds = selectedUserIds.filter(id => !usedUserIds.has(id))
			if (validSelectedIds.length !== selectedUserIds.length) {
				const removedIds = selectedUserIds.filter(id => usedUserIds.has(id))
				console.log('[MultisigPage] Removing selected user IDs that are already in tracked wallets:', removedIds)
				setSelectedUserIds(validSelectedIds)
			}
		}
	}, [usedUserIds, selectedUserIds])

	const latestLoadedWallet = trackedWallets.find((item) => item.id === activeWalletId) || null

	// Fetch all wallets and available users on component mount
	useEffect(() => {
		fetchAllWallets()
		fetchAvailableUsers()
	}, [fetchAllWallets, fetchAvailableUsers])
	
	// Auto-fetch transactions when activeWalletId changes
	useEffect(() => {
		if (activeWalletId && wallet && wallet.id === activeWalletId) {
			console.log('[MultisigPage] Auto-fetching transactions for activeWalletId:', activeWalletId)
			fetchTransactions(activeWalletId)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeWalletId]) // Only depend on activeWalletId to avoid infinite loop

	const handleGetOwnerCredential = async () => {
		if (!activeWalletId) return
		setCredentialLoading(true)
		try {
			const credential = await multisigApi.getOwnerCredential(activeWalletId)
			setOwnerCredential(credential)
			showAlert({
				type: 'success',
				message: 'Lấy thông tin credential thành công',
			})
		} catch (error: any) {
			showAlert({
				type: 'error',
				message: 'Không thể lấy thông tin credential',
				details: error.message,
			})
		} finally {
			setCredentialLoading(false)
		}
	}

	return (
		<div className="multisig-page">
			<div className="multisig-header">
				<div>
					<h1>
						<ShieldCheck size={28} />
						<span style={{ marginLeft: 8 }}>Quản lý Multisig</span>
					</h1>
					<p>
						Tạo, liên kết và giám sát ví multisig dành cho admin. Theo dõi trạng thái xác nhận,
						thực thi giao dịch và bảo đảm đủ chủ sở hữu ký duyệt trước khi đẩy lên blockchain.
					</p>
					{wallet && latestLoadedWallet?.lastLoadedAt && (
						<p style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 8 }}>
							Lần đồng bộ gần nhất:{' '}
							{lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'Chưa có dữ liệu'} — Ví đang
							chọn được tải lúc {new Date(latestLoadedWallet.lastLoadedAt).toLocaleString()}
						</p>
					)}
				</div>

				<div className="multisig-actions">
					<button
						className="btn btn-secondary"
						type="button"
						onClick={() => {
							if (activeWalletId) {
								fetchWallet(activeWalletId, { suppressAlert: true })
								fetchTransactions(activeWalletId)
							}
						}}
						disabled={loadingWallet || transactionsLoading || !activeWalletId}
					>
						<RefreshCw size={16} />
						Làm mới dữ liệu
					</button>
				</div>
			</div>

			{alertState && (
				<div className={`multisig-alert ${alertState.type}`}>
					<AlertCircle size={18} style={{ marginTop: 2 }} />
					<div>
						<div style={{ fontWeight: 600 }}>{alertState.message}</div>
						{alertState.details && (
							<div style={{ opacity: 0.8, fontSize: 13 }}>{alertState.details}</div>
						)}
					</div>
				</div>
			)}

			<div className="multisig-grid">
				<div className="multisig-card">
					<h2>
						<FilePlus2 size={18} />
						Tạo ví multisig mới
					</h2>
					<form className="form-grid" onSubmit={handleCreateWallet}>
						<div className="form-group">
							<label className="form-label">Tên ví</label>
							<input
								className="form-input"
								type="text"
								value={createForm.name}
								onChange={(event) =>
									setCreateForm((prev) => ({ ...prev, name: event.target.value }))
								}
								placeholder="Ví điều hành DAO"
								required
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Ngưỡng chữ ký (threshold)</label>
							<input
								className="form-input"
								type="number"
								min={1}
								value={createForm.threshold}
								onChange={(event) =>
									setCreateForm((prev) => ({
										...prev,
										threshold: Number(event.target.value),
									}))
								}
								required
							/>
						</div>
						<div className="form-group form-group-full">
							<label className="form-label">Mô tả</label>
							<textarea
								className="form-textarea"
								value={createForm.description}
								onChange={(event) =>
									setCreateForm((prev) => ({ ...prev, description: event.target.value }))
								}
								placeholder="Ghi chú nội bộ cho đội vận hành (tuỳ chọn)"
							/>
						</div>
						<div className="form-group form-group-full">
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
								<label className="form-label">Chọn người dùng làm chủ sở hữu</label>
								<button
									type="button"
									className="btn btn-sm"
									onClick={() => {
										setUseManualInput(!useManualInput)
										setSelectedUserIds([])
										setCreateForm(prev => ({ ...prev, ownerUserIdsText: '' }))
									}}
									style={{
										fontSize: 12,
										padding: '4px 8px',
										border: '1px solid var(--border)',
										background: 'var(--background)',
										color: 'var(--foreground)',
										borderRadius: 4,
										cursor: 'pointer'
									}}
								>
									{useManualInput ? 'Chọn từ danh sách' : 'Nhập thủ công'}
								</button>
							</div>

							{useManualInput ? (
								<textarea
									className="form-textarea"
									style={{ fontFamily: 'var(--font-mono)' }}
									value={createForm.ownerUserIdsText}
									onChange={(event) =>
										setCreateForm((prev) => ({ ...prev, ownerUserIdsText: event.target.value }))
									}
									placeholder={'1\n2\n3'}
									required
								/>
							) : (
								<>
									{availableUsersLoading ? (
										<div style={{ padding: '12px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
											Đang tải danh sách người dùng...
										</div>
									) : availableUsersForSelection.length === 0 ? (
										<div style={{ padding: '12px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
											{availableUsers.length === 0 ? (
												<>
											Không thể tải danh sách người dùng từ identity-service.{' '}
											<button
												type="button"
												className="btn-link"
												onClick={() => setUseManualInput(true)}
												style={{
													fontSize: 12,
													color: 'var(--primary)',
													textDecoration: 'underline',
													background: 'none',
													border: 'none',
													cursor: 'pointer',
													padding: 0
												}}
											>
												Nhập thủ công ID
											</button>
												</>
											) : (
												<>
													Tất cả người dùng đã được sử dụng trong các ví đang theo dõi.{' '}
													<button
														type="button"
														className="btn-link"
														onClick={() => setUseManualInput(true)}
														style={{
															fontSize: 12,
															color: 'var(--primary)',
															textDecoration: 'underline',
															background: 'none',
															border: 'none',
															cursor: 'pointer',
															padding: 0
														}}
													>
														Nhập thủ công ID
													</button>
												</>
											)}
										</div>
									) : (
										<div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 6, padding: '8px' }}>
											{availableUsersForSelection.map((user) => (
												<label
													key={user.id}
													style={{
														display: 'flex',
														alignItems: 'center',
														padding: '6px 8px',
														marginBottom: 4,
														borderRadius: 4,
														cursor: 'pointer',
														background: selectedUserIds.includes(user.id) ? 'var(--accent)' : 'transparent',
														transition: 'background 0.2s',
													}}
												>
													<input
														type="checkbox"
														checked={selectedUserIds.includes(user.id)}
														onChange={(e) => {
															if (e.target.checked) {
																setSelectedUserIds(prev => [...prev, user.id])
															} else {
																setSelectedUserIds(prev => prev.filter(id => id !== user.id))
															}
														}}
														style={{ marginRight: 8 }}
													/>
													<div>
														<strong>
															{user.firstName && user.lastName 
																? `${user.firstName} ${user.lastName}`.trim()
																: user.firstName || user.lastName || user.username || `User ${user.id}`
															}
														</strong>
														<span style={{ fontSize: 12, color: 'var(--muted-foreground)', marginLeft: 8 }}>
															ID: {user.id}
														</span>
													</div>
												</label>
											))}
										</div>
									)}
								</>
							)}

							<div className="form-hint">
								Chọn người dùng sẽ làm chủ sở hữu ví. Service Account sẽ được tự động thêm.
								{!useManualInput && selectedUserIds.length > 0 && (
									<span style={{ marginLeft: 8, fontWeight: 500 }}>
										Đã chọn: {selectedUserIds.length} người dùng
									</span>
								)}
							</div>
						</div>
						<div className="form-group form-group-full" style={{ marginTop: 8 }}>
							<button
								type="submit"
								className="btn btn-primary"
								disabled={createLoading}
								style={{ width: '100%', justifyContent: 'center' }}
							>
								{createLoading ? 'Đang tạo...' : 'Tạo ví mới'}
							</button>
						</div>
					</form>
				</div>

				<div className="multisig-card">
					<h2>
						<Link2 size={18} />
						Liên kết ví hiện có
					</h2>
					<form className="form-grid" onSubmit={handleLinkWallet}>
						<div className="form-group">
							<label className="form-label">Tên hiển thị</label>
							<input
								className="form-input"
								type="text"
								value={linkForm.name}
								onChange={(event) =>
									setLinkForm((prev) => ({ ...prev, name: event.target.value }))
								}
								placeholder="Ví cộng đồng"
								required
							/>
						</div>
						<div className="form-group">
							<label className="form-label">Địa chỉ contract</label>
							<input
								className="form-input"
								type="text"
								value={linkForm.contractAddress}
								onChange={(event) =>
									setLinkForm((prev) => ({ ...prev, contractAddress: event.target.value }))
								}
								placeholder="0x1234..."
								required
							/>
						</div>
						<div className="form-group form-group-full">
							<label className="form-label">Mô tả</label>
							<textarea
								className="form-textarea"
								value={linkForm.description}
								onChange={(event) =>
									setLinkForm((prev) => ({ ...prev, description: event.target.value }))
								}
								placeholder="Thông tin quản trị, ghi chú backup key..."
							/>
						</div>
						<div className="form-group form-group-full">
							<label className="form-label">Danh sách ID người dùng (tuỳ chọn)</label>
							<textarea
								className="form-textarea"
								style={{ fontFamily: 'var(--font-mono)' }}
								value={linkForm.ownerUserIdsText}
								onChange={(event) =>
									setLinkForm((prev) => ({ ...prev, ownerUserIdsText: event.target.value }))
								}
								placeholder={'1,2,3'}
							/>
							<div className="form-hint">
								Nếu muốn gán private key cho người dùng, nhập ID người dùng (ngăn cách bởi dấu phẩy).
							</div>
						</div>
						<div className="form-group form-group-full" style={{ marginTop: 8 }}>
							<button
								type="submit"
								className="btn btn-primary"
								disabled={linkLoading}
								style={{ width: '100%', justifyContent: 'center' }}
							>
								{linkLoading ? 'Đang liên kết...' : 'Liên kết ví'}
							</button>
						</div>
					</form>
				</div>

				<div className="multisig-card">
					<h2>
						<Wallet size={18} />
						Quản lý ví đang theo dõi
					</h2>
					<form onSubmit={handleLoadWallet}>
						<div className="form-group">
							<label className="form-label">ID ví (UUID)</label>
							<input
								className="form-input"
								type="text"
								value={walletIdInput}
								onChange={(event) => setWalletIdInput(event.target.value)}
								placeholder="Nhập ID ví để tải dữ liệu"
							/>
							<div className="form-hint">
								Sao chép ID từ hệ thống backend hoặc chọn ví sẵn có ở bên dưới.
							</div>
						</div>
						<button
							type="submit"
							className="btn btn-secondary"
							style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
							disabled={loadingWallet}
						>
							{loadingWallet ? 'Đang tải...' : 'Tải ví theo ID'}
						</button>
					</form>

					<div className="multisig-tracked">
						<div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
							<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<ListChecks size={16} />
								<strong>Ví được theo dõi gần đây</strong>
							</div>
							{allWalletsLoading && (
								<div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--muted-foreground)' }}>
									<RefreshCw size={12} className="spinning" />
									Đang tải...
								</div>
							)}
						</div>
						{trackedWallets.length === 0 ? (
							<div className="multisig-empty">Chưa có ví nào được lưu để theo dõi.</div>
						) : (
							<div className="multisig-tracked-list">
							 {trackedWallets.map((item) => (
									<button
										type="button"
										key={item.id}
										className={`multisig-tracked-item ${
											item.id === activeWalletId ? 'active' : ''
										}`}
										onClick={() => handleSelectTrackedWallet(item.id)}
									>
										<strong>{item.name || 'Chưa đặt tên'}</strong>
										<span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
											ID: {item.id}
										</span>
										<span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
											User IDs: {item.ownerUserIds?.join(', ') || 'N/A'}
										</span>
										<span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
											Chủ sở hữu: {item.owners?.length ?? 0} • Threshold: {item.threshold}
										</span>
									</button>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{wallet ? (
				<>
					<div className="multisig-grid">
						<div className="multisig-card">
							<h2>
								<Users size={18} />
								Tổng quan ví
							</h2>
							<div className="multisig-summary-grid">
								<div className="multisig-summary-card">
									<div className="multisig-summary-label">Chủ sở hữu</div>
									<div className="multisig-summary-value">{wallet.owners?.length ?? 0}</div>
									<div className="multisig-summary-extra">Địa chỉ yêu cầu ký duyệt</div>
								</div>
								<div className="multisig-summary-card">
									<div className="multisig-summary-label">Threshold</div>
									<div className="multisig-summary-value">{wallet.threshold}</div>
									<div className="multisig-summary-extra">Số chữ ký tối thiểu</div>
								</div>
								<div className="multisig-summary-card">
									<div className="multisig-summary-label">Đang chờ</div>
									<div className="multisig-summary-value">{pendingTransactions.length}</div>
									<div className="multisig-summary-extra">
										{readyToExecuteCount} giao dịch đủ chữ ký
									</div>
								</div>
								<div className="multisig-summary-card">
									<div className="multisig-summary-label">Tổng giá trị</div>
									<div className="multisig-summary-value">{totalWalletValue} ETH</div>
									<div className="multisig-summary-extra">
										Tính theo tổng giá trị giao dịch đã ghi nhận
									</div>
								</div>
							</div>
						</div>

						<div className="multisig-card multisig-owners">
							<h2>
								<ShieldCheck size={18} />
								Danh sách owners
							</h2>
							<div className="multisig-owner-list">
								{wallet.owners?.map((owner) => (
									<span key={owner} className="multisig-owner">
										{owner}
									</span>
								))}
							</div>
							{wallet.ownerDetails && wallet.ownerDetails.length > 0 && (
								<div style={{ marginTop: 16 }}>
									<h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: 'var(--foreground)' }}>
										Chi tiết chủ sở hữu (từ backend)
									</h4>
									{wallet.ownerDetails.map((detail, idx) => (
										<div
											key={idx}
											style={{
												background: 'var(--muted)',
												padding: '8px 12px',
												borderRadius: 6,
												marginBottom: 8,
												fontFamily: 'var(--font-mono)',
												fontSize: 12,
											}}
										>
											<div>ID: {detail.userId}</div>
											<div>
												Tên: {detail.identity?.firstName && detail.identity?.lastName
													? `${detail.identity.firstName} ${detail.identity.lastName}`.trim()
													: detail.identity?.firstName || detail.identity?.lastName || detail.identity?.username || '(chưa có tên)'
												}
											</div>
											<div>Address: {detail.address}</div>
											{detail.privateKeyMasked && (
												<div>Private Key: {detail.privateKeyMasked}</div>
											)}
										</div>
									))}
								</div>
							)}
							{wallet.onChainWarning && (
								<div className="multisig-owner-warning">
									<strong>Cảnh báo:</strong> {wallet.onChainWarning}
								</div>
							)}
							{wallet.onChainError && (
								<div className="multisig-owner-warning" style={{ background: '#fee2e2' }}>
									<strong>Lỗi đồng bộ on-chain:</strong> {wallet.onChainError}
								</div>
							)}
							<div style={{ marginTop: 16 }}>
								<button
									type="button"
									className="btn btn-secondary"
									onClick={handleGetOwnerCredential}
									disabled={credentialLoading || !activeWalletId}
									style={{ fontSize: 13 }}
								>
									{credentialLoading ? 'Đang lấy...' : 'Lấy credential của tôi'}
								</button>
								{ownerCredential && (
									<div
										style={{
											marginTop: 12,
											padding: '12px',
											background: '#f0f9ff',
											border: '1px solid #0ea5e9',
											borderRadius: 6,
											fontSize: 12,
											fontFamily: 'var(--font-mono)',
										}}
									>
										<div style={{ fontWeight: 600, marginBottom: 8 }}>Credential của bạn:</div>
										<div>ID: {ownerCredential.userId}</div>
										<div>Address: {ownerCredential.address}</div>
										<div>Private Key: {ownerCredential.privateKey}</div>
										{(ownerCredential.identity?.firstName || ownerCredential.identity?.lastName || ownerCredential.identity?.username) && (
											<div>
												Tên: {ownerCredential.identity?.firstName && ownerCredential.identity?.lastName
													? `${ownerCredential.identity.firstName} ${ownerCredential.identity.lastName}`.trim()
													: ownerCredential.identity?.firstName || ownerCredential.identity?.lastName || ownerCredential.identity?.username
												}
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						<div className="multisig-card">
							<h2>
								<Send size={18} />
								Đề xuất giao dịch mới
							</h2>
							<form className="form-grid" onSubmit={handleSubmitTransaction}>
								<div className="form-group">
									<label className="form-label">Địa chỉ nhận</label>
									<input
										className="form-input"
										type="text"
										value={transactionForm.destination}
										onChange={(event) =>
											setTransactionForm((prev) => ({
												...prev,
												destination: event.target.value,
											}))
										}
										placeholder="0xNgườiNhận..."
										required
									/>
								</div>
								<div className="form-group">
									<label className="form-label">Số lượng (ETH)</label>
									<input
										className="form-input"
										type="number"
										min="0"
										step="any"
										value={transactionForm.value}
										onChange={(event) =>
											setTransactionForm((prev) => ({
												...prev,
												value: event.target.value,
											}))
										}
										placeholder="0.5"
										required
									/>
								</div>
								<div className="form-group form-group-full">
									<label className="form-label">Mô tả / ghi chú (tuỳ chọn)</label>
									<input
										className="form-input"
										type="text"
										value={transactionForm.description}
										onChange={(event) =>
											setTransactionForm((prev) => ({
												...prev,
												description: event.target.value,
											}))
										}
										placeholder="Chi trả nhà cung cấp, hoàn phí..."
									/>
								</div>
								<div className="form-group form-group-full">
									<label className="form-label">Dữ liệu bổ sung (hex)</label>
									<textarea
										className="form-textarea"
										style={{ fontFamily: 'var(--font-mono)', minHeight: 100 }}
										value={transactionForm.data}
										onChange={(event) =>
											setTransactionForm((prev) => ({
												...prev,
												data: event.target.value,
											}))
										}
										placeholder="0x"
									/>
								</div>
								<div className="form-group form-group-full" style={{ display: 'flex', gap: 8 }}>
									<button
										type="submit"
										className="btn btn-primary"
										disabled={submitLoading}
										style={{ flex: 1, justifyContent: 'center' }}
									>
										{submitLoading ? 'Đang tạo...' : 'Đề xuất giao dịch'}
									</button>
									<button
										type="button"
										className="btn btn-secondary"
										onClick={() =>
											setTransactionForm({
												destination: '',
												value: '',
												data: '',
												description: '',
											})
										}
									>
										Xoá biểu mẫu
									</button>
								</div>
							</form>
						</div>
					</div>

					<div className="multisig-card">
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
							<h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
								<Wallet size={18} />
								Giao dịch chờ xử lý ({pendingTransactions.length})
							</h2>
							<button
								type="button"
								className="btn btn-secondary btn-sm"
								onClick={() => {
									if (activeWalletId) {
										fetchTransactions(activeWalletId)
									}
								}}
								disabled={transactionsLoading || !activeWalletId}
							>
								<RefreshCw size={16} />
								Làm mới
							</button>
						</div>
						{transactionsLoading ? (
							<div className="multisig-empty">Đang tải danh sách giao dịch...</div>
						) : pendingTransactions.length === 0 ? (
							<div className="multisig-empty">Không có giao dịch nào đang chờ.</div>
						) : (
							<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
								{pendingTransactions.map((tx) => (
									<div
										key={tx.id}
										style={{
											border: '1px solid var(--border)',
											borderRadius: 12,
											padding: 16,
											background: 'var(--background)',
										}}
									>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
											<div>
												<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
													<strong>#{tx.txIndexOnChain}</strong>
													<span
														className={`badge ${
															tx.status === 'confirmed'
																? 'badge-info'
																: 'badge-secondary'
														}`}
													>
														{tx.status === 'confirmed' ? 'Đủ chữ ký' : tx.status}
													</span>
													{(tx.confirmations?.length || 0) >= wallet.threshold && (
														<span className="badge badge-success">Sẵn sàng thực thi</span>
													)}
												</div>
												<div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
													ID: {tx.id}
												</div>
												{tx.txHash && (
													<div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
														TX Hash: {tx.txHash}
													</div>
												)}
											</div>
										</div>
										<div
											style={{
												display: 'grid',
												gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
												gap: 12,
												marginBottom: 12,
											}}
										>
											<div>
												<div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>Gửi tới</div>
												<div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{tx.destination}</div>
											</div>
											<div>
												<div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>Giá trị</div>
												<div>{formatWeiToEth(tx.value || '0')} ETH</div>
											</div>
											<div>
												<div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 4 }}>Lượt xác nhận</div>
												<div>
													<span className="badge badge-secondary">
														{tx.confirmations?.length || 0}/{wallet.threshold}
													</span>
												</div>
											</div>
										</div>
										{tx.confirmations && tx.confirmations.length > 0 && (
											<div style={{ marginBottom: 12, padding: 12, background: 'var(--muted)', borderRadius: 8 }}>
												<div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 8 }}>
													Đã xác nhận bởi ({tx.confirmations.length}):
												</div>
												<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
													{tx.confirmations.map((addr, idx) => (
														<span
															key={idx}
															style={{
																fontFamily: 'var(--font-mono)',
																fontSize: 12,
																padding: '4px 8px',
																background: 'var(--background)',
																borderRadius: 4,
															}}
														>
															{addr}
														</span>
													))}
												</div>
											</div>
										)}
										{tx.data && tx.data !== '0x' && (
											<div style={{ marginBottom: 12 }}>
												<div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 6 }}>Dữ liệu bổ sung</div>
												<pre className="multisig-data" style={{ fontSize: 12, padding: 8 }}>{tx.data}</pre>
											</div>
										)}
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												gap: 12,
												padding: 16,
												background: 'var(--muted)',
												borderRadius: 8,
											}}
										>
											<div style={{ flex: '1 1 200px' }}>
												<label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: 'var(--muted-foreground)' }}>
													Private key để xác nhận (tuỳ chọn)
												</label>
												<input
													type="password"
													className="form-input"
													value={confirmKeys[tx.id] || ''}
													onChange={(event) =>
														setConfirmKeys((prev) => ({
															...prev,
															[tx.id]: event.target.value,
														}))
													}
													placeholder="Nếu bỏ trống sẽ dùng Service Account"
													style={{ width: '100%' }}
												/>
											</div>
											<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
												<button
													type="button"
													className="btn btn-primary btn-sm"
													onClick={() => handleConfirmTransaction(tx.id)}
													disabled={confirmLoading[tx.id] || tx.status === 'executed'}
												>
													<CheckCircle2 size={16} />
													{confirmLoading[tx.id] ? 'Đang xác nhận...' : 'Xác nhận'}
												</button>
												<button
													type="button"
													className="btn btn-secondary btn-sm"
													onClick={() => handleExecuteTransaction(tx.id)}
													disabled={
														executeLoading[tx.id] ||
														(tx.confirmations?.length || 0) < wallet.threshold ||
														tx.status === 'executed'
													}
												>
													<Play size={16} />
													{executeLoading[tx.id] ? 'Đang thực thi...' : 'Thực thi giao dịch'}
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="multisig-card">
						<div className="multisig-filters">
							<div>
								<h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
									<ClipboardList size={18} />
									Danh sách giao dịch ({filteredTransactions.length})
								</h2>
								<p style={{ margin: '4px 0 0', color: 'var(--muted-foreground)', fontSize: 13 }}>
									Theo dõi trạng thái xác nhận và thực thi đối với từng giao dịch multisig
								</p>
							</div>
							<div className="filter-controls">
								<div className="search-bar" style={{ maxWidth: 280 }}>
									<input
										type="search"
										placeholder="Tìm theo ID, TX hash, địa chỉ..."
										value={transactionFilters.search}
										onChange={(event) =>
											setTransactionFilters((prev) => ({
												...prev,
												search: event.target.value,
											}))
										}
									/>
									<Search className="search-bar-icon" size={16} />
								</div>
								<select
									className="form-select"
									value={transactionFilters.status}
									onChange={(event) =>
										setTransactionFilters((prev) => ({
											...prev,
											status: event.target.value as TransactionFilters['status'],
										}))
									}
								>
									<option value="all">Tất cả trạng thái</option>
									<option value="submitted">Đã gửi</option>
									<option value="confirmed">Đủ chữ ký</option>
									<option value="executed">Đã thực thi</option>
									<option value="failed">Thất bại</option>
								</select>
							</div>
						</div>

						{transactionsLoading ? (
							<div className="multisig-empty">Đang tải giao dịch...</div>
						) : filteredTransactions.length === 0 ? (
							<div className="multisig-empty">
								Không có giao dịch nào khớp bộ lọc hiện tại. Thử thay đổi bộ lọc hoặc tạo giao dịch
								mới.
							</div>
						) : (
							<table className="admin-table">
								<thead>
									<tr>
										<th>#</th>
										<th>Địa chỉ nhận</th>
										<th>Giá trị (ETH)</th>
										<th>Xác nhận</th>
										<th>Trạng thái</th>
										<th>Hành động</th>
									</tr>
								</thead>
								<tbody>
									{filteredTransactions.map((tx) => (
										<Fragment key={tx.id}>
											<tr>
												<td>#{tx.txIndexOnChain}</td>
												<td style={{ fontFamily: 'var(--font-mono)' }}>{tx.destination}</td>
												<td>{formatWeiToEth(tx.value || '0')}</td>
												<td>
													<span className="badge badge-secondary">
														{tx.confirmations?.length || 0}/{wallet.threshold}
													</span>
												</td>
												<td>
													<span
														className={`badge ${
															tx.status === 'executed'
																? 'badge-success'
																: tx.status === 'failed'
																? 'badge-danger'
																: tx.status === 'confirmed'
																? 'badge-info'
																: 'badge-secondary'
														}`}
													>
														{tx.status}
													</span>
												</td>
												<td>
													<div className="multisig-transaction-actions">
														<div className="multisig-transaction-key" style={{ flex: '1 1 200px' }}>
															<label>Private key (tuỳ chọn)</label>
															<input
																type="password"
																className="form-input"
																value={confirmKeys[tx.id] || ''}
																onChange={(event) =>
																	setConfirmKeys((prev) => ({
																		...prev,
																		[tx.id]: event.target.value,
																	}))
																}
																placeholder="Nếu bỏ trống sẽ dùng Service Account"
															/>
														</div>
														<button
															type="button"
															className="btn btn-primary btn-sm"
															onClick={() => handleConfirmTransaction(tx.id)}
															disabled={confirmLoading[tx.id]}
														>
															<CheckCircle2 size={16} />
															{confirmLoading[tx.id] ? 'Đang xác nhận' : 'Xác nhận'}
														</button>
														<button
															type="button"
															className="btn btn-secondary btn-sm"
															onClick={() => handleExecuteTransaction(tx.id)}
															disabled={
																executeLoading[tx.id] ||
																(tx.confirmations?.length || 0) < wallet.threshold ||
																tx.status === 'executed'
															}
														>
															<Play size={16} />
															{executeLoading[tx.id] ? 'Đang thực thi' : 'Thực thi'}
														</button>
													</div>
												</td>
											</tr>
											{(tx.txHash || (tx.data && tx.data !== '0x')) && (
												<tr>
													<td colSpan={6}>
														<div
															style={{
																display: 'grid',
																gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
																gap: 12,
																alignItems: 'flex-start',
															}}
														>
															<div>
																<div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
																	ID giao dịch
																</div>
																<div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
																	{tx.id}
																</div>
															</div>
															<div>
																<div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
																	TX hash on-chain
																</div>
																<div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
																	{tx.txHash || '—'}
																</div>
															</div>
															<div>
																<div style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
																	Cập nhật gần nhất
																</div>
																<div style={{ fontSize: 13 }}>
																	{tx.updatedAt
																		? new Date(tx.updatedAt).toLocaleString()
																		: '—'}
																</div>
															</div>
														</div>
														{tx.data && tx.data !== '0x' && (
															<div style={{ marginTop: 12 }}>
																<div
																	style={{
																		fontSize: 12,
																		color: 'var(--muted-foreground)',
																		marginBottom: 6,
																	}}
																>
																	Dữ liệu bổ sung
																</div>
																<pre className="multisig-data">{tx.data}</pre>
															</div>
														)}
													</td>
												</tr>
											)}
										</Fragment>
									))}
								</tbody>
							</table>
						)}
					</div>

					<div className="multisig-card">
						<h2 style={{ marginBottom: 16 }}>
							<CheckCircle2 size={18} style={{ marginRight: 8 }} />
							Giao dịch đã hoàn tất ({executedTransactions.length})
						</h2>
						{executedTransactions.length === 0 ? (
							<div className="multisig-empty">Chưa có giao dịch nào được thực thi.</div>
						) : (
							<table className="admin-table">
								<thead>
									<tr>
										<th>#</th>
										<th>ID</th>
										<th>TX Hash</th>
										<th>Giá trị (ETH)</th>
										<th>Thời gian cập nhật</th>
									</tr>
								</thead>
								<tbody>
									{executedTransactions.map((tx) => (
										<tr key={tx.id}>
											<td>#{tx.txIndexOnChain}</td>
											<td style={{ fontFamily: 'var(--font-mono)' }}>{tx.id}</td>
											<td style={{ fontFamily: 'var(--font-mono)' }}>{tx.txHash || '—'}</td>
											<td>{formatWeiToEth(tx.value || '0')}</td>
											<td>{tx.updatedAt ? new Date(tx.updatedAt).toLocaleString() : '—'}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</>
			) : (
				<div className="multisig-card">
					<h2 style={{ marginBottom: 16 }}>
						<Wallet size={18} style={{ marginRight: 8 }} />
						Chưa có ví nào được chọn
					</h2>
					<p style={{ color: 'var(--muted-foreground)', marginBottom: 16 }}>
						Sử dụng một trong các biểu mẫu phía trên để tạo, liên kết hoặc tải ví multisig hiện có.
						Giao diện quản lý chi tiết sẽ xuất hiện ngay khi bạn chọn được một ví hợp lệ.
					</p>
				</div>
			)}
		</div>
	)
}

export default MultisigPage

