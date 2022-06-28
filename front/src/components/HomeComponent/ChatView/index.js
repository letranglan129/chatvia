import { memo, useState } from 'react'
import { useSelector } from 'react-redux'
import ConversationInfo from '../../ConversationInfo'
import ImageDialog from '../ImageMessage/ImageDialog'
import ForwardDialog from '../Message/ForwardDialog'
import ContentMessage from './ContentMessage'
import DialogCall from './DialogCall'
import Header from './Header'
import InputMessage from './InputMessage'

function ChatView() {
    const { toggleMess } = useSelector((state) => state.viewMessage)
    const conversationInfoDialog = useSelector(
        (state) => state.conversationInfoDialog
    )
    const theme = useSelector((state) => state.theme)
    const [loadingMessage, setLoadingFileMessages] = useState(false)

    const toggleViewMessage = () => {
        if (theme?.isHidden && toggleMess) return 'hidden toggle-mess'
        if (theme?.isHidden && !toggleMess) return 'hidden not-toggle-mess'
        if (!theme?.isHidden) return 'not-hidden'
    }

    return (
        <>
            <div
                className={`view-message flex flex-col ${toggleViewMessage()}`}
            >
                <div className="flex h-full flex-1 flex-col">
                    <Header />
                    <ContentMessage loadingMessage={loadingMessage} />
                    <InputMessage setLoadingMessages={setLoadingFileMessages} />
                </div>
                <ForwardDialog />
                <ImageDialog />
                <DialogCall />
            </div>

            {conversationInfoDialog.conversationInfo && <ConversationInfo />}
        </>
    )
}

export default memo(ChatView)
