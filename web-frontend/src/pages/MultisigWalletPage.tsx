import { FormEvent, useCallback, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, FilePlus2, Link2, Play, RefreshCcw, Send, Shield, Wallet } from 'lucide-react'
import multisigApi, {
	ConfirmTransactionRequest,
	CreateWalletRequest,
	LinkWalletRequest,
	MultisigTransaction,
	MultisigWallet,
	SubmitTransactionRequest,
} from '../services/api/multisigApi'
import { parseOwners, formatWeiToEth } from '../utils/multisig'
import styles from '../assets/css/MultisigWalletPage.module.css'
import WalletSummary from '../components/multisig/WalletSummary'
import TransactionForm, { TransactionFormValues } from '../components/multisig/TransactionForm'

type AlertState = {
	type: 'success' | 'error' | 'info'
	message: string
	details?: string
} | null

const MultisigWalletPage = (): JSX.Element => {
	const [alertState, setAlertState] = useState<AlertState>(null)
	const [walletIdInput, setWalletIdInput] = useState('')
	const [activeWalletId, setActiveWalletId] = useState<string | null>(null)
	const [wallet, setWallet] = useState<MultisigWallet | null>(null)
	const [transactions, setTransactions] = useState<MultisigTransaction[]>([])
	const [loadingWallet, setLoadingWallet] = useState(false)
	const [loadingTransactions, setLoadingTransactions] = useState(false)
	const [createLoading, setCreateLoading] = useState(false)
	const [linkLoading, setLinkLoading] = useState(false)
	const [submitLoading, setSubmitLoading] = useState(false)
	const [confirmLoading, setConfirmLoading] = useState<Record<string, boolean>>({})
	const [executeLoading, setExecuteLoading] = useState<Record<string, boolean>>({})

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
	})

	const [transactionForm, setTransactionForm] = useState<TransactionFormValues>({
		destination: '',
		value: '',
		data: '',
	})

	const [confirmKeys, setConfirmKeys] = useState<Record<string, string>>({})

	const showAlert = useCallback((alert: AlertState) => {
		setAlertState(alert)
		if (alert) {
			setTimeout(() => {
				setAlertState(null)
			}, 5000)
		}
	}, [])

	const fetchWallet = useCallback(
		async (walletId: string, options?: { suppressAlert?: boolean }) => {
			if (!walletId) return
			setLoadingWallet(true)
			try {
				const data = await multisigApi.getWalletById(walletId)
				setWallet(data)
				setActiveWalletId(walletId)
				if (!options?.suppressAlert) {
					showAlert({
						type: 'success',
						message: 'Đã tải thông tin ví',
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
		[showAlert],
	)

	const fetchTransactions = useCallback(
		async (walletId: string) => {
			if (!walletId) return
			setLoadingTransactions(true)
			try {
				const data = await multisigApi.getTransactionsByWallet(walletId)
				setTransactions(data)
			} catch (error: any) {
				showAlert({
					type: 'error',
					message: 'Không thể tải danh sách giao dịch',
					details: error.message,
				})
			} finally {
				setLoadingTransactions(false)
			}
		},
		[showAlert],
	)

	const handleLoadWallet = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!walletIdInput.trim()) {
			showAlert({
				type: 'error',
				message: 'Vui lòng nhập ID của ví multisig',
			})
			return
		}
		await fetchWallet(walletIdInput.trim())
		await fetchTransactions(walletIdInput.trim())
	}

	const handleCreateWallet = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const owners = parseOwners(createForm.ownersText)
		if (owners.length === 0) {
			showAlert({
				type: 'error',
				message: 'Vui lòng nhập ít nhất 1 owner',
			})
			return
		}
		const payload: CreateWalletRequest = {
			name: createForm.name.trim(),
			description: createForm.description.trim() || undefined,
			owners,
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
			})
			setWalletIdInput(linkedWallet.id)
			await fetchWallet(linkedWallet.id, { suppressAlert: true })
			await fetchTransactions(linkedWallet.id)
			showAlert({
				type: 'success',
				message: 'Liên kết ví thành công',
			})
		} catch (error: any) {
			showAlert({
				type: 'error',
				message: 'Không thể liên kết ví',
				details: error.message,
			})
		} finally {
			setLinkLoading(false)
		}
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

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<h1 className={styles.headerTitle}>Ví Multisig</h1>
				<p className={styles.headerSubtitle}>
					Tạo, liên kết và quản lý các giao dịch multisig ngay trong nền tảng. Bạn cần đảm
					bảo Service Account nằm trong danh sách owner và ví đã được nạp đủ ETH để thực thi
					giao dịch.
				</p>
			</div>

			{alertState && (
				<div
					className={`${styles.alert} ${
						alertState.type === 'success'
							? styles.alertSuccess
							: alertState.type === 'error'
							? styles.alertError
							: styles.alertInfo
					}`}
				>
					<AlertCircle size={20} className={styles.alertIcon} />
					<div>
						<div className={styles.alertMessage}>{alertState.message}</div>
						{alertState.details && <div className={styles.alertDetails}>{alertState.details}</div>}
					</div>
				</div>
			)}

			<div className={styles.formsGrid}>
				<div className={styles.card}>
					<div className={styles.sectionTitle}>
						<Wallet size={20} />
						Tạo ví mới
					</div>
					<form className={styles.form} onSubmit={handleCreateWallet}>
						<label className={styles.formLabel}>
							Tên ví
							<input
								className={styles.input}
								type="text"
								value={createForm.name}
								onChange={(event) =>
									setCreateForm((prev) => ({ ...prev, name: event.target.value }))
								}
								placeholder="Ví Admin DAO"
								required
							/>
						</label>
						<label className={styles.formLabel}>
							Mô tả
							<textarea
								className={`${styles.input} ${styles.textarea}`}
								value={createForm.description}
								onChange={(event) =>
									setCreateForm((prev) => ({ ...prev, description: event.target.value }))
								}
								placeholder="Ghi chú nội bộ (tuỳ chọn)"
							/>
						</label>
						<label className={styles.formLabel}>
							Danh sách owners (mỗi dòng hoặc cách nhau bởi dấu phẩy)
							<textarea
								className={`${styles.input} ${styles.textarea} ${styles.textareaOwners}`}
								value={createForm.ownersText}
								onChange={(event) =>
									setCreateForm((prev) => ({ ...prev, ownersText: event.target.value }))
								}
								placeholder={'0xabc...\n0xdef...'}
								required
							/>
						</label>
						<label className={styles.formLabel}>
							Ngưỡng chữ ký (threshold)
							<input
								className={styles.input}
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
						</label>
						<button
							type="submit"
							className={`${styles.button} ${styles.buttonPrimary}`}
							disabled={createLoading}
						>
							<FilePlus2 size={18} />
							{createLoading ? 'Đang tạo...' : 'Tạo ví mới'}
						</button>
					</form>
				</div>

				<div className={styles.card}>
					<div className={styles.sectionTitle}>
						<Link2 size={20} />
						Liên kết ví hiện có
					</div>
					<form className={styles.form} onSubmit={handleLinkWallet}>
						<label className={styles.formLabel}>
							Tên ví
							<input
								className={styles.input}
								type="text"
								value={linkForm.name}
								onChange={(event) =>
									setLinkForm((prev) => ({ ...prev, name: event.target.value }))
								}
								placeholder="Ví cộng đồng"
								required
							/>
						</label>
						<label className={styles.formLabel}>
							Mô tả
							<textarea
								className={`${styles.input} ${styles.textarea}`}
								value={linkForm.description}
								onChange={(event) =>
									setLinkForm((prev) => ({ ...prev, description: event.target.value }))
								}
								placeholder="Ghi chú nội bộ (tuỳ chọn)"
							/>
						</label>
						<label className={styles.formLabel}>
							Địa chỉ contract
							<input
								className={styles.input}
								type="text"
								value={linkForm.contractAddress}
								onChange={(event) =>
									setLinkForm((prev) => ({ ...prev, contractAddress: event.target.value }))
								}
								placeholder="0x1234..."
								required
							/>
						</label>
						<button
							type="submit"
							className={`${styles.button} ${styles.buttonPrimary}`}
							disabled={linkLoading}
						>
							<Link2 size={18} />
							{linkLoading ? 'Đang liên kết...' : 'Liên kết ví'}
						</button>
					</form>
				</div>
			</div>

			<div className={styles.card}>
				<div className={styles.sectionTitle}>
					<Shield size={20} />
					Tải thông tin ví
				</div>
				<form className={styles.loadForm} onSubmit={handleLoadWallet}>
					<input
						className={`${styles.input} ${styles.loadFormInput}`}
						type="text"
						value={walletIdInput}
						onChange={(event) => setWalletIdInput(event.target.value)}
						placeholder="Nhập ID ví (UUID)"
					/>
					<button
						type="submit"
						className={`${styles.button} ${styles.buttonPrimary}`}
						disabled={loadingWallet}
					>
						<RefreshCcw size={18} />
						{loadingWallet ? 'Đang tải...' : 'Tải ví'}
					</button>
				</form>
			</div>

			{wallet && (
				<div className={styles.contentStack}>
					<WalletSummary
						wallet={wallet}
						onRefresh={() => {
							if (wallet.id) {
								fetchWallet(wallet.id)
								fetchTransactions(wallet.id)
							}
						}}
					/>

					<TransactionForm
						values={transactionForm}
						loading={submitLoading}
						onChange={(field, value) =>
							setTransactionForm((prev) => ({
								...prev,
								[field]: value,
							}))
						}
						onSubmit={handleSubmitTransaction}
						onReset={() =>
							setTransactionForm({
								destination: '',
								value: '',
								data: '',
							})
						}
					/>

					<div className={styles.card}>
						<div className={styles.pendingHeader}>
							<div className={styles.sectionTitle}>
								<Wallet size={20} />
								Giao dịch chờ xử lý
							</div>
							<button
								type="button"
								className={`${styles.button} ${styles.buttonSecondary}`}
								disabled={loadingTransactions}
								onClick={() => activeWalletId && fetchTransactions(activeWalletId)}
							>
								<RefreshCcw size={16} />
								Làm mới
							</button>
						</div>
						{loadingTransactions && (
							<div className={styles.loadingText}>Đang tải danh sách giao dịch...</div>
						)}
						{!loadingTransactions && pendingTransactions.length === 0 && (
							<div className={styles.emptyState}>Không có giao dịch nào đang chờ.</div>
						)}
						<div className={styles.transactionList}>
							{pendingTransactions.map((tx) => (
								<div key={tx.id} className={styles.transactionItem}>
									<div className={styles.transactionHeader}>
										<div className={styles.transactionMeta}>
											<strong>#{tx.txIndexOnChain}</strong>
											<span>ID: {tx.id}</span>
											<span>TX Hash: {tx.txHash || '—'}</span>
										</div>
										<div className={styles.transactionStatus}>{tx.status}</div>
									</div>
									<div className={styles.transactionGrid}>
										<div>
											<div className={styles.transactionLabel}>Gửi tới</div>
											<div className={styles.inputMono}>{tx.destination}</div>
										</div>
										<div>
											<div className={styles.transactionLabel}>Giá trị</div>
											<div>{formatWeiToEth(tx.value)} ETH</div>
										</div>
										<div>
											<div className={styles.transactionLabel}>Lượt xác nhận</div>
											<div>
												{tx.confirmations?.length || 0}/{wallet.threshold}
											</div>
										</div>
									</div>
									{tx.data && tx.data !== '0x' && (
										<div>
											<div className={styles.transactionLabel}>Dữ liệu bổ sung</div>
											<pre className={styles.transactionData}>{tx.data}</pre>
										</div>
									)}
									<div className={styles.transactionActions}>
										<label className={styles.formLabel}>
											Private key để xác nhận (tuỳ chọn)
											<input
												className={`${styles.input} ${styles.inputMono}`}
												type="password"
												value={confirmKeys[tx.id] || ''}
												onChange={(event) =>
													setConfirmKeys((prev) => ({ ...prev, [tx.id]: event.target.value }))
												}
												placeholder="Nếu bỏ trống sẽ dùng Service Account"
											/>
										</label>
										<div className={styles.transactionActionsButtons}>
											<button
												type="button"
												className={`${styles.button} ${styles.buttonPrimary}`}
												disabled={confirmLoading[tx.id]}
												onClick={() => handleConfirmTransaction(tx.id)}
											>
												<CheckCircle2 size={18} />
												{confirmLoading[tx.id] ? 'Đang xác nhận...' : 'Xác nhận'}
											</button>
											<button
												type="button"
												className={`${styles.button} ${styles.buttonSecondary}`}
												onClick={() => handleExecuteTransaction(tx.id)}
												disabled={
													executeLoading[tx.id] ||
													(tx.confirmations?.length || 0) < wallet.threshold
												}
											>
												<Play size={18} />
												{executeLoading[tx.id] ? 'Đang thực thi...' : 'Thực thi giao dịch'}
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className={styles.card}>
						<div className={styles.sectionTitle}>
							<CheckCircle2 size={20} />
							Giao dịch đã hoàn tất
						</div>
						{executedTransactions.length === 0 ? (
							<div className={styles.emptyState}>Chưa có giao dịch nào được thực thi.</div>
						) : (
							<div className={styles.executedList}>
								{executedTransactions.map((tx) => (
									<div key={tx.id} className={styles.executedItem}>
										<div>
											<div className={styles.transactionLabel}>ID</div>
											<div className={styles.inputMono}>{tx.id}</div>
										</div>
										<div>
											<div className={styles.transactionLabel}>TX Hash</div>
											<div className={styles.inputMono}>{tx.txHash || '—'}</div>
										</div>
										<div>
											<div className={styles.transactionLabel}>Giá trị (ETH)</div>
											<div>{formatWeiToEth(tx.value)}</div>
										</div>
										<div>
											<div className={styles.transactionLabel}>Thời gian cập nhật</div>
											<div>{tx.updatedAt ? new Date(tx.updatedAt).toLocaleString() : '—'}</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

export default MultisigWalletPage

