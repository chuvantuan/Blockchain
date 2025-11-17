import React, { useState, useRef, KeyboardEvent, useEffect } from 'react'
import { Send, Paperclip, Smile, Mic, MicOff } from 'lucide-react'
import styles from '../../assets/css/ChatBox.module.css'

interface ChatInputProps {
	onSendMessage: (message: string) => void
	disabled?: boolean
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps): JSX.Element {
	const [message, setMessage] = useState('')
	const [isListening, setIsListening] = useState(false)
	const [speechSupported, setSpeechSupported] = useState(false)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const recognitionRef = useRef<SpeechRecognition | null>(null)

	// Initialize speech recognition
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
			if (SpeechRecognition) {
				setSpeechSupported(true)
				const recognition = new SpeechRecognition()
				recognition.continuous = false
				recognition.interimResults = true
				recognition.lang = 'vi-VN' // Vietnamese language

				recognition.onstart = () => {
					setIsListening(true)
				}

				recognition.onresult = (event: SpeechRecognitionEvent) => {
					let finalTranscript = ''
					let interimTranscript = ''

					for (let i = event.resultIndex; i < event.results.length; i++) {
						const transcript = event.results[i][0].transcript
						if (event.results[i].isFinal) {
							finalTranscript += transcript
						} else {
							interimTranscript += transcript
						}
					}

					if (finalTranscript) {
						setMessage(prev => prev + finalTranscript)
						// Auto-resize textarea
						setTimeout(() => {
							if (textareaRef.current) {
								textareaRef.current.style.height = 'auto'
								textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
							}
						}, 0)
					}
				}

				recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
					console.error('Speech recognition error:', event.error)
					setIsListening(false)
				}

				recognition.onend = () => {
					setIsListening(false)
				}

				recognitionRef.current = recognition
			}
		}
	}, [])

	const handleVoiceInput = () => {
		if (!speechSupported || disabled) return

		if (isListening) {
			recognitionRef.current?.stop()
		} else {
			recognitionRef.current?.start()
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (message.trim() && !disabled) {
			onSendMessage(message)
			setMessage('')
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto'
			}
		}
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit(e)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value)
		
		// Auto-resize textarea
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
		}
	}

	return (
		<form className={styles.inputForm} onSubmit={handleSubmit}>
			<div className={styles.inputContainer}>
				<button
					type="button"
					className={styles.attachButton}
					title="Đính kèm file"
					disabled={disabled}
				>
					<Paperclip size={18} />
				</button>
				
				{speechSupported && (
					<button
						type="button"
						className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
						title={isListening ? "Dừng ghi âm" : "Ghi âm giọng nói"}
						disabled={disabled}
						onClick={handleVoiceInput}
					>
						{isListening ? <MicOff size={18} /> : <Mic size={18} />}
					</button>
				)}
				
				<textarea
					ref={textareaRef}
					value={message}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder={isListening ? "Đang nghe..." : "Nhập tin nhắn của bạn..."}
					className={styles.messageInput}
					disabled={disabled}
					rows={1}
				/>
				
				<button
					type="button"
					className={styles.emojiButton}
					title="Thêm emoji"
					disabled={disabled}
				>
					<Smile size={18} />
				</button>
				
				<button
					type="submit"
					className={styles.sendButton}
					disabled={disabled || !message.trim()}
					title="Gửi tin nhắn"
				>
					<Send size={18} />
				</button>
			</div>
		</form>
	)
}
