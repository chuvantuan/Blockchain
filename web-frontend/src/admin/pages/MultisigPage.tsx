import React, { FormEvent, Fragment, useCallback, useMemo, useState } from 'react'
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
	UserRound,
	Users,
	Wallet,
} from 'lucide-react'
import multisigApi, {
	ConfirmTransactionRequest,
	CreateWalletRequest,
	IdentityUser,
	LinkWalletRequest,
	MultisigTransaction,
	MultisigWallet,
	SubmitTransactionRequest,
} from '../../services/api/multisigApi'
import { parseOwnerIds, formatWeiToEth } from '../../utils/multisig'
import '../styles/common.css'
import '../styles/form.css'
import '../styles/table.css'
import '../styles/multisig.css'
import { useOwnerPreview } from '../../hooks/useOwnerPreview'

type AlertState = {
	type: 'success' | 'error' | 'info'
	message: string
	details?: string
} | null

type TransactionFilters = {
	status: 'all' | 'submitted' | 'confirmed' | 'executed' | 'failed'
	search: string
}

type TrackedWallet = MultisigWallet & { lastLoadedAt?: string }

const MultisigPage = (): JSX.Element => {
	const [alertState, setAlertState] = useState<AlertState>(null)
	const [createLoading, setCreateLoading] = useState(false)
	const [linkLoading, setLinkLoading] = useState(false)
	const [loadingWallet, setLoadingWallet] = useState(false)
	const [transactionsLoading, setTransactionsLoading] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState<Record<string, boolean>>({})
	const [executeLoading, setExecuteLoading] = useState<Record<string, boolean>>({})

	const [walletIdInput, setWalletIdInput] = useState('')
	const [activeWalletId, setActiveWalletId] = useState<string | null>(null)
	const [wallet, setWallet] = useState<MultisigWallet | null>(null)
	const [trackedWallets, setTrackedWallets] = useState<TrackedWallet[]>([])
	const [transactions, setTransactions] = useState<MultisigTransaction[]>([])
	const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)
	const [creatorInfo, setCreatorInfo] = useState<IdentityUser | null>(null)
	const [creatorLoading, setCreatorLoading] = useState(false)
	const [creatorError, setCreatorError] = useState<string | null>(null)

	const [createForm, setCreateForm] = useState({
		name: '',
		description: '',
		ownersText: '',
		threshold: 1,
	})

	const [linkForm, setLinkForm] = useState({
		name: '',
		description: '',
		contractAddress: '',
		ownerIdsText: '',
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

	const { entries: createOwnerPreview, loading: createOwnerPreviewLoading } = useOwnerPreview(createForm.ownersText)
	const { entries: linkOwnerPreview, loading: linkOwnerPreviewLoading } = useOwnerPreview(linkForm.ownerIdsText)

	const createOwnerPreviewHasError = useMemo(
		() => createOwnerPreview.some((entry) => entry.status === 'error'),
		[createOwnerPreview],
	)
	const linkOwnerPreviewHasError = useMemo(
		() => linkOwnerPreview.some((entry) => entry.status === 'error'),
		[linkOwnerPreview],
	)

	const showAlert = useCallback((alert: AlertState) => {
		setAlertState(alert)
		if (alert) {
			setTimeout(() => {
				setAlertState(null)
			}, 5000)
		}
	}, [])

	const loadCreator = useCallback(
		async (creatorId?: string | null) => {
			if (!creatorId) {
				setCreatorInfo(null)
				setCreatorError(null)
				return
			}
			setCreatorLoading(true)
			setCreatorError(null)
			try {
				const user = await multisigApi.getIdentityUserById(creatorId)
				setCreatorInfo(user)
			} catch (error: any) {
				setCreatorInfo(null)
				setCreatorError(error.message)
			} finally {
				setCreatorLoading(false)
			}
		},
		[],
	)

	const upsertTrackedWallet = useCallback((next: MultisigWallet, loadedAt?: string) => {
		setTrackedWallets((prev) => {
			const exists = prev.find((item) => item.id === next.id)
			if (exists) {
				return prev.map((item) =>
					item.id === next.id
						? {
								...next,
								lastLoadedAt: loadedAt ?? item.lastLoadedAt,
						  }
						: item,
				)
			}
			return [{ ...next, lastLoadedAt: loadedAt }, ...prev]
		})
	}, [])

	const fetchWallet = useCallback(
		async (walletId: string, options?: { suppressAlert?: boolean; track?: boolean }) => {
			if (!walletId) return
			setLoadingWallet(true)
			try {
				const data = await multisigApi.getWalletById(walletId)
				setWallet(data)
				setActiveWalletId(walletId)
				await loadCreator(data.creatorId)
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
				setCreatorInfo(null)
				setCreatorError(null)
				setCreatorLoading(false)
				showAlert({
					type: 'error',
					message: 'Không thể tải ví multisig',
					details: error.message,
				})
			} finally {
				setLoadingWallet(false)
			}
		},
		[showAlert, upsertTrackedWallet, loadCreator],
	)

	const fetchTransactions = useCallback(
		async (walletId: string) => {
			if (!walletId) return
			setTransactionsLoading(true)
			try {
				const data = await multisigApi.getTransactionsByWallet(walletId)
				const sorted = [...data].sort((a, b) => {
					const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
					const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
					return bTime - aTime
				})
				setTransactions(sorted)
				setLastSyncedAt(new Date().toISOString())
			} catch (error: any) {
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
		const ownerIds = parseOwnerIds(createForm.ownersText)
		if (ownerIds.length === 0) {
			showAlert({
				type: 'error',
				message: 'Vui lòng nhập ít nhất 1 ID sinh viên làm owner',
			})
			return
		}

		const payload: CreateWalletRequest = {
			name: createForm.name.trim(),
			description: createForm.description.trim() || undefined,
			ownerUserIds: ownerIds,
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

		if (payload.threshold > payload.ownerUserIds.length + 1) {
			showAlert({
				type: 'error',
				message: 'Threshold không được lớn hơn số lượng owner (bao gồm service account)',
			})
			return
		}

		setCreateLoading(true)
		try {
			const newWallet = await multisigApi.createWallet(payload)
			setCreateForm({
				name: '',
				description: '',
				ownersText: '',
				threshold: 1,
			})
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
		const payload: LinkWalletRequest = {
			name: linkForm.name.trim(),
			description: linkForm.description.trim() || undefined,
			contractAddress: linkForm.contractAddress.trim(),
		}

		const ownerIds = parseOwnerIds(linkForm.ownerIdsText)
		if (ownerIds.length > 0) {
			payload.ownerUserIds = ownerIds
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
				ownerIdsText: '',
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
			setTransactions((prev) => [transaction, ...prev])
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
		const payload: ConfirmTransactionRequest = {}
		const candidateKey = confirmKeys[transactionId]?.trim()
		if (candidateKey) {
			payload.privateKey = candidateKey
		}
		setConfirmLoading((prev) => ({ ...prev, [transactionId]: true }))
		try {
			const updated = await multisigApi.confirmTransaction(transactionId, payload)
			setTransactions((prev) =>
				prev.map((tx) => (tx.id === updated.id ? { ...tx, ...updated } : tx)),
			)
			showAlert({
				type: 'success',
				message: 'Đã xác nhận giao dịch',
			})
		} catch (error: any) {
			showAlert({
				type: 'error',
				message: 'Không thể xác nhận giao dịch',
				details: error.message,
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
		const searchText = transactionFilters.search.trim().toLowerCase()
		return transactions.filter((tx) => {
			if (transactionFilters.status !== 'all' && tx.status !== transactionFilters.status) {
				return false
			}
			if (searchText) {
				const target = `${tx.id} ${tx.destination} ${tx.txHash ?? ''} ${tx.txIndexOnChain}`.toLowerCase()
				if (!target.includes(searchText)) {
					return false
				}
			}
			return true
		})
	}, [transactions, transactionFilters])

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

	const latestLoadedWallet = trackedWallets.find((item) => item.id === activeWalletId) || null

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
							<label className="form-label">Danh sách ID sinh viên (mỗi dòng hoặc dấu phẩy)</label>
							<textarea
								className="form-textarea"
								style={{ fontFamily: 'var(--font-mono)' }}
								value={createForm.ownersText}
								onChange={(event) =>
									setCreateForm((prev) => ({ ...prev, ownersText: event.target.value }))
								}
								placeholder={'101\n102\n103'}
								required
							/>
							<div className="owner-helper">
								<p className="owner-helper-text">
									Hệ thống sẽ tự gán private key Ganache chưa sử dụng cho mỗi sinh viên và tự động thêm
									Service Account. Threshold không nên vượt quá tổng số sinh viên + 1.
								</p>
								{createOwnerPreviewLoading && (
									<div className="owner-preview-loading">Đang kiểm tra danh sách sinh viên...</div>
								)}
								{createOwnerPreview.length > 0 && (
									<ul className="owner-preview-list">
										{createOwnerPreview.map((entry) => (
											<li
												key={entry.userId}
												className={`owner-preview-item ${
													entry.status === 'error'
														? 'owner-preview-item-error'
														: entry.status === 'success'
														? 'owner-preview-item-success'
														: ''
												}`}
											>
												<span className="owner-preview-id">ID #{entry.userId}</span>
												{entry.status === 'loading' && (
													<span className="owner-preview-status">Đang tra cứu...</span>
												)}
												{entry.status === 'error' && (
													<span className="owner-preview-status">{entry.error}</span>
												)}
												{entry.status === 'success' && entry.user && (
													<span className="owner-preview-status">
														{entry.user.firstName || entry.user.lastName
															? `${entry.user.firstName ?? ''} ${entry.user.lastName ?? ''}`.trim()
															: entry.user.username}
														{entry.user.email ? ` • ${entry.user.email}` : ''}
													</span>
												)}
											</li>
										))}
									</ul>
								)}
								{createOwnerPreview.length === 0 && !createOwnerPreviewLoading && (
									<div className="owner-preview-empty">Nhập ID để xem trước thông tin sinh viên.</div>
								)}
								{createOwnerPreviewHasError && !createOwnerPreviewLoading && (
									<div className="owner-preview-warning">
										Một số ID không hợp lệ hoặc không tìm thấy. Vui lòng kiểm tra trước khi tạo ví.
									</div>
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
							<label className="form-label">Gán thêm ID sinh viên (tùy chọn)</label>
							<textarea
								className="form-textarea"
								style={{ fontFamily: 'var(--font-mono)' }}
								value={linkForm.ownerIdsText}
								onChange={(event) =>
									setLinkForm((prev) => ({ ...prev, ownerIdsText: event.target.value }))
								}
								placeholder={'201\n202'}
							/>
							<div className="owner-helper">
								<p className="owner-helper-text">
									Nếu ví on-chain chưa có mapping sinh viên, nhập ID tại đây để gán private key tự động.
								</p>
								{linkOwnerPreviewLoading && (
									<div className="owner-preview-loading">Đang kiểm tra danh sách sinh viên...</div>
								)}
								{linkOwnerPreview.length > 0 && (
									<ul className="owner-preview-list">
										{linkOwnerPreview.map((entry) => (
											<li
												key={entry.userId}
												className={`owner-preview-item ${
													entry.status === 'error'
														? 'owner-preview-item-error'
														: entry.status === 'success'
														? 'owner-preview-item-success'
														: ''
												}`}
											>
												<span className="owner-preview-id">ID #{entry.userId}</span>
												{entry.status === 'loading' && (
													<span className="owner-preview-status">Đang tra cứu...</span>
												)}
												{entry.status === 'error' && (
													<span className="owner-preview-status">{entry.error}</span>
												)}
												{entry.status === 'success' && entry.user && (
													<span className="owner-preview-status">
														{entry.user.firstName || entry.user.lastName
															? `${entry.user.firstName ?? ''} ${entry.user.lastName ?? ''}`.trim()
															: entry.user.username}
														{entry.user.email ? ` • ${entry.user.email}` : ''}
													</span>
												)}
											</li>
										))}
									</ul>
								)}
								{linkOwnerPreview.length === 0 && !linkOwnerPreviewLoading && (
									<div className="owner-preview-empty">Bỏ trống nếu không cần gán thêm sinh viên.</div>
								)}
								{linkOwnerPreviewHasError && !linkOwnerPreviewLoading && (
									<div className="owner-preview-warning">
										Một số ID không hợp lệ hoặc không tìm thấy. Vui lòng kiểm tra trước khi lưu.
									</div>
								)}
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
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<ListChecks size={16} />
							<strong>Ví được theo dõi gần đây</strong>
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
											Chủ sở hữu: {item.ownerDetails?.length ?? item.owners?.length ?? 0} • Threshold:{' '}
											{item.threshold}
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
									<div className="multisig-summary-value">
										{wallet.ownerDetails?.length ?? wallet.owners?.length ?? 0}
									</div>
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
							{wallet.creatorId && (
								<div className="multisig-user-card">
									<div className="multisig-user-header">
										<div className="multisig-user-icon">
											<UserRound size={18} />
										</div>
										<div>
											<div className="multisig-user-label">Người tạo ví</div>
											{creatorLoading ? (
												<div className="multisig-user-loading">Đang tải thông tin người dùng...</div>
											) : creatorInfo ? (
												<>
													<div className="multisig-user-name">
														{creatorInfo.firstName || creatorInfo.lastName
															? `${creatorInfo.firstName ?? ''} ${creatorInfo.lastName ?? ''}`.trim()
															: creatorInfo.username}
													</div>
													<div className="multisig-user-meta">
														<span>Email: {creatorInfo.email || '—'}</span>
														{creatorInfo.roles && creatorInfo.roles.length > 0 && (
															<span>Roles: {creatorInfo.roles.join(', ')}</span>
														)}
													</div>
												</>
											) : (
												<div className="multisig-user-error">
													{creatorError || 'Không thể tải được thông tin người dùng.'}
												</div>
											)}
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="multisig-card multisig-owners">
							<h2>
								<ShieldCheck size={18} />
								Danh sách owners
							</h2>
							<div className="multisig-owner-list">
								{wallet.ownerDetails && wallet.ownerDetails.length > 0 ? (
									wallet.ownerDetails.map((owner) => (
										<div key={`${owner.userId}-${owner.address}`} className="multisig-owner-card">
											<div className="multisig-owner-card-header">
												<div className="multisig-owner-card-name">
													{owner.identity?.firstName || owner.identity?.lastName
														? `${owner.identity?.firstName ?? ''} ${
																owner.identity?.lastName ?? ''
														  }`.trim()
														: owner.identity?.username || `User #${owner.userId}`}
												</div>
												<span className="multisig-owner-card-id">ID #{owner.userId}</span>
											</div>
											<div className="multisig-owner-card-meta">Địa chỉ: {owner.address}</div>
											{owner.identity?.email && (
												<div className="multisig-owner-card-meta">Email: {owner.identity.email}</div>
											)}
											{owner.privateKeyMasked && (
												<div className="multisig-owner-card-key">
													Private key: {owner.privateKeyMasked}
												</div>
											)}
										</div>
									))
								) : wallet.owners && wallet.owners.length > 0 ? (
									wallet.owners.map((owner) => (
										<span key={owner} className="multisig-owner">
											{owner}
										</span>
									))
								) : (
									<div className="multisig-owner-empty">Chưa có owner nào được cấu hình.</div>
								)}
							</div>
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

