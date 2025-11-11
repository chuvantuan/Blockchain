import React, { useState } from 'react';
import TokenBalanceCard from '../components/molecules/TokenBalanceCard';
import TokenHistoryTable from '../components/molecules/TokenHistoryTable';
import TokenWithdrawModal from '../components/molecules/TokenWithdrawModal';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { Gift, History, Info } from 'lucide-react';

export default function RewardPage(): JSX.Element {
	const {
		balance,
		history,
		currentPage,
		totalPages,
		totalItems,
		loading,
		error,
		handleWithdraw,
		goToPage,
		nextPage,
		previousPage,
		refresh
	} = useTokenBalance();

	const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

	const handleOpenWithdrawModal = () => {
		setIsWithdrawModalOpen(true);
	};

	const handleCloseWithdrawModal = () => {
		setIsWithdrawModalOpen(false);
	};

	return (
		<div style={{ 
			padding: '24px',
			maxWidth: '1200px',
			margin: '0 auto'
		}}>
			{/* Header */}
			<div style={{ marginBottom: '32px' }}>
				<h1 style={{
					fontSize: '32px',
					fontWeight: 700,
					margin: '0 0 8px 0',
					display: 'flex',
					alignItems: 'center',
					gap: '12px'
				}}>
					<Gift size={36} style={{ color: 'var(--primary)' }} />
					Token Thưởng
				</h1>
				<p style={{
					fontSize: '16px',
					color: 'var(--muted-foreground)',
					margin: 0
				}}>
					Quản lý số dư token và lịch sử giao dịch của bạn
				</p>
			</div>

			{/* Error Message */}
			{error && (
				<div style={{
					padding: '16px',
					background: 'rgba(239, 68, 68, 0.1)',
					border: '1px solid #ef4444',
					borderRadius: '12px',
					marginBottom: '24px',
					display: 'flex',
					alignItems: 'center',
					gap: '12px',
					color: '#ef4444'
				}}>
					<Info size={20} />
					<span style={{ fontSize: '14px' }}>{error}</span>
				</div>
			)}

			{/* Balance Card */}
			<div style={{ marginBottom: '32px' }}>
				<TokenBalanceCard
					balance={balance}
					loading={loading}
					onWithdraw={handleOpenWithdrawModal}
					onRefresh={refresh}
				/>
			</div>

			{/* History Section */}
			<div>
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '16px'
				}}>
					<h2 style={{
						fontSize: '24px',
						fontWeight: 600,
						margin: 0,
						display: 'flex',
						alignItems: 'center',
						gap: '8px'
					}}>
						<History size={24} />
						Lịch sử giao dịch
					</h2>
					<div style={{
						fontSize: '14px',
						color: 'var(--muted-foreground)',
						background: 'var(--muted)',
						padding: '6px 12px',
						borderRadius: '20px'
					}}>
						{totalItems} giao dịch
					</div>
				</div>

				<TokenHistoryTable
					history={history}
					loading={loading}
					currentPage={currentPage}
					totalPages={totalPages}
					totalItems={totalItems}
					onPageChange={goToPage}
					onPrevious={previousPage}
					onNext={nextPage}
				/>
			</div>

			{/* Withdraw Modal */}
			<TokenWithdrawModal
				isOpen={isWithdrawModalOpen}
				onClose={handleCloseWithdrawModal}
				currentBalance={balance}
				onWithdraw={handleWithdraw}
			/>
		</div>
	);
}


