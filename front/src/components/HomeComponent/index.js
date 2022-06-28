import parse from 'html-react-parser'
import { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import createAxios from '../../api/createInstance'
import {
    NAME_NEW_MESSAGE_INDEXEDDB,
    STATUS_RESPONSE,
    STORE_NAME_INDEXEDDB,
    STORE_NEW_MESSAGE_INDEXEDDB
} from '../../constant'
import { clear, get, getAll, set } from '../../indexDB'
import { addFriend, getFriendList } from '../../redux/authSlice'
import {
    getConversation,
    updateLastestMessage
} from '../../redux/conversationSlice'
import { getListFriend } from '../../redux/friendsSlice'
import { pushMessage } from '../../redux/messageSlice'
import { addNewMessageNotify, pushNotify } from '../../redux/notifySlice'
import { socket } from '../../socket'
import { getLastMessage } from '../../ulti'
import ChatTab from './ChatTab'
import ChatView from './ChatView'
import DialogCall from './ChatView/DialogCall'
import ChatWelcome from './ChatWelcome'
import ContactTab from './ContactTab'
import GroupTab from './GroupTab'
import ImageDialog from './ImageMessage/ImageDialog'
import ForwardDialog from './Message/ForwardDialog'
import NotifyTab from './NotifyTab'
import ProfileTab from './ProfileTab'
import SettingTab from './SettingTab'
import Sidebar from './Sidebar'

function Home() {
    const dispatch = useDispatch()
    const axios = createAxios()
    const [tab, setTab] = useState('chat')
    const { isOpenForward, isOpenSwiperImage, isOpenCallAudio } = useSelector(
        state => state.dialog
    )
    const { toggleMess } = useSelector(state => state.viewMessage)
    const { user } = useSelector(state => state.auth.currentUser)
    const { conversation } = useSelector(state => state.currentChat)

    // Listen event new message from server
    useEffect(() => {
        socket.on('message', async data => {
            try {
                await set(
                    data._id,
                    data,
                    data.conversationId,
                    STORE_NAME_INDEXEDDB
                )
                get(
                    data.conversationId,
                    NAME_NEW_MESSAGE_INDEXEDDB,
                    STORE_NEW_MESSAGE_INDEXEDDB
                ).then(message => {
                    return set(
                        data.conversationId,
                        {
                            ...message,
                            lastMessage: {
                                text: getLastMessage(data.type, data.text),
                                type: data.type || 'text',
                            },
                            createdAt: data.createdAt,
                            updatedAt: data.updatedAt,
                            senderId: data.senderId,
                        },
                        NAME_NEW_MESSAGE_INDEXEDDB,
                        STORE_NEW_MESSAGE_INDEXEDDB
                    )
                })
                dispatch(updateLastestMessage(data))
                if (conversation._id === data.conversationId) {
                    dispatch(pushMessage(data))
                }

                if (user._id !== data?.senderId && conversation._id !== data.conversationId) {
                    dispatch(addNewMessageNotify(data.conversationId))
                }
            } catch (error) {
                toast.error('Gửi tin nhắn thất bại')
            }
        })
        return () => socket.removeListener('message')
    }, [conversation])

    // Get conversation from IndexedDB/Server
    useEffect(() => {
        const getConversations = async () => {
            try {
                let conversationIDB = await getAll(
                    NAME_NEW_MESSAGE_INDEXEDDB,
                    STORE_NEW_MESSAGE_INDEXEDDB
                )

                if (conversationIDB.length === 0) {
                    await clear(
                        NAME_NEW_MESSAGE_INDEXEDDB,
                        STORE_NEW_MESSAGE_INDEXEDDB
                    )
                    const res = await axios.get(`/conversation/${user._id}`)
                    res.data?.forEach(async conversation => {
                        socket.emit('joinApp', {
                            userId: user._id,
                            roomId: conversation?._id,
                        })
                        if (conversation)
                            return await set(
                                conversation?._id,
                                conversation,
                                NAME_NEW_MESSAGE_INDEXEDDB,
                                STORE_NEW_MESSAGE_INDEXEDDB
                            )
                    })
                    return dispatch(getConversation(res?.data))
                }

                conversationIDB.forEach(conversation =>
                    socket.emit('joinApp', {
                        userId: user._id,
                        roomId: conversation?._id,
                    })
                )

                dispatch(getConversation(conversationIDB))
            } catch (err) {
                toast.error('Lấy dữ liệu thất bại')
            }
        }
        getConversations()
    }, [])

    // Listen event receive notify from server
    useEffect(() => {
        socket.on('receiveNotify', data => {
            if (data) {
                toast(parse(data.content), {
                    position: 'bottom-left',
                    autoClose: 500000,
                    icon: ({ theme, type }) => (
                        <img
                            src="https://random.imagecdn.app/200/200"
                            className="w-full h-full rounded-full"
                            alt=""
                        />
                    ),
                })

                dispatch(pushNotify(data))
            }
        })

        return () => socket.removeListener('receiveNotify')
    }, [])

    // Get notify from DB
    useEffect(() => {
        socket.emit('getNotify', { userId: user._id }, response => {
            if (response?.data) {
                dispatch(pushNotify(response?.data))
            }
        })
    }, [])

    // Listen event accept friend
    useEffect(() => {
        socket.on('acceptFriend', res => {
            if (res?.status === STATUS_RESPONSE.success) {
                dispatch(addFriend(res?.id))
            }
        })

        socket.emit(
            'handleUser',
            {
                type: 'GET_FRIEND_LIST',
                userId: user._id,
            },
            response => {
                if (response.status === STATUS_RESPONSE.success) {
                    dispatch(getFriendList(response.data))
                }
            }
        )
    }, [])

    // Get UNREAD message
    useEffect(() => {
        socket.emit('getUnreadMessage', { userId: user._id }, response => {
            let conversationUnread = response?.messageUnread.map(
                item => item.conversationId
            )
            conversationUnread = [...new Set(conversationUnread)]

            dispatch(addNewMessageNotify(conversationUnread))
        })
    }, [])

    // Get list friend
    useEffect(() => {
        dispatch(getListFriend())
    }, [])

    return (
        <>
            <div className="flex h-full">
                <Sidebar tab={tab} setTab={setTab} />
                {
                    {
                        chat: <ChatTab />,
                        group: <GroupTab />,
                        profile: <ProfileTab />,
                        contact: <ContactTab />,
                        setting: <SettingTab />,
                        notify: <NotifyTab />,
                    }[tab]
                }
                {toggleMess ? <ChatView /> : <ChatWelcome />}
            </div>

            {isOpenForward.isShow && <ForwardDialog />}
            {isOpenSwiperImage.isShow && <ImageDialog />}
            {isOpenCallAudio.isShow && (
                <DialogCall typeCall={isOpenCallAudio.type} />
            )}
        </>
    )
}

export default memo(Home)
