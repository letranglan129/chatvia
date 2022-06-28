import parse from 'html-react-parser'
import { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import createAxios from '../../ulti/createInstance'
import {
    NAME_NEW_MESSAGE_INDEXEDDB,
    STATUS_RESPONSE,
    STORE_NAME_INDEXEDDB,
    STORE_NEW_MESSAGE_INDEXEDDB,
} from '../../constant'
import { clear, get, getAll, set } from '../../indexDB'
import { addFriend, getFriendList } from '../../redux/slice/authSlice'
import {
    getConversation,
    updateLoadingStatus,
    updateLastestMessage,
    sortConsersation,
} from '../../redux/slice/conversationSlice'
import { getListFriend } from '../../redux/slice/friendsSlice'
import { pushMessage } from '../../redux/slice/messageSlice'
import { addNewMessageNotify, pushNotify } from '../../redux/slice/notifySlice'
import { socket } from '../../socket'
import { getLastMessage } from '../../ulti'
import Dialog from '../Dialog'
import Loading from '../Loading'
import ChatTab from './ChatTab'
import ChatView from './ChatView'
import ChatWelcome from './ChatWelcome'
import ContactTab from './ContactTab'
import GroupTab from './GroupTab'
import DialogCreateGroup from './GroupTab/DialogCreateGroup'
import NotifyTab from './NotifyTab'
import ProfileTab from './ProfileTab'
import SettingTab from './SettingTab'
import Sidebar from './Sidebar'

function Home() {
    const dispatch = useDispatch()
    const axios = createAxios()
    const [tab, setTab] = useState('chat')
    const createGroupDialog = useSelector(state => state.createGroupDialog)
    const { toggleMess } = useSelector(state => state.viewMessage)
    const { user } = useSelector(state => state.auth.currentUser)
    const { conversation } = useSelector(state => state.currentChat)
    const { isLoading } = useSelector(state => state.conversation)

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
                    dispatch(sortConsersation())
                }

                if (
                    user._id !== data?.senderId &&
                    conversation._id !== data.conversationId
                ) {
                    dispatch(addNewMessageNotify(data.conversationId))
                    dispatch(sortConsersation())
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
                console.log(err);
            } finally {
                dispatch(updateLoadingStatus(false))
            }
        }
        getConversations()
    }, [])

    // Listen event receive notify from server
    useEffect(() => {
        socket.on('receiveNotify', data => {
            if (data) {
                toast(parse(data.content), {
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

    useEffect(() => {
        socket.on('join-new-group', (group) => {
            socket.emit('join-group', group)
            dispatch(getConversation(group))
        })
    }, [])

    return (
        <>
            <div className="flex h-full flex-col lg:flex-row">
                <Sidebar tab={tab} setTab={setTab} />
                {{
                    chat: <ChatTab />,
                    group: <GroupTab />,
                    profile: <ProfileTab />,
                    contact: <ContactTab />,
                    setting: <SettingTab />,
                    notify: <NotifyTab />,
                }[tab] || null}
                {toggleMess ? <ChatView /> : <ChatWelcome />}
            </div>

            {createGroupDialog.isShow && <DialogCreateGroup />}

            <Dialog
                isOpen={isLoading}
                portalClassName="modal-loading"
                className="modal-loading-content"
            >
                <Loading />
            </Dialog>
        </>
    )
}

export default memo(Home)
