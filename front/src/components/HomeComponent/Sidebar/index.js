import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { STATUS_NOTIFY } from '../../../constant'
import { LOGO } from '../../../image'
import { toggleSearchResult } from '../../../redux/dialogSlice'
import { updateTheme } from '../../../redux/themeSlice'
import Avatar from '../Avatar'
import DotNotify from './DotNotify'
import optionSidebar from './SidebarData'

function Sidebar({ tab, setTab }) {
    const theme = useSelector(state => state.theme)
    const dispatch = useDispatch()
    const notify = useSelector(state => state.notify)
    const { user } = useSelector(state => state.auth.currentUser)

    // Change theme
    const handleChangeTheme = () => {
        const newTheme = {
            colorTheme: theme.colorTheme === 'light' ? 'dark' : 'light',
        }
        dispatch(updateTheme(newTheme))
    }

    return (
        <div className={`sidebar ${theme.isHidden ? 'hidden' : ''} ${theme.colorTheme === 'light' ? 'theme-bg-light' : 'theme-bg-dark'}`}
        >
            <SimpleBar style={{ height: '100%' }}>
                <div
                    className={
                        theme.isHidden
                            ? 'flex items-center justify-between overflow-hidden h-14'
                            : ''
                    }
                >
                    <div
                        className={
                            theme.isHidden ? 'mt-6 mb-8 hidden' : 'mt-6 mb-8'
                        }
                    >
                        <img
                            className="w-8 mx-auto"
                            src={LOGO.SVG}
                            alt="Chatvia"
                            title="Chatvia"
                        />
                    </div>
                    {optionSidebar.map((item, index) => {
                        switch (item.type) {
                            case 'link':
                                return (
                                    <div
                                        onClick={() => {
                                            setTab(item.key)
                                            dispatch(toggleSearchResult(false))
                                        }}
                                        key={index}
                                        className={`option-sidebar tab mb-7 flex items-center justify-center select-none ${tab.includes(item.key)
                                            ? 'active'
                                            : ''
                                            }`}
                                        title={item.title}
                                    >
                                        <Link to={item.link}>
                                            <span className="p-2 flex option-icon dark:text-gray-100">
                                                {item.icon}
                                            </span>
                                        </Link>
                                        {item.key === 'notify' &&
                                            notify.notifyList.filter(
                                                element =>
                                                    element.status ===
                                                    STATUS_NOTIFY.sent ||
                                                    !element.status
                                            ).length > 0 && (
                                                <DotNotify
                                                    count={
                                                        notify.notifyList.length
                                                    }
                                                />
                                            )}
                                        {item.key === 'chat' &&
                                            notify.newMessageNotify.length >
                                            0 && (
                                                <DotNotify
                                                    count={
                                                        notify.newMessageNotify
                                                            .length
                                                    }
                                                />
                                            )}
                                    </div>
                                )
                            default:
                                return ''
                        }
                    })}
                    <div
                        className="tab option-sidebar mb-7 flex items-center justify-center select-none"
                        title="Tối/Sáng"
                    >
                        <span
                            className="p-2 flex option-icon dark:text-gray-100"
                            onClick={handleChangeTheme}
                        >
                            {theme.colorTheme === 'light' ? (
                                <ion-icon name="moon-outline"></ion-icon>
                            ) : (
                                <ion-icon name="sunny-outline"></ion-icon>
                            )}
                        </span>
                    </div>

                    <div
                        onClick={() => {
                            setTab('profile')
                            dispatch(toggleSearchResult(false))
                        }}
                        className="option-sidebar  tab mb-7 flex items-center justify-center select-none"
                        title="Avatar"
                    >
                        <span className="p-2 flex">
                            <Avatar.NotDot
                                className="rounded-full w-7 h-7"
                                src={user.avatar}
                                alt="Avatar"
                            />
                        </span>
                    </div>
                </div>
            </SimpleBar>
        </div>
    )
}

export default memo(Sidebar)
