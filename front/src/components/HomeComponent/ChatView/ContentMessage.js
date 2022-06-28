import moment from 'moment'
import { memo, useEffect, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import 'simplebar/dist/simplebar.min.css'
import { CONVERSATION_BG } from '../../../assets/image'
import { loadMoreMessage, updateMessageById } from '../../../redux/slice/messageSlice'
import { socket } from '../../../socket'
import Message from '../Message'

function Loading() {
    return (
        <div className="absolute top-5 flex w-full items-center bg-transparent">
            <div className="mx-auto inline-block rounded-full bg-gray-100 p-1">
                <div className="circle-loading !h-5 !w-5"></div>
            </div>
        </div>
    )
}

function ContentMessage() {
    let { messageCurrent, isHasMore } = useSelector((state) => state.message)
    let tempTime = useRef(new Date().getTime())
    const { user } = useSelector((state) => state.auth.currentUser)
    const dispatch = useDispatch()
    const theme = useSelector(state => state.theme)

    // Calc show time message
    const timeNewMessage = (element, index) => {
        const timeCurrent = new Date(element.createdAt).getDate()
        const timeNext = new Date(
            messageCurrent[
                Math.min(index + 1, messageCurrent.length)
            ]?.createdAt
        ).getDate()

        if (timeCurrent !== timeNext) {
            tempTime.current = element.createdAt
            return tempTime.current
        }
    }

    useEffect(() => {
        socket.on('set-message-emoji', ({id, emoji}) => {
            dispatch(
                updateMessageById({ id, emoji })
            )
        })
    }, [])

    return (
        <div
            id="scrollableDiv"
            className="relative flex flex-1 flex-col-reverse overflow-auto bg-cover"
            style={{
                backgroundImage: `url(${theme.colorTheme === 'light' ? CONVERSATION_BG.LIGHT : CONVERSATION_BG.DARK})`
            }}
        >
            <InfiniteScroll
                dataLength={messageCurrent.length}
                next={() => dispatch(loadMoreMessage())}
                style={{ display: 'flex', flexDirection: 'column-reverse' }}
                inverse={true}
                hasMore={isHasMore && messageCurrent.length !== 0}
                loader={<Loading />}
                scrollableTarget="scrollableDiv"
            >
                {messageCurrent.map((message, index) => (
                    <div key={index} className="message-item">
                        {timeNewMessage(message, index) && (
                            <p className="my-2 text-center text-11 text-gray-500 dark:text-gray-300">
                                {moment(tempTime.current).format(
                                    'H:mm DD/MM/YYYY'
                                )}
                            </p>
                        )}

                        <Message
                            messInfo={{
                                ...message,
                                avatar: 'https://random.imagecdn.app/200/200',
                                message:
                                    ([undefined, 'text'].includes(
                                        message?.type
                                    ) &&
                                        message.text) ||
                                    '',
                                listImg:
                                    (message?.type === 'imageGroup' &&
                                        message.imageGroup) ||
                                    [],
                                file:
                                    (message?.type === 'file' &&
                                        message.file) ||
                                    {},
                                time: () => {
                                    const period = new Date(0).setMinutes(10)
                                    const timeCurrent = new Date(
                                        message.createdAt
                                    ).getTime()
                                    const timeNext = new Date(
                                        messageCurrent[
                                            Math.max(index - 1, 0)
                                        ]?.createdAt
                                    ).getTime()
                                    if (!timeNext || index === 0)
                                        return message.createdAt
                                    if (timeNext - timeCurrent > period)
                                        return message.createdAt
                                },
                                emoji: message?.emoji || {},
                                disableShareButton: true,
                                disableDeleteButton: true,
                            }}
                            createdAt={message.createdAt}
                            own={user._id === message?.senderId}
                            type={message?.type || 'text'}
                        />
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    )
}

export default memo(ContentMessage)
