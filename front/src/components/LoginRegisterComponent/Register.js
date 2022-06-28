import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { headingRegister } from './LoginRegisterHeading'
import HeaderLoginRegister from './HeaderLoginRegister'
import RegisterForm from './RegisterForm'
import SwitchesTheme from '../SwitchesComponent'
import { updateTheme } from '../../redux/slice/themeSlice'

export default function Register() {
	const dispatch = useDispatch()
	const theme = useSelector((state) => state.theme)

	// Change theme
	const handleToggleTheme = () => {
		const newTheme = {
			colorTheme: theme?.colorTheme === 'light' ? 'dark' : 'light',
		}
		dispatch(updateTheme(newTheme))
	}

	return (
		<>
			<SwitchesTheme
				condition={{
					result: theme?.colorTheme === 'light',
					true: 'partly-sunny',
					false: 'moon',
				}}
				id='toggle-dark-mode'
				changeFunc={handleToggleTheme}
			/>
			<HeaderLoginRegister heading={headingRegister} />
			<RegisterForm />
			<div className='text-center pt-5 pb-3 text-gray-700 dark:text-gray-300'>
				Bạn đã có tài khoản?
				<Link to='/login' className='text-indigo-500'>
					Đăng nhập ngay!!!
				</Link>
			</div>
			<div className='text-center py-5 text-gray-700 dark:text-gray-300'>
				© 2021 Chatvia. Crafted with
				<ion-icon name='heart' style={{ color: '#dc2626' }}></ion-icon> by LeLan
			</div>
		</>
	)
}
