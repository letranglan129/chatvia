import { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import ContentMessage from './ContentMessage'
import Header from './Header'
import InputMessage from './InputMessage'

function ChatView() {
    const { toggleMess } = useSelector(state => state.viewMessage)
    const theme = useSelector(state => state.theme)
    const [loadingMessage, setLoadingFileMessages] = useState(false)

    const toggleViewMessage = () => {
        if (theme?.isHidden && toggleMess)
			return 'hidden toggle-mess'
		if (theme?.isHidden && !toggleMess)
			return 'hidden not-toggle-mess'
		if (!theme?.isHidden)
            return 'not-hidden'
    }

    return (
        <div className={`view-message ${toggleViewMessage()}`}>
            <div className="flex flex-1 flex-col h-full">
                <Header />
                <ContentMessage loadingMessage={loadingMessage} />
                <InputMessage setLoadingMessages={setLoadingFileMessages} />
            </div>
        </div>
    )
}

export default memo(ChatView)
