import { memo, useEffect, useState } from "react"
import ChatHover from '../../ChatHover'
import createAxios from '../../../ulti/createInstance'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { updateToggleMess } from '../../../redux/slice/viewMessageSlice'
import { changeCurrentChat } from '../../../redux/slice/currentChatSlice'
import { pushMessage, removeAllMessage } from '../../../redux/slice/messageSlice'
import { removeNewsMessageNotify } from '../../../redux/slice/notifySlice'
import { add, getAll } from '../../../indexDB'
import { STORE_NAME_INDEXEDDB } from '../../../constant'
import { socket } from '../../../socket'

function GroupItem({ conversation }) {
    const [isUnread, setIsUnread] = useState(false)
    const axios = createAxios()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth.currentUser)
    const { toggleMess } = useSelector((state) => state.viewMessage)
    const { newMessageNotify } = useSelector((state) => state.notify)

    useEffect(() => {
        if (newMessageNotify.includes(conversation._id)) {
            setIsUnread(true)
        }
    }, [newMessageNotify])

    moment.locale('vi')
    // Click to active chat
    const openChat = async () => {
        if (toggleMess === conversation._id) return
        dispatch(updateToggleMess({ toggleMess: conversation._id }))
        dispatch(changeCurrentChat({ ...conversation }))
        dispatch(removeAllMessage())
        dispatch(removeNewsMessageNotify(conversation._id))
        setIsUnread(false)

        const data = await getAll(conversation._id, STORE_NAME_INDEXEDDB)

        socket.emit(
            'setReadedConversation',
            { conversationId: conversation._id, userId: user._id },
            (res) => console.log('success')
        )

        if (data.length !== 0) {
            dispatch(pushMessage(data))
        } else {
            const messages = await axios.get(`/message/${conversation._id}`)
            dispatch(pushMessage(messages.data))
            messages?.data.forEach(
                async (message) =>
                    await add(
                        message._id,
                        message,
                        message.conversationId,
                        STORE_NAME_INDEXEDDB
                    )
            )
        }
    }

    return (
        <ChatHover onClick={openChat}>
            <div className="mr-4 flex-none">
                <img
                    src={conversation.avatar}
                    className="h-10 w-10 rounded-full"
                    alt=""
                />
            </div>
            <div className="flex-1">
                <p className="font-medium text-gray-700 line-clamp-1 dark:text-gray-200">
                    {conversation.name}
                </p>
                <div>
                    <p className="text-sm text-gray-500 line-clamp-1 dark:text-gray-400">
                        {conversation?.lastMessage?.text || ''}
                    </p>
                    <span className="text-sm text-gray-500 line-clamp-1 dark:text-gray-400">
                        {conversation?.members?.length > 0
                            ? `${conversation?.members?.length} thành viên`
                            : ''}
                    </span>
                </div>
            </div>
        </ChatHover>
    )
}

export default memo(GroupItem)