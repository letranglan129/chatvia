import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { DEFAULT_IMG } from '../../../assets/image'
import { STATUS_RESPONSE, STORE_NAME_INDEXEDDB } from '../../../constant'
import { add, getAll } from '../../../indexDB'
import { changeCurrentChat } from '../../../redux/slice/currentChatSlice'
import { pushMessage, removeAllMessage } from '../../../redux/slice/messageSlice'
import { updateToggleMess } from '../../../redux/slice/viewMessageSlice'
import { socket } from '../../../socket'
import createAxios from '../../../ulti/createInstance'
import Button from '../../Button'

function User({ friend, className }) {
    const { user } = useSelector(state => state.auth.currentUser)
    const dispatch = useDispatch()
    const axios = createAxios()
    const [state, setState] = useState()

    useEffect(() => {
        const getType = () => {
            if (user?._id === friend._id) return 'ME'

            if (!user?.friends.includes(friend?._id)) {
                if (user._id === friend?.senderId) return 'REVOKE'
                if (user._id === friend?.receiverId) return 'ACCEPT'
                return 'SEND'
            }

            return 'OPEN_CHAT'
        }

        const type = getType()
        setState(type)
    }, [friend])

    // Click add friend send notification to friend
    const handleSendAddFriend = () => {
        socket.emit(
            'handleUser',
            {
                sender: {
                    id: user?._id,
                    name: user?.name,
                },
                receiver: {
                    id: friend?._id,
                    name: friend?.name,
                },
                type: 'ADD_FRIEND',
            },
            //  After revoke add friend successfully, change button send add friend
            response => {
                if (response.status === STATUS_RESPONSE.success) {
                    setState('REVOKE')
                }
            }
        )
    }

    // Revoke add friend request
    const handleRevokeAddFriend = () => {
        socket.emit(
            'handleUser',
            {
                senderId: user._id,
                receiverId: friend._id,
                type: 'REVOKE_ADD_FRIEND',
            },
            //  After revoke add friend successfully, change button send add friend
            response => {
                if (response.status === STATUS_RESPONSE.success) {
                    toast.success(
                        'Bạn đã thu hồi yêu cầu kết bạn thành công!!!'
                    )
                    setState('SEND')
                }
            }
        )
    }

    const handleAcceptFriend = () => {
        socket.emit(
            'handleUser',
            {
                sender: {
                    id: friend?._id,
                    name: friend?.name,
                },
                receiver: {
                    id: user?._id,
                    name: user?.name,
                },
                type: 'ACCEPT_FRIEND',
            },

            //  After accept friend successfully, change button open chat conversation
            response => {
                if (response.status === STATUS_RESPONSE.success) {
                    setState('OPEN_CHAT')
                }
            }
        )
    }

    const openChat = async () => {
        const conversation = await axios.post(
            `/conversation/get-conversation`,
            {
                friendId: friend._id,
            }
        )

        dispatch(updateToggleMess({ toggleMess: conversation.data._id }))
        dispatch(changeCurrentChat({ ...conversation.data }))
        dispatch(removeAllMessage())

        const data = await getAll(conversation.data._id, STORE_NAME_INDEXEDDB)
        if (data.length !== 0) {
            dispatch(pushMessage(data))
        } else {
            const messages = await axios.get(
                `/message/${conversation.data._id}`
            )
            dispatch(pushMessage(messages.data))
            messages?.data.forEach(
                async message =>
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
        <>
            <div
                className={`flex items-center px-4 py-2 select-none rounded-lg cursor-pointer dark:hover:bg-gray-600 hover:bg-slate-50 ${className}`}
            >
                <img
                    src={friend?.src || DEFAULT_IMG.AVATAR}
                    className="h-10 w-10 rounded-full"
                    alt=""
                />
                <span className="ml-4 dark:text-gray-200">{friend?.name}</span>

                <div className="ml-auto dark:text-gray-200">
                    {
                        {
                            REVOKE: (
                                <Button
                                    onClick={handleRevokeAddFriend}
                                    title="Thu hồi yêu cầu kết bạn!"
                                    circle={true}
                                    primary={true}
                                    className="!w-8 !h-8"
                                >
                                    <div className="h-5 w-5 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{ fill: '#4292ff' }}
                                            viewBox="0 0 640 512"
                                        >
                                            <path d="M274.7 304H173.3C77.61 304 0 381.6 0 477.3C0 496.5 15.52 512 34.66 512h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304zM224 256c70.7 0 128-57.31 128-128S294.7 0 224 0C153.3 0 96 57.31 96 128S153.3 256 224 256zM577.9 223.1l47.03-47.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L544 190.1l-47.03-47.03c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l47.03 47.03l-47.03 47.03c-9.375 9.375-9.375 24.56 0 33.94c9.373 9.373 24.56 9.381 33.94 0L544 257.9l47.03 47.03c9.373 9.373 24.56 9.381 33.94 0c9.375-9.375 9.375-24.56 0-33.94L577.9 223.1z" />
                                        </svg>
                                    </div>
                                </Button>
                            ),
                            ACCEPT: (
                                <Button
                                    onClick={handleAcceptFriend}
                                    title={`Chấp nhận yêu cầu kết bạn từ ${friend?.name}`}
                                    style={{ color: '#4292ff' }}
                                    circle={true}
                                    primary={true}
                                    className="!w-8 !h-8"
                                >
                                    <ion-icon name="person-add"></ion-icon>
                                </Button>
                            ),
                            SEND: (
                                <Button
                                    onClick={handleSendAddFriend}
                                    title={`Gửi yêu cầu kết bạn đến ${friend?.name}`}
                                    circle={true}
                                    primary={true}
                                    className="!w-8 !h-8"
                                >
                                    <ion-icon name="person-add"></ion-icon>
                                </Button>
                            ),
                            OPEN_CHAT: (
                                <Button
                                    onClick={openChat}
                                    title={`Bắt đầu trò chuyện với ${friend?.name}`}
                                    circle={true}
                                    primary={true}
                                    className="!w-8 !h-8"
                                >
                                    <ion-icon name="chatbubble"></ion-icon>
                                </Button>
                            ),
                        }[state]
                    }
                </div>
            </div>
        </>
    )
}

export default User
