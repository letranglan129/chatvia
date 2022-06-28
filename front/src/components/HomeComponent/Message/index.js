import moment from 'moment'
import { memo, useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { MESSAGE_ICON, STORE_NAME_INDEXEDDB } from '../../../constant'
import { set } from '../../../indexDB'
import { updateMessageById } from '../../../redux/messageSlice'
import { socket } from '../../../socket'
import Avatar from '../Avatar'
import ChatOption from './ChatOption'
import Emoji from './Emoji'
import ForwardButton from './ForwardButton'
import TypeMessage from './TypeMessage'

function Message({ messInfo, own, type }) {
    const [hover, setHover] = useState(false)
    const [emoji, setEmoji] = useState(messInfo.emoji)
    const dispatch = useDispatch()

    const formatTime = useCallback(() => {
        const time = messInfo?.time() || undefined
        if (time) return moment(time).format('H:mm')
        else return ''
    }, [])

    useEffect(() => {
        if (emoji) setEmoji(messInfo.emoji)
    }, [messInfo.emoji])

    const handleIncreaseEmoji = key => {
        setEmoji(prev => {
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
                'set-message-emoji',
                {
                    _id: messInfo._id,
                    emoji: newEmojiList,
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

            dispatch(
                updateMessageById({ id: messInfo._id, emoji: newEmojiList })
            )
            return newEmojiList
        })
    }

    return (
        <>
            <div
                className="flex-1 px-4 pb-2"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <div
                    className={`flex ${own ? 'justify-end' : 'justify-start'}`}
                >
                    <Avatar.NotDot
                        src={messInfo.avatar}
                        className={`rounded-full h-10 w-10 ${
                            own ? 'order-2 ml-3' : 'mr-3'
                        }`}
                        alt=""
                    />
                    <div className="flex items-center justify-start overflow-auto order-1">
                        <div
                            className={`sm:p-2 p-2 bg-gray-600 rounded-xl text-gray-100 w-full ${
                                own ? 'order-1' : ''
                            }`}
                        >
                            <span className="my-3">
                                <TypeMessage
                                    type={type}
                                    messInfo={messInfo}
                                />
                            </span>
                            <div className="flex justify-end items-center flex-wrap">
                                <div className="text-right text-xs text-gray-300">
                                    {Object.keys(emoji).length !== 0 && (
                                        <div className="text-sm h-6 p-1 my-2 text-center rounded-full border flex-1 w-full cursor-pointer select-none flex items-center">
                                            {Object.keys(emoji).map(key => (
                                                <img
                                                    alt=""
                                                    key={key}
                                                    src={MESSAGE_ICON[key]}
                                                    className="h-full mx-auto"
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
                        className={`min-w-[150px] flex justify-end ${
                            own ? 'order-[0]' : 'order-1'
                        }`}
                    >
                        {hover && (
                            <div
                                className={`chat-message-action px-0 sm:px-4 w-full flex items-center justify-evenly dark:text-gray-100 rounded-lg ${
                                    own ? 'sm:mr-4 mr-2' : 'sm:ml-4 ml-2'
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
