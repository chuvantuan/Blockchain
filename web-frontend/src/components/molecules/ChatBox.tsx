import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import styles from '../../assets/css/ChatBox.module.css'

interface Message {
	id: string
	content: string
	sender: 'user' | 'bot'
	timestamp: Date
	type?: 'text' | 'typing'
}

interface ChatBoxProps {
	isOpen: boolean
	onToggle: () => void
	onClose: () => void
}

export default function ChatBox({ isOpen, onToggle, onClose }: ChatBoxProps): JSX.Element {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			content: 'Xin chào! Tôi có thể giúp gì cho bạn hôm nay?',
			sender: 'bot',
			timestamp: new Date(),
			type: 'text'
		}
	])
	const [isMinimized, setIsMinimized] = useState(false)
	const [isTyping, setIsTyping] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleSendMessage = (content: string) => {
		if (!content.trim()) return

		const userMessage: Message = {
			id: Date.now().toString(),
			content: content.trim(),
			sender: 'user',
			timestamp: new Date(),
			type: 'text'
		}

		setMessages(prev => [...prev, userMessage])

		// Simulate bot typing
		setIsTyping(true)
		setTimeout(() => {
			const botMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: 'Cảm ơn bạn đã nhắn tin! Đây là phản hồi tự động. Backend sẽ được kết nối sau.',
				sender: 'bot',
				timestamp: new Date(),
				type: 'text'
			}
			setMessages(prev => [...prev, botMessage])
			setIsTyping(false)
		}, 1500)
	}

	const handleMinimize = () => {
		setIsMinimized(!isMinimized)
	}

	if (!isOpen) {
		return (
			<div className={styles.chatToggle} onClick={onToggle}>
				<MessageCircle size={24} />
				<div className={styles.chatBadge}>
					<span>1</span>
				</div>
			</div>
		)
	}

	return (
		<div className={`${styles.chatBox} ${isMinimized ? styles.minimized : ''}`}>
			{/* Chat Header */}
			<div className={styles.chatHeader}>
				<div className={styles.chatTitle}>
					<MessageCircle size={20} />
					<span>Hỗ trợ học tập</span>
					<div className={styles.onlineStatus}></div>
				</div>
				<div className={styles.chatActions}>
					<button 
						className={styles.actionButton}
						onClick={handleMinimize}
						title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
					>
						{isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
					</button>
					<button 
						className={styles.actionButton}
						onClick={onClose}
						title="Đóng chat"
					>
						<X size={16} />
					</button>
				</div>
			</div>

			{/* Chat Content */}
			{!isMinimized && (
				<>
					{/* Messages Area */}
					<div className={styles.messagesArea}>
						<div className={styles.messagesContainer}>
							{messages.map((message) => (
								<ChatMessage
									key={message.id}
									message={message}
								/>
							))}
							{isTyping && (
								<div className={styles.typingIndicator}>
									<div className={styles.typingDots}>
										<span></span>
										<span></span>
										<span></span>
									</div>
									<span className={styles.typingText}>Đang trả lời...</span>
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>
					</div>

					{/* Input Area */}
					<div className={styles.inputArea}>
						<ChatInput onSendMessage={handleSendMessage} />
					</div>
				</>
			)}
		</div>
	)
}
