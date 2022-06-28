import React from 'react'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { useConversationInfo } from '../../context/context'
import Header from '../Header'

const Content = ({ children }) => {
    const { history } = useConversationInfo()
    const Component = history.component

    return (
        <div className="conversation-info animate-slideInRight xl:animate-none">
            <Header>{history?.title}</Header>
            <SimpleBar className="flex-1 h-40 shadow-xl">
                <Component />
            </SimpleBar>
        </div>
    )
}

export default Content
