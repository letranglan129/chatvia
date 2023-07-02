import { memo } from 'react'
import Avatar from '../Avatar'

function AvatarStatusLg({ name, src, status }) {
    return (
        <div className="mb-8 border-b pb-5 text-center dark:border-gray-600">
            <Avatar
                isNoDot={true}
                className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
                user={{
                    avatar: src,
                }}
                alt=""
            />
            <p className="font-medium text-gray-700 line-clamp-1 dark:text-gray-200">
                {name}
            </p>
            {/* <div>
                <span className="mr-2 inline-block h-3 w-3 rounded-full border-4 border-green-500"></span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Active
                </span>
            </div> */}
        </div>
    )
}

export default memo(AvatarStatusLg)
