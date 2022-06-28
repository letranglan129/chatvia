import { useState } from 'react'

export default function Input(props) {
	const { label, type, register, placeholder, subTitle, optionForm = {}, children, title } = props
	const [focusBlur, setFocusBlur] = useState(false)

	return (
		<label htmlFor={label} className='block'>
			<div className='flex justify-between items-center'>
				<p className='mb-1 text-gray-700 dark:text-gray-300'>{title}</p>
				<p className='text-sm mb-1 text-gray-400 cursor-pointer'>{subTitle}</p>
			</div>
			<div className={`border-2 flex rounded-md overflow-hidden ${focusBlur ? 'focus-within:border-indigo-700' : 'dark:border-gray-700'}`}>
				<div className='px-4 py-3 border-r-2 flex border-gray-200 items-center text-gray-500 dark:bg-gray-700 dark:border-gray-700'>
					{children}
				</div>
				<input
					type={type || 'text'}
					id={label}
					name={label}
					placeholder={placeholder}
					className='outline-none px-3 text-sm w-full text-gray-600 dark:bg-gray-600 dark:text-gray-200'
					{...register(label, optionForm)}
					onFocus={() => setFocusBlur(!focusBlur)}
					onBlur={() => setFocusBlur(!focusBlur)}
				/>
			</div>
		</label>
	)
}
