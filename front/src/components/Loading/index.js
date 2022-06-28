import React from 'react'
import { useSelector } from 'react-redux'

export default function Loading({ className='', children, text = true }) {
    const theme = useSelector(state => state.theme)

    return (
        <div className={`w-full h-full flex items-center justify-center flex-col ${theme?.colorTheme === 'light' ? 'bg-white text-gray-800' : 'bg-[#303841] text-white'} ${className}`}>
            <div className="circle-loading mb-2"></div>
            {text && <div className="text-center">
                Đang tải...
            </div>}
            {children}
        </div>
    )
}
