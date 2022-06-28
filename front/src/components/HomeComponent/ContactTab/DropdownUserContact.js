import { memo } from 'react'
import Option from './Option'
import Avatar from '../Avatar'

function DropdownUserContact({ index, friend }) {
    return (
        <div className="flex items-center py-2">
            <div className="flex items-center justify-between">
                <Avatar src={friend.avatar} classImgAttr="mr-2" />
                <div className="cursor-pointer select-none font-medium line-clamp-1 text-gray-700 dark:text-gray-200">
                    {friend?.name}
                </div>
            </div>
            <Option index={index} friend={friend}/>
        </div>
    )
}

export default memo(DropdownUserContact)
