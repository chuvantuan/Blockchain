import React from 'react'
import Modal from '../../components/common/Modal'
import SessionDetailView from '../../components/proctoring/SessionDetailView'
import { type ProctoringSession } from '../../types/proctoring'

interface SessionDetailModalProps {
	isOpen: boolean
	onClose: () => void
	session: ProctoringSession | null
	onResolveViolation: (violationId: string) => void
	onTerminate: (sessionId: string) => void
	onSendWarning: (sessionId: string) => void
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
	isOpen,
	onClose,
	session,
	onResolveViolation,
	onTerminate,
	onSendWarning
}) => {
	if (!session) return null

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Chi tiết phiên giám sát"
			maxWidth="1000px"
		>
			<SessionDetailView
				session={session}
				onResolveViolation={onResolveViolation}
				onTerminate={onTerminate}
				onSendWarning={onSendWarning}
			/>
		</Modal>
	)
}

export default SessionDetailModal
