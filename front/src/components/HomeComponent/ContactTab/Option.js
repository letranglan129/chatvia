import { memo, useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import { useDispatch, useSelector } from 'react-redux'
import createAxios from '../../../ulti/createInstance'
import { STATUS_RESPONSE, STORE_NAME_INDEXEDDB } from '../../../constant'
import { add, getAll } from '../../../indexDB'
import { changeCurrentChat } from '../../../redux/slice/currentChatSlice'
import {
    pushMessage,
    removeAllMessage,
} from '../../../redux/slice/messageSlice'
import { removeNewsMessageNotify } from '../../../redux/slice/notifySlice'
import { toggleDropdown } from '../../../redux/slice/popperSlice'
import { updateToggleMess } from '../../../redux/slice/viewMessageSlice'
import { socket } from '../../../socket'
import OutsideClickHandler from 'react-outside-click-handler'
import { toast } from 'react-toastify'

function Option({ index, friend }) {
    const dispatch = useDispatch()
    const { openDropdownListContact } = useSelector((state) => state.popper)
    const [referenceElement, setReferenceElement] = useState()
    const [popperElememt, setPopperElement] = useState()
    const [isUnread, setIsUnread] = useState(false)
    const { user } = useSelector((state) => state.auth.currentUser)
    const axios = createAxios()
    const { toggleMess } = useSelector((state) => state.viewMessage)
    const { newMessageNotify } = useSelector((state) => state.notify)
    const [state, setState] = useState()

    useEffect(() => {
        const getType = () => {
            if (user?._id === friend._id) return 'ME'

            if (!user?.friends.includes(friend?._id)) {
                if (user._id === friend?.addFriendInfo?.senderId)
                    return 'REVOKE'
                if (user._id === friend?.addFriendInfo?.receiverId)
                    return 'ACCEPT'
                return 'SEND'
            }

            return 'OPEN_CHAT'
        }

        const type = getType()
        setState(type)
    }, [friend])

    const { styles, attributes } = usePopper(referenceElement, popperElememt, {
        placement: 'left-start',
        modifiers: [
            {
                name: 'flip',
                options: {
                    fallbackPlacements: ['top', 'right'],
                },
            },
        ],
    })

    useEffect(() => {
        if (newMessageNotify.includes(friend.conversation._id)) {
            setIsUnread(true)
        }
    }, [newMessageNotify])

    // Click to active chat
    const openChat = async () => {
        if (toggleMess === friend.conversation) return
        dispatch(updateToggleMess({ toggleMess: friend.conversation._id }))
        dispatch(
            changeCurrentChat({ ...friend.conversation, name: friend?.name })
        )
        dispatch(removeAllMessage())
        dispatch(removeNewsMessageNotify(friend.conversation._id))
        dispatch(toggleDropdown(null))
        setIsUnread(false)

        const data = await getAll(friend.conversation._id, STORE_NAME_INDEXEDDB)

        socket.emit(
            'setReadedConversation',
            { conversationId: friend.conversation._id },
            (res) => console.log(res)
        )

        if (data.length !== 0) {
            dispatch(pushMessage(data))
        } else {
            const messages = await axios.get(
                `/message/${friend.conversation._id}`
            )
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
        handleClickOutside()
    }

    const handleClickOutside = () => {
        dispatch(toggleDropdown(-1))
    }

    const deleteFriend = () => {
        socket.emit('handleUser', {
            receiver: friend._id,
            type: 'DELETE_FRIEND',
        })
        handleClickOutside()
    } // Click add friend send notification to friend
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
            (response) => {
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
            (response) => {
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
            (response) => {
                if (response.status === STATUS_RESPONSE.success) {
                    setState('OPEN_CHAT')
                }
            }
        )
    }

    return (
        <>
            <div className="my-2 ml-auto" ref={setReferenceElement}>
                <div
                    className={
                        openDropdownListContact === index
                            ? 'flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-gray-700 dark:bg-gray-100 dark:bg-opacity-20 dark:text-gray-200'
                            : 'flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-gray-700 dark:text-gray-200 dark:hover:bg-gray-100 dark:hover:bg-opacity-20'
                    }
                    onClick={(e) => {
                        dispatch(toggleDropdown(index))
                    }}
                >
                    <ion-icon name="ellipsis-vertical"></ion-icon>
                </div>
            </div>
            {openDropdownListContact === index && (
                <OutsideClickHandler onOutsideClick={handleClickOutside}>
                    <div
                        className={
                            openDropdownListContact
                                ? 'z-10'
                                : 'pointer-events-none invisible'
                        }
                        ref={setPopperElement}
                        style={styles.popper}
                        {...attributes.popper}
                    >
                        <ul className="w-40 overflow-hidden rounded-lg border border-gray-500 bg-gray-100 py-2 dark:bg-gray-800">
                            {
                                {
                                    REVOKE: (
                                        <li
                                            onClick={handleRevokeAddFriend}
                                            className="flex cursor-pointer items-center justify-between py-1 px-3 hover:bg-gray-300 dark:text-gray-400 dark:hover:bg-opacity-5 dark:hover:text-gray-200"
                                        >
                                            <p>Thu hồi yêu cầu kết bạn</p>
                                            <div className="flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{ fill: '#4292ff' }}
                                                    viewBox="0 0 640 512"
                                                >
                                                    <path d="M274.7 304H173.3C77.61 304 0 381.6 0 477.3C0 496.5 15.52 512 34.66 512h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304zM224 256c70.7 0 128-57.31 128-128S294.7 0 224 0C153.3 0 96 57.31 96 128S153.3 256 224 256zM577.9 223.1l47.03-47.03c9.375-9.375 9.375-24.56 0-33.94s-24.56-9.375-33.94 0L544 190.1l-47.03-47.03c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l47.03 47.03l-47.03 47.03c-9.375 9.375-9.375 24.56 0 33.94c9.373 9.373 24.56 9.381 33.94 0L544 257.9l47.03 47.03c9.373 9.373 24.56 9.381 33.94 0c9.375-9.375 9.375-24.56 0-33.94L577.9 223.1z" />
                                                </svg>
                                            </div>
                                        </li>
                                    ),
                                    ACCEPT: (
                                        <li
                                            onClick={handleAcceptFriend}
                                            className="flex cursor-pointer items-center justify-between py-1 px-3 hover:bg-gray-300 dark:text-gray-400 dark:hover:bg-opacity-5 dark:hover:text-gray-200"
                                        >
                                            <p>
                                                Chấp nhận yêu cầu kết bạn từ $
                                                {friend?.name}
                                            </p>
                                            <div className="flex items-center justify-center">
                                                <ion-icon name="person-add"></ion-icon>
                                            </div>
                                        </li>
                                    ),
                                    SEND: (
                                        <li
                                            onClick={handleSendAddFriend}
                                            className="flex cursor-pointer items-center justify-between py-1 px-3 hover:bg-gray-300 dark:text-gray-400 dark:hover:bg-opacity-5 dark:hover:text-gray-200"
                                        >
                                            <p>
                                                Gửi yêu cầu kết bạn đến $
                                                {friend?.name}
                                            </p>
                                            <div className="flex items-center justify-center">
                                                <ion-icon name="person-add"></ion-icon>
                                            </div>
                                        </li>
                                    ),
                                    OPEN_CHAT: (
                                        <li
                                            onClick={openChat}
                                            className="flex cursor-pointer items-center justify-between py-1 px-3 hover:bg-gray-300 dark:text-gray-400 dark:hover:bg-opacity-5 dark:hover:text-gray-200"
                                        >
                                            <p>Trò chuyện</p>
                                            <div className="flex items-center justify-center">
                                                <ion-icon name="person-add"></ion-icon>
                                            </div>
                                        </li>
                                    ),
                                }[state]
                            }
                            {user.friends.includes(friend._id) && (
                                <>
                                    <li
                                        className="flex cursor-pointer items-center justify-between py-1 px-3 hover:bg-gray-300 dark:text-gray-400 dark:hover:bg-opacity-5 dark:hover:text-gray-200"
                                        onClick={deleteFriend}
                                    >
                                        <p>Hủy kết bạn</p>
                                        <div className="flex items-center justify-center">
                                            <ion-icon name="trash-sharp"></ion-icon>
                                        </div>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </OutsideClickHandler>
            )}
        </>
    )
}

export default memo(Option)
