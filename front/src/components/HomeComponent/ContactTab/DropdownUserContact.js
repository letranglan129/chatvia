import { memo } from 'react'
import Option from './Option'
import Avatar from '../Avatar'
import { useSelector } from 'react-redux'

function DropdownUserContact({ index, friend, admin }) {
    const { user } = useSelector((state) => state.auth.currentUser)
    return (
        <div className="flex items-center justify-between rounded-lg py-2 px-4 hover:bg-slate-50 dark:hover:bg-gray-600">
            <div className="flex items-center justify-between">
                <Avatar
                    user={{
                        id: friend?._id,
                        avatar: friend?.avatar,
                    }}
                    className="mr-2"
                />
                <div className="cursor-pointer select-none font-medium text-gray-700 line-clamp-1 dark:text-gray-200">
                    {friend?.name} {admin ? '(Chủ)' : ''}
                </div>
            </div>
            {user._id !== friend._id &&<Option index={index} friend={friend} />}
        </div>
    )
}

export default memo(DropdownUserContact)
