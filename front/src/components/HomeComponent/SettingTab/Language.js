import { useState, memo } from 'react'
import { LanguageData } from './LanguageData'

function Language() {
	const [language, setLanguage] = useState('Vietnamese')

	return (
		<>
			{LanguageData.map((item, index) => (
				<li key={index}>
					<label className='cursor-pointer bg-transparent flex items-center justify-between py-3 dark:text-gray-200'>
						<div className=''>
							<div className='flex items-center justify-center'>
								<span>
									<img src={item.img} className='h-4 w-6 mr-4' alt='' />
								</span>
								{item.name}
							</div>
						</div>
						<input
							type='checkbox'
							className='bg-transparent'
							value={item.name}
							name='language'
							checked={language === item.name}
							onChange={(e) => setLanguage([e.target.value])}
						/>
					</label>
				</li>
			))}
		</>
	)
}

export default memo(Language)
