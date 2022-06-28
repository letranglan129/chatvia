import { memo } from 'react'
import { useSelector } from 'react-redux'
import Avatar from '../Avatar'

function UserStatusBox({ src, name }) {
	const theme = useSelector(state => state.theme)
	
	return (
		<div>
			<div
				className={`${theme.colorTheme === 'dark' ? 'theme-bg-black-dark' : 'theme-bg-gray'} inline-block relative mt-5 pt-5 px-2 pb-1 rounded-xl`}>
				<div className='absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10'>
					<Avatar src={src} />
				</div>
				<div className='w-16 truncate text-gray-800 dark:text-gray-100'>
					<span className='text-sm text-gray-800 dark:text-gray-100' title={name}>
						{name}
					</span>
				</div>
			</div>
		</div>
	)
}

export default memo(UserStatusBox)
