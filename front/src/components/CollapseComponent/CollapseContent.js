import { useRef } from 'react'
import { memo } from 'react'
import { useCollapseStore } from './context'

function CollapseContent({ id, children, className }) {
    const contentRef = useRef()
    const { open } = useCollapseStore()
    return (
        <div
            className={`bg-white overflow-hidden dark:bg-gray-900 bg-opacity-50 rounded-b-lg px-5 ${className}`}
            style={{
                transition: 'height 0.3s linear',
                height: `${
                    open.includes(id)
                        ? `${contentRef.current.clientHeight}px`
                        : 0
                }`,
            }}
        >
            <ul ref={contentRef}>
                {children}
            </ul>
        </div>
    )
}

export default memo(CollapseContent)
