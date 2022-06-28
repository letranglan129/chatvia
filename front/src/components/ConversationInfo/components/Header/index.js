import React from 'react'
import { useConversationInfo } from '../../context/context'

const Header = ({ children }) => {
    const { history, shiftPath } = useConversationInfo()

    return (
        <>
            <h2 className="relative h-16 flex-shrink-0 flex items-center justify-center border-b dark:bg-gray-700 bg-white dark:border-gray-500 dark:text-gray-100">
                {history.path !== 'home' && (
                    <button className="absolute dark:hover:bg-gray-600 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center text-2xl left-4" onClick={shiftPath}>
                        <ion-icon name="return-down-back-outline"></ion-icon>
                    </button>
                )}
                {children}
            </h2>
        </>
    )
}

export default Header
