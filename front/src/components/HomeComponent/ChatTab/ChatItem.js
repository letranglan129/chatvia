import { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import Avatar from '../Avatar'
import { updateToggleMess } from '../../../redux/slice/viewMessageSlice'
import {
    pushMessage,
    removeAllMessage,
} from '../../../redux/slice/messageSlice'
import createAxios from '../../../ulti/createInstance'
import { changeCurrentChat } from '../../../redux/slice/currentChatSlice'
import { getAll, add } from '../../../indexDB'
import { STORE_NAME_INDEXEDDB } from '../../../constant'
import 'moment/locale/vi'
import { removeNewsMessageNotify } from '../../../redux/slice/notifySlice'
import { socket } from '../../../socket'
import parse from 'html-react-parser'
import { DEFAULT_IMG } from '../../../assets/image'
import ChatHover from '../../ChatHover'

function ChatItem({ conversation }) {
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
        <ChatHover
            className={`${
                toggleMess === conversation._id &&
                'bg-gray-200 dark:bg-gray-700'
            }`}
            onClick={openChat}
        >
            <div className="mr-4 flex-none">
                <Avatar
                    src={conversation?.avatar || DEFAULT_IMG.AVATAR}
                    isNoDot={!!conversation?.avatar}
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="flex-1 font-medium text-gray-700 line-clamp-1 dark:text-gray-200">
                        {conversation?.name}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">
                        {moment(conversation?.createdAt).fromNow(true) || '123'}
                    </p>
                </div>
                <div className="flex-1">
                    <p
                        className={`break-all text-sm line-clamp-1 ${
                            isUnread
                                ? 'text-blue-500'
                                : 'text-gray-500 dark:text-gray-400'
                        }`}
                    >
                        {user._id === conversation?.senderId &&
                            `Bạn: ${parse(
                                conversation?.lastMessage?.text || ''
                            )}`}
                        {user._id !== conversation?.senderId &&
                            `${parse(conversation?.lastMessage?.text || '')}`}
                    </p>
                </div>
            </div>
        </ChatHover>
    )
}

export default memo(ChatItem)
