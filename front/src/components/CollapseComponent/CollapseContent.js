import { useRef } from 'react'
import { memo } from 'react'
import { useCollapseStore } from './context'
import _ from 'lodash'

function CollapseContent({ id, children, className }) {
    const { open } = useCollapseStore()
    
    return (
        <div
            className={`transition-grid-template-rows grid overflow-hidden rounded-b-lg bg-white bg-opacity-50 px-5 dark:bg-gray-900 ${className}`}
            style={{
                gridTemplateRows: open.includes(id) ? '1fr' : '0fr',
            }}
        >
            <ul className="overflow-hidden">{children}</ul>
        </div>
    )
}

export default CollapseContent
