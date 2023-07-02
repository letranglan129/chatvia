import React, { useEffect, useRef } from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { useConversationInfo } from '../../context/context'
import Header from '../Header'

const Content = () => {
    const { history } = useConversationInfo()
    const ref = useRef()
    const Component = history.component
    useEffect(() => {
        ref.current.recalculate()
    })
    return (
        <div className="conversation-info animate-slideInRight xl:animate-none">
            <Header>{history?.title}</Header>
            <SimpleBar ref={ref} className="h-40 flex-1 shadow-xl">
                <Component />
            </SimpleBar>
        </div>
    )
}

export default Content
