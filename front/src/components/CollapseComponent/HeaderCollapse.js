import { useEffect } from 'react'
import { memo, useCallback } from 'react'
import { useCollapseStore } from '../CollapseComponent/context'

function HeaderCollapse({ contentFor, children, className }) {
    const handleClick = useCallback(() => setOpen(contentFor), [])
    const { open, setOpen, isShowAll } = useCollapseStore()

    useEffect(() => {
        if (isShowAll) setOpen(contentFor)
    }, [])

    return (
        <label
            className={`text-sm cursor-pointer text-gray-800 select-none font-medium bg-gray-200 hover:bg-gray-300 hover:bg-opacity-50 dark:text-gray-200 flex justify-between items-center py-3 px-5 ${
                open.includes(contentFor)
                    ? 'rounded-t-lg'
                    : 'rounded-lg delay-300 '
            } ${className}`}
        >
            <input
                hidden
                type="checkbox"
                onChange={handleClick}
                value={contentFor}
            />
            {children}
            {open.includes(contentFor) ? (
                <ion-icon name="chevron-up-sharp"></ion-icon>
            ) : (
                <ion-icon name="chevron-forward-sharp"></ion-icon>
            )}
        </label>
    )
}

export default memo(HeaderCollapse)
