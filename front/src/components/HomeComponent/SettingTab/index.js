import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { logout } from '../../../api/userApi'
import { CollapseWrap, HeaderCollapse } from '../../CollapseComponent'
import AvatarStatusLg from '../AvatarStatusLg'
import TitleTab from '../TitleTab'
import Help from './Help'
import Language from './Language'
import Privacy from './Privacy'
import Security from './Security'

function SettingTab() {
	const [open, setOpen] = useState([])
	const { user } = useSelector((state) => state.auth.currentUser)
	const theme = useSelector(state => state.theme)
	const dispatch = useDispatch()

	// Toggle collapse list
	const toggleCollapse = useCallback((index) => {
		setOpen((open) => {
			let isOpen = open.includes(index)

			if (isOpen) {
				return open.filter((item) => item !== index)
			} else {
				return [...open, index]
			}
		})
	})
	
	// Click to logout
	const handleLogout = () => {
		logout(dispatch)
	}

	return (
		<div className={`tab-container ${theme.isHidden ? '' : 'maxWidth'}`} >
			<div className='flex items-center justify-between mb-4'>
				<TitleTab>Cài đặt</TitleTab>
				<div
					className='w-8 h-8 cursor-pointer rounded-full flex items-center justify-center text-2xl dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 hover:bg-opacity-10'
					onClick={handleLogout}>
					<ion-icon name='log-out-outline'></ion-icon>
				</div>
			</div>

			<AvatarStatusLg src={user.avatar} name={user?.name} />

			<SimpleBar style={{ height: '200px', flex: '1' }}>
				<div className='mb-3'>
					<HeaderCollapse func={toggleCollapse} contentFor='1' arrCheck={open}>
						Quyền riêng tư
					</HeaderCollapse>

					<CollapseWrap id='1' arrCheck={open}>
						<Privacy />
					</CollapseWrap>
				</div>
				<div className='mb-3'>
					<HeaderCollapse func={toggleCollapse} contentFor='2' arrCheck={open}>
						Bảo mật
					</HeaderCollapse>

					<CollapseWrap id='2' arrCheck={open}>
						<Security />
					</CollapseWrap>
				</div>

				<div className='mb-3'>
					<HeaderCollapse func={toggleCollapse} contentFor='3' arrCheck={open}>
						Trợ giúp và Hỗ trợ
					</HeaderCollapse>

					<CollapseWrap id='3' arrCheck={open}>
						<Help />
					</CollapseWrap>
				</div>
				<div className='mb-3'>
					<HeaderCollapse func={toggleCollapse} contentFor='4' arrCheck={open}>
						Ngôn ngữ
					</HeaderCollapse>

					<CollapseWrap id='4' arrCheck={open}>
						<Language />
					</CollapseWrap>
				</div>
			</SimpleBar>
		</div>
	)
}

export default SettingTab
