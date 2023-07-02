import parse from 'html-react-parser'
import { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
    NAME_NEW_MESSAGE_INDEXEDDB,
    STATUS_RESPONSE,
    STORE_NAME_INDEXEDDB,
    STORE_NEW_MESSAGE_INDEXEDDB,
} from '../../constant'
import { clear, del, get, getAll, set } from '../../indexDB'
import { getFriendList, removeFriendId } from '../../redux/slice/authSlice'
import {
    deleteConversation,
    getConversation,
    removeLastMessage,
    replaceConversation,
    sortConsersation,
    updateLastestMessage,
    updateLoadingStatus,
} from '../../redux/slice/conversationSlice'
import { changeCurrentChat } from '../../redux/slice/currentChatSlice'
import { getListFriend, removeFriend } from '../../redux/slice/friendsSlice'
import { pushMessage, removeAllMessage } from '../../redux/slice/messageSlice'
import { addNewMessageNotify, pushNotify } from '../../redux/slice/notifySlice'
import { setOnline } from '../../redux/slice/onlineSlice'
import { updateToggleMess } from '../../redux/slice/viewMessageSlice'
import { socket } from '../../socket'
import { getLastMessage } from '../../ulti'
import createAxios from '../../ulti/createInstance'
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
    const createGroupDialog = useSelector((state) => state.createGroupDialog)
    const { toggleMess } = useSelector((state) => state.viewMessage)
    const { user } = useSelector((state) => state.auth.currentUser)
    const { conversation } = useSelector((state) => state.currentChat)
    const { isLoading } = useSelector((state) => state.conversation)

    // Listen event new message from server
    useEffect(() => {
        socket.emit('joinApp', {
            userId: user._id,
        })
        socket.on('message', async (data) => {
            if (
                data?.type === 'imageGroup' ||
                data?.type === 'file' ||
                data?.type === 'link'
            ) {
                console.log(data)
                socket.emit('getConversation', {
                    conversationId: data.conversationId,
                    userId: user._id,
                })
            }

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
                ).then(async (message) => {
                    if (message)
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
                    else {
                        await clear(
                            NAME_NEW_MESSAGE_INDEXEDDB,
                            STORE_NEW_MESSAGE_INDEXEDDB
                        )
                        getConversations()
                    }
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

    const getConversations = async () => {
        try {
            await clear(NAME_NEW_MESSAGE_INDEXEDDB, STORE_NEW_MESSAGE_INDEXEDDB)
            const res = await axios.get(`/conversation/${user._id}`)
            res.data?.forEach(async (conversation) => {
                if (conversation)
                    return await set(
                        conversation?._id,
                        conversation,
                        NAME_NEW_MESSAGE_INDEXEDDB,
                        STORE_NEW_MESSAGE_INDEXEDDB
                    )
            })
            dispatch(getConversation(res?.data))
        } catch (err) {
            toast.error('Lấy dữ liệu thất bại')
            console.log(err)
        } finally {
            dispatch(updateLoadingStatus(false))
        }
    }

    // Get conversation from IndexedDB/Server
    useEffect(() => {
        socket.emit('getUserOnline', {
            userId: user._id,
        })
        getConversations()
    }, [])

    // Listen event receive notify from server
    useEffect(() => {
        socket.on('receiveNotify', (data) => {
            if (data) {
                toast(parse(data.content), {
                    icon: ({ theme, type }) => (
                        <img
                            src="https://random.imagecdn.app/200/200"
                            className="h-full w-full rounded-full"
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
        socket.emit('getNotify', { userId: user._id }, (response) => {
            if (response?.data) {
                dispatch(pushNotify(response?.data))
            }
        })
    }, [])

    // Listen event accept friend
    useEffect(() => {
        socket.on('acceptFriend', (res) => {
            if (res?.status === STATUS_RESPONSE.success) {
                socket.emit('joinApp', {
                    userId: user._id,
                })
                dispatch(getListFriend())
                socket.emit(
                    'handleUser',
                    {
                        type: 'GET_FRIEND_LIST',
                        userId: user._id,
                    },
                    (response) => {
                        if (response.status === STATUS_RESPONSE.success) {
                            dispatch(getFriendList(response.data))
                        }
                    }
                )
            }
        })

        socket.emit(
            'handleUser',
            {
                type: 'GET_FRIEND_LIST',
                userId: user._id,
            },
            (response) => {
                if (response.status === STATUS_RESPONSE.success) {
                    dispatch(getFriendList(response.data))
                }
            }
        )
    }, [])

    // Get UNREAD message
    useEffect(() => {
        socket.emit('getUnreadMessage', { userId: user._id }, (response) => {
            let conversationUnread = response?.messageUnread.map(
                (item) => item.conversationId
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
        socket.on('joinNewGroup', (group) => {
            socket.emit('joinGroup', group)
            dispatch(getConversation(group))
        })

        socket.emit('getOnline')
        socket.on('responseGetOnline', (response) => {
            dispatch(setOnline(response))
        })

        socket.on('deleteHistoryConversation', async (response) => {
            await clear(response.conversation._id, STORE_NAME_INDEXEDDB)
            dispatch(
                removeLastMessage({ conversationId: response.conversation._id })
            )
            await set(
                response.conversation._id,
                response.conversation,
                NAME_NEW_MESSAGE_INDEXEDDB,
                STORE_NEW_MESSAGE_INDEXEDDB
            )

            if (conversation._id === response.conversation._id) {
                dispatch(updateToggleMess({ toggleMess: null }))
                dispatch(changeCurrentChat({}))
                dispatch(removeAllMessage())
            }
        })

        socket.on('deleteFriend', (result) => {
            dispatch(removeFriendId(result.friendId))
            dispatch(removeFriend(result.friendId))
        })

        socket.on('error', (err) => console.log(err))
    }, [])

    useEffect(() => {
        socket.on('getConversation', async (response) => {
            dispatch(replaceConversation(response))
            await set(
                response._id,
                response,
                NAME_NEW_MESSAGE_INDEXEDDB,
                STORE_NEW_MESSAGE_INDEXEDDB
            )

            if (conversation._id === response._id) {
                dispatch(changeCurrentChat(response))
            }
        })

        socket.on('outGroup', async (result) => {
            console.log(result)
            await clear(result._id, STORE_NAME_INDEXEDDB)
            await del(
                result._id,
                NAME_NEW_MESSAGE_INDEXEDDB,
                STORE_NEW_MESSAGE_INDEXEDDB
            )
            dispatch(deleteConversation(result))

            if (conversation._id === result._id) {
                dispatch(updateToggleMess({ toggleMess: null }))
                dispatch(changeCurrentChat({}))
                dispatch(removeAllMessage())
            }
        })

        return () => {
            socket.removeListener('getConversation')
            socket.removeListener('outGroup')
        }
    }, [conversation])

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
