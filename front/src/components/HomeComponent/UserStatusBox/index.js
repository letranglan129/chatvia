import { memo } from 'react'
import { useSelector } from 'react-redux'
import Avatar from '../Avatar'

function UserStatusBox({ user }) {
    const theme = useSelector((state) => state.theme)

    return (
        <div>
            <div
                className={`${
                    theme.colorTheme === 'dark'
                        ? 'theme-bg-black-dark'
                        : 'theme-bg-gray'
                } relative mt-5 inline-block rounded-xl px-2 pt-5 pb-1`}
            >
                <div className="absolute -top-5 left-1/2 h-10 w-10 -translate-x-1/2 transform">
                    <Avatar user={user} />
                </div>
                <div className="w-16 truncate text-center text-gray-800 dark:text-gray-100">
                    <span
                        className="text-sm text-gray-800 dark:text-gray-100"
                        title={user?.name}
                    >
                        {user?.name?.split(' ')?.pop()}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default memo(UserStatusBox)
