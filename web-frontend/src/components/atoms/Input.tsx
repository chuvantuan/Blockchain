import React from 'react'

interface InputProps {
	id: string
	name: string
	type: 'text' | 'email' | 'password'
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	placeholder: string
	error?: string
	required?: boolean
}

export default function Input({
	id,
	name,
	type,
	value,
	onChange,
	placeholder,
	error,
	required = false
}: InputProps): JSX.Element {
	return (
		<div>
			<label
				htmlFor={id}
				style={{
					display: 'block',
					fontSize: '0.875rem',
					fontWeight: '500',
					color: 'var(--card-foreground)',
					marginBottom: '0.25rem'
				}}
			>
				{name.charAt(0).toUpperCase() + name.slice(1)}
			</label>

			<input
				type={type}
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				style={{
					width: '100%',
					padding: '0.75rem 1rem',
					border: `1px solid ${error ? 'var(--destructive)' : 'var(--border)'}`,
					background: 'var(--background)',
					borderRadius: 'var(--radius-md)',
					outline: 'none',
					color: 'var(--foreground)',
					fontSize: '0.875rem',
					animation: error ? 'shake 0.4s ease-in-out' : 'none',
					boxSizing: 'border-box'
				}}
				placeholder={placeholder}
				required={required}
			/>

			{error && (
				<p
					style={{
						fontSize: '0.875rem',
						color: 'var(--destructive)',
						marginTop: '0.25rem',
						margin: 0
					}}
				>
					{error}
				</p>
			)}
		</div>
	)
}
