import { RefreshCcw, Shield, UserRound } from 'lucide-react'
import { MultisigWallet, IdentityUser } from '../../services/api/multisigApi'
import { formatWeiToEth } from '../../utils/multisig'
import styles from '../../assets/css/MultisigWalletPage.module.css'

type WalletSummaryProps = {
	wallet: MultisigWallet
	onRefresh: () => void
	creator?: IdentityUser | null
	creatorLoading?: boolean
	creatorError?: string | null
}

const WalletSummary = ({
	wallet,
	onRefresh,
	creator,
	creatorLoading = false,
	creatorError = null,
}: WalletSummaryProps): JSX.Element => {
	return (
		<div className={styles.card}>
			<div className={styles.summaryHeader}>
				<div className={styles.summaryInfo}>
					<div className={styles.summaryMeta}>
						<Shield size={24} />
						<div>
							<h2 className={styles.summaryTitle}>{wallet.name}</h2>
							<div className={styles.summaryMetaText}>
								<span>ID: {wallet.id}</span>
								<span>Contract: {wallet.contractAddress}</span>
							</div>
						</div>
					</div>
					{wallet.description && <p className={styles.summaryDescription}>{wallet.description}</p>}
				</div>
				<button className={`${styles.button} ${styles.buttonSecondary}`} type="button" onClick={onRefresh}>
					<RefreshCcw size={18} />
					Làm mới
				</button>
			</div>

			<div className={styles.summaryGrid}>
				<div className={styles.summaryStat}>
					<span className={styles.summaryStatLabel}>Số dư (ETH)</span>
					<strong className={styles.summaryStatValue}>{formatWeiToEth(wallet.onChainBalance || '0')}</strong>
				</div>
				<div className={styles.summaryStat}>
					<span className={styles.summaryStatLabel}>Số lượng owners</span>
					<strong className={styles.summaryStatValue}>{wallet.owners?.length || 0}</strong>
				</div>
				<div className={styles.summaryStat}>
					<span className={styles.summaryStatLabel}>Ngưỡng chữ ký</span>
					<strong className={styles.summaryStatValue}>{wallet.threshold}</strong>
				</div>
			</div>

			{wallet.creatorId && (
				<div className={styles.summaryUserSection}>
					<div className={styles.summaryUserHeader}>
						<div className={styles.summaryUserIcon}>
							<UserRound size={18} />
						</div>
						<div>
							<div className={styles.summaryUserLabel}>Người tạo ví</div>
							{creatorLoading ? (
								<div className={styles.summaryUserLoading}>Đang tải thông tin người dùng...</div>
							) : creator ? (
								<>
									<div className={styles.summaryUserName}>
										{creator.firstName || creator.lastName
											? `${creator.firstName ?? ''} ${creator.lastName ?? ''}`.trim()
											: creator.username}
									</div>
									<div className={styles.summaryUserMeta}>
										<span>Email: {creator.email || '—'}</span>
										{creator.roles && creator.roles.length > 0 && (
											<span>Roles: {creator.roles.map((role) => role.toLowerCase()).join(', ')}</span>
										)}
									</div>
								</>
							) : (
								<div className={styles.summaryUserError}>
									{creatorError || 'Không thể tải thông tin người tạo ví.'}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			<div>
				<h3 className={styles.summaryOwnerTitle}>Danh sách owners</h3>
				<div className={styles.ownerList}>
					{wallet.ownerDetails && wallet.ownerDetails.length > 0 ? (
						wallet.ownerDetails.map((owner) => (
							<div key={`${owner.userId}-${owner.address}`} className={styles.ownerCard}>
								<div className={styles.ownerCardHeader}>
									<div className={styles.ownerCardName}>
										{owner.identity?.firstName || owner.identity?.lastName
											? `${owner.identity?.firstName ?? ''} ${owner.identity?.lastName ?? ''}`.trim()
											: owner.identity?.username || `User #${owner.userId}`}
									</div>
									<span className={styles.ownerCardId}>ID #{owner.userId}</span>
								</div>
								<div className={styles.ownerCardMeta}>Địa chỉ: {owner.address}</div>
								{owner.identity?.email && (
									<div className={styles.ownerCardMeta}>Email: {owner.identity.email}</div>
								)}
								{owner.privateKeyMasked && (
									<div className={styles.ownerCardKey}>Private key: {owner.privateKeyMasked}</div>
								)}
							</div>
						))
					) : wallet.owners && wallet.owners.length > 0 ? (
						wallet.owners.map((owner) => (
							<span key={owner} className={styles.ownerBadge}>
								{owner}
							</span>
						))
					) : (
						<div className={styles.ownerEmpty}>Chưa có owner nào được cấu hình.</div>
					)}
				</div>
				{wallet.onChainWarning && (
					<div className={styles.warning}>
						<strong>Cảnh báo:</strong> {wallet.onChainWarning}
						{wallet.onChainError && <div>Chi tiết: {wallet.onChainError}</div>}
					</div>
				)}
			</div>
		</div>
	)
}

export default WalletSummary


