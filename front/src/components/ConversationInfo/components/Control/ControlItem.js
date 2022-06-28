import React from 'react'

const ControlItem = ({ icon, children }) => {
    return (
        <div className="max-w-[84px]">
            <div className="p-1 w-8 h-8 mx-auto rounded-full bg-slate-200 flex items-center justify-center">
                {icon}
            </div>
            <span className="py-1 px-2 text-center text-xs block dark:text-gray-200">{children}</span>
        </div>
    )
}

export default ControlItem