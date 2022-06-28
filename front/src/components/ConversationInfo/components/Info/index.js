import React from 'react'
import Avatar from '../../../HomeComponent/Avatar'

const Info = ({avatar, name, children}) => {
    return (
        <div className="pt-4 flex flex-col items-center justify-center">
            <Avatar
                className="!h-20 !w-20 mb-3"
                isNoDot={true}
                src={avatar}
            />
            <h3 className="text-lg font-semibold dark:text-gray-100">{name}</h3>
            {children}
        </div>
    )
}

export default Info
