import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import '../../styles/common.css'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title: string
	children: React.ReactNode
	footer?: React.ReactNode
	maxWidth?: string
}

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	footer,
	maxWidth = '500px'
}: ModalProps): JSX.Element | null {
	
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
		}

		return () => {
			document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	const modalContent = (
		<div className="modal-overlay-modern" onClick={onClose}>
			<div 
				className="modal-container-modern" 
				style={{ maxWidth }}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="modal-header-modern">
					<div className="modal-title-modern">
						<h2>{title}</h2>
					</div>
					<button
						onClick={onClose}
						className="modal-close"
						title="Đóng"
					>
						<X size={22} />
					</button>
				</div>
				
				<div className="modal-content-modern">
					{children}
				</div>
				
				{footer && (
					<div className="form-actions-modern">
						{footer}
					</div>
				)}
			</div>
		</div>
	)

	// Render modal using Portal to mount it at document.body
	return createPortal(modalContent, document.body)
}

