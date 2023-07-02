import moment from 'moment'
import { useCallback } from 'react'
import { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    CONVERSATION_TYPE,
    MESSAGE_ICON,
    STORE_NAME_INDEXEDDB,
} from '../../../constant'
import { set } from '../../../indexDB'
import { updateMessageById } from '../../../redux/slice/messageSlice'
import { socket } from '../../../socket'
import Avatar from '../Avatar'
import ChatOption from './ChatOption'
import Emoji from './Emoji'
import ForwardButton from './ForwardButton'
import TypeMessage from './TypeMessage'

function Message({ messInfo, own, type }) {
    const [hover, setHover] = useState(false)
    const [emoji, setEmoji] = useState(messInfo.emoji)
    const { conversation } = useSelector((state) => state.currentChat)
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth.currentUser)

    const formatTime = () => {
        const time = messInfo?.time() || undefined
        if (time) return moment(time).format('H:mm')
        else return ''
    }

    useEffect(() => {
        if (emoji) {
            setEmoji(messInfo.emoji)
        }
    }, [messInfo.emoji])

    const handleIncreaseEmoji = useCallback((key) => {
        setEmoji((prev) => {
            let newEmojiList =
                prev[key] === undefined
                    ? { ...prev, [key]: 1 }
                    : { ...prev, [key]: prev[key] + 1 }

            let propertyEmoji = Object.keys(newEmojiList).sort(
                (a, b) => newEmojiList[b] - newEmojiList[a]
            )

            newEmojiList = propertyEmoji.reduce((acc, cur) => {
                acc[cur] = newEmojiList[cur]
                return acc
            }, {})

            socket.emit(
                'setMessageEmoji',
                {
                    _id: messInfo._id,
                    emoji: newEmojiList,
                    room: messInfo.conversationId,
                },
                async ({ status, message }) => {
                    await set(
                        message._id,
                        message,
                        message.conversationId,
                        STORE_NAME_INDEXEDDB
                    )
                }
            )

            return newEmojiList
        })
    }, [])

    return (
        <>
            <div
                className="flex-1 px-4 pb-2"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => setHover(true)}
                onTouchStart={() => setHover(true)}
                onTouchCancel={() => setHover(false)}
                onTouchEnd={() => setHover(false)}
            >
                <div
                    className={`flex flex-nowrap ${
                        own
                            ? 'flex-wrap-reverse justify-end'
                            : 'flex-wrap justify-start'
                    }`}
                >
                    <div
                        className={`relative mb-3 h-max min-w-[40px] ${
                            own ? 'order-2 ml-3' : 'mr-3'
                        }`}
                    >
                        <Avatar
                            isNoDot={true}
                            user={messInfo.senderId}
                            className={`h-10 w-10 rounded-full ${
                                formatTime() ? '' : 'hidden'
                            }`}
                            alt=""
                        />
                        {conversation?.creator?._id === messInfo.senderId && (
                            <span className="absolute top-[27px] right-0 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-yellow-500 opacity-70">
                                <ion-icon name="key-sharp"></ion-icon>
                            </span>
                        )}
                    </div>
                    <div
                        className={` order-1 flex items-center justify-start overflow-hidden`}
                        style={{
                            width: `${type === 'link' ? '240px' : 'auto'}`,
                        }}
                    >
                        <div
                            className={` max-w-full rounded-xl bg-slate-100 p-2 text-black shadow-lg dark:bg-gray-600 dark:text-gray-50 sm:p-2 ${
                                own ? 'order-1 ml-auto' : ''
                            }`}
                        >
                            {conversation?.type !==
                                CONVERSATION_TYPE.personal && (
                                <p className="text-13 text-slate-500 dark:text-slate-300">
                                    {messInfo?.name}
                                </p>
                            )}
                            <TypeMessage type={type} messInfo={messInfo} />
                            <div className="flex flex-wrap items-center justify-end">
                                <div className="text-right text-xs text-gray-500 dark:text-gray-300">
                                    {Object.keys(emoji).length !== 0 && (
                                        <div className="my-2 flex h-6 w-full flex-1 cursor-pointer select-none items-center rounded-full border p-1 text-center text-sm">
                                            {Object.keys(emoji).map((key) => (
                                                <img
                                                    alt=""
                                                    key={key}
                                                    src={MESSAGE_ICON[key]}
                                                    className="mx-auto h-full"
                                                />
                                            ))}
                                            <span className="ml-1">
                                                {Object.values(emoji).reduce(
                                                    (acc, cur) => acc + cur,
                                                    0
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {formatTime()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`flex min-w-[150px] justify-end ${
                            own ? 'order-[0]' : 'order-1'
                        }`}
                    >
                        {hover && (
                            <div
                                className={`chat-message-action flex w-full items-center justify-evenly rounded-lg px-0 dark:text-gray-100 sm:px-4 ${
                                    own ? 'mr-2 sm:mr-4' : 'ml-2 sm:ml-4'
                                }`}
                            >
                                <Emoji
                                    own={own}
                                    handleIncreaseEmoji={handleIncreaseEmoji}
                                />

                                <ForwardButton own={own} message={messInfo} />

                                <ChatOption
                                    own={own}
                                    idMessage={messInfo._id}
                                    conversationId={messInfo.conversationId}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(Message)
