import React from 'react'
import { ConversationInfoProvider } from './context/context'
import Content from './components/Content'
import { useDispatch } from 'react-redux'
import { toogleConversationInfo } from '../../redux/slice/dialog/conversationInfoSlice'

const ConversationInfo = ({ children }) => {
    const dispatch = useDispatch()

    return (
        <ConversationInfoProvider>
            <div className='h-full'>
                <div className="fixed inset-0 z-50 transition-all xl:hidden" onClick={() => {
                    dispatch(toogleConversationInfo())
                }}></div>
                <Content />
            </div>
        </ConversationInfoProvider>
    )
}

export default ConversationInfo
