import React from 'react'

export default function Footer(): JSX.Element {
	const footerLinks = [
		'Môi trường',
		'Câu hỏi thường gặp', 
		'Về chúng tôi',
		'Trợ giúp',
		'Tuyển dụng',
		'Điều khoản dịch vụ',
		'Chính sách bảo mật'
	]

	return (
		<footer style={{
			background: 'var(--card)',
			borderRadius: '6px',
			padding: '20px 8px',
			margin: '24px auto 16px',
			maxWidth: '1000px',
			border: '1px solid var(--border)',
			boxShadow: 'var(--shadow-sm)'
		}}>
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexWrap: 'wrap',
				gap: '20px'
			}}>
				{footerLinks.map((link, index) => (
					<a
						key={index}
						href="#"
						style={{
							color: 'var(--muted-foreground)',
							textDecoration: 'none',
							fontSize: '14px',
							fontWeight: 500,
							transition: 'color 0.3s ease',
							cursor: 'pointer',
							padding: '4px 8px',
							borderRadius: '6px'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.color = 'var(--accent)'
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.color = 'var(--muted-foreground)'
						}}
					>
						{link}
					</a>
				))}
			</div>
		</footer>
	)
}
