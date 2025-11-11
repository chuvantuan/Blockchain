import React from 'react'
import Modal from '../../components/common/Modal'
import { User } from '../../types/user'

interface DeleteUserModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	user: User | null
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	user
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Xác nhận xóa người dùng"
			footer={
				<>
					<button 
						className="btn btn-secondary"
						onClick={onClose}
					>
						Hủy
					</button>
					<button 
						className="btn btn-danger"
						onClick={onConfirm}
					>
						Xóa
					</button>
				</>
			}
		>
			<p style={{ margin: 0 }}>
				Bạn có chắc chắn muốn xóa người dùng <strong>{user?.name}</strong>?
				<br />
				Hành động này không thể hoàn tác.
			</p>
		</Modal>
	)
}

export default DeleteUserModal
