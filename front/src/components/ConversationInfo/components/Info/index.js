import React from 'react'
import Avatar from '../../../HomeComponent/Avatar'

const Info = ({ avatar, name, children }) => {
    return (
        <div className="flex flex-col items-center justify-center pt-4">
            <Avatar
                className="mb-3 !h-20 !w-20"
                isNoDot={true}
                user={{
                    id: '',
                    avatar,
                }}
            />
            <h3 className="text-lg font-semibold dark:text-gray-100">{name}</h3>
            {children}
        </div>
    )
}

export default Info
