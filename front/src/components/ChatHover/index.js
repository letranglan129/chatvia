import React from 'react'

const ChatHover = ({ children, className, ...props }) => {
    return (
        <div
            className={`flex items-center cursor-pointer select-none rounded-lg px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
            {...props}
        >{children}</div>
    )
}

export default ChatHover
