import { memo, useEffect, useState } from 'react'
import { usePopper } from 'react-popper'
import { useDispatch, useSelector } from 'react-redux'
import createAxios from '../../../ulti/createInstance'
import { STORE_NAME_INDEXEDDB } from '../../../constant'
import { add, getAll } from '../../../indexDB'
import { changeCurrentChat } from '../../../redux/slice/currentChatSlice'
import { pushMessage, removeAllMessage } from '../../../redux/slice/messageSlice'
import { removeNewsMessageNotify } from '../../../redux/slice/notifySlice'
import { toggleDropdown } from '../../../redux/slice/popperSlice'
import { updateToggleMess } from '../../../redux/slice/viewMessageSlice'
import { socket } from '../../../socket'

function Option({ index, friend }) {
    const dispatch = useDispatch()
    const { openDropdownListContact } = useSelector(state => state.popper)
    const [referenceElement, setReferenceElement] = useState()
    const [popperElememt, setPopperElement] = useState()
    const [isUnread, setIsUnread] = useState(false)
    const axios = createAxios()
    const { toggleMess } = useSelector(state => state.viewMessage)
    const { newMessageNotify } = useSelector(state => state.notify)

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
            res => console.log(res)
        )

        if (data.length !== 0) {
            dispatch(pushMessage(data))
        } else {
            const messages = await axios.get(
                `/message/${friend.conversation._id}`
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
            <div className="my-2 ml-auto" ref={setReferenceElement}>
                <div
                    className={
                        openDropdownListContact === index
                            ? 'w-6 h-6 rounded-full flex items-center justify-center cursor-pointer text-gray-700 dark:text-gray-200 dark:bg-gray-100 dark:bg-opacity-20'
                            : 'w-6 h-6 rounded-full flex items-center justify-center cursor-pointer text-gray-700 dark:text-gray-200 dark:hover:bg-gray-100 dark:hover:bg-opacity-20'
                    }
                    onClick={e => {
                        dispatch(toggleDropdown(index))
                    }}
                >
                    <ion-icon name="ellipsis-vertical"></ion-icon>
                </div>
            </div>
            {openDropdownListContact === index && (
                <div
                    className={
                        openDropdownListContact
                            ? 'z-10'
                            : 'invisible pointer-events-none'
                    }
                    ref={setPopperElement}
                    style={styles.popper}
                    {...attributes.popper}
                >
                    <ul className="border border-gray-500 rounded-lg py-2 w-40 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <li
                            onClick={openChat}
                            className="flex items-center justify-between py-1 px-3 cursor-pointer hover:bg-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-opacity-5"
                        >
                            <p>Trò chuyện</p>
                            <div className="flex items-center justify-center">
                                <ion-icon name="chatbubble"></ion-icon>
                            </div>
                        </li>
                        <li className="flex items-center justify-between py-1 px-3 cursor-pointer hover:bg-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-opacity-5">
                            <p>Xóa</p>
                            <div className="flex items-center justify-center">
                                <ion-icon name="trash-sharp"></ion-icon>
                            </div>
                        </li>
                        <li className="flex items-center justify-between py-1 px-3 cursor-pointer hover:bg-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-opacity-5">
                            <p>Chặn</p>
                            <div className="flex items-center justify-center">
                                <ion-icon name="ban-sharp"></ion-icon>
                            </div>
                        </li>
                    </ul>
                </div>
            )}
        </>
    )
}

export default memo(Option)
