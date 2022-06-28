import { useSelector } from 'react-redux'
import {LOGO} from '../../image'

function HeaderLoginRegister({ heading }) {
	const theme = useSelector((state) => state.theme)

	return (
		<div className='text-center py-8'>
			<div className='text-center mb-4'>
				<img alt='Chatvia' src={theme.colorTheme === 'light' ? LOGO.LIGHT : LOGO.DARK} className='h-10 mx-auto' />
			</div>
			<div>
				<p className='text-2xl mb-3 text-gray-800 dark:text-gray-300'>{heading.title}</p>
				<p className='text-base text-gray-400'>{heading.desc}</p>
			</div>
		</div>
	)
}

export default HeaderLoginRegister
