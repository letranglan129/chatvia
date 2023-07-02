import moment from 'moment'
import { memo, useEffect, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch, useSelector } from 'react-redux'
import 'simplebar/dist/simplebar.min.css'
import { CONVERSATION_BG } from '../../../assets/image'
import {
    loadMoreMessage,
    updateMessageById,
} from '../../../redux/slice/messageSlice'
import { socket } from '../../../socket'
import Message from '../Message'
import _ from 'lodash'

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
    const theme = useSelector((state) => state.theme)

    useEffect(() => {
        socket.on('setMessageEmoji', ({ id, emoji }) => {
            dispatch(updateMessageById({ id, emoji }))
        })
    }, [])

    function groupByDay(array) {
        return array.reduce((result, item) => {
            // Lấy ngày từ trường "createdAt"
            const date = new Date(item.createdAt).toLocaleDateString()

            // Kiểm tra xem nhóm ngày đã tồn tại trong đối tượng nhóm chưa
            if (!result[date]) {
                result[date] = []
            }

            // Thêm phần tử vào nhóm
            result[date].push(item)

            return result
        }, {})
    }

    function groupByCreatedAt(array) {
        if (array.length === 0) return
        const result = []

        // Sắp xếp mảng theo thứ tự tăng dần của createdAt
        array.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

        let group = [array[0]]

        for (let i = 1; i < array.length; i++) {
            const current = array[i]
            const previous = array[i - 1]

            // Tính khoảng thời gian giữa các createdAt
            const timeDiff = Math.abs(
                new Date(current.createdAt) - new Date(previous.createdAt)
            )
            const minutesDiff = Math.floor(timeDiff / (1000 * 60))

            // Kiểm tra nếu khoảng thời gian nhỏ hơn hoặc bằng 10 phút và cùng có cùng senderId
            if (
                minutesDiff <= 10 &&
                current?.senderId._id === previous?.senderId._id
            ) {
                // Thêm vào nhóm hiện tại
                group.push(current)
            } else {
                // Tạo một nhóm mới và thêm vào kết quả
                result.push(group)
                group = [current]
            }
        }

        // Thêm nhóm cuối cùng vào kết quả
        result.push(group)

        return result
    }
    
    return (
        <div
            id="scrollableDiv"
            className="relative flex flex-1 flex-col-reverse overflow-auto bg-cover"
            style={{
                backgroundImage: `url(${
                    theme.colorTheme === 'light'
                        ? CONVERSATION_BG.LIGHT
                        : CONVERSATION_BG.DARK
                })`,
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
                {Object.entries(groupByDay(_.clone(messageCurrent)))?.map(
                    ([key, value], i) => (
                        <div key={key}>
                            <p className="my-2 text-center text-11 text-gray-500 dark:text-gray-300">
                                {moment(key).format('DD/MM/YYYY')}
                            </p>
                            {groupByCreatedAt(_.clone(value)).map((messages) =>
                                messages.map((message, index) => (
                                    <div
                                        key={message._id}
                                        className="message-item"
                                    >
                                        <Message
                                            messInfo={{
                                                ...message,
                                                text:
                                                    ([
                                                        undefined,
                                                        'text',
                                                        'link',
                                                    ].includes(message?.type) &&
                                                        message.text) ||
                                                    '',
                                                listImg:
                                                    (message?.type ===
                                                        'imageGroup' &&
                                                        message.imageGroup) ||
                                                    [],
                                                file:
                                                    (message?.type === 'file' &&
                                                        message.file) ||
                                                    {},
                                                time: () => {
                                                    if (
                                                        index ===
                                                        messages.length - 1
                                                    )
                                                        return message.createdAt
                                                },
                                                emoji: message?.emoji || {},
                                                disableShareButton: true,
                                                disableDeleteButton: true,
                                            }}
                                            createdAt={message.createdAt}
                                            own={
                                                user._id ===
                                                message?.senderId._id
                                            }
                                            type={message?.type || 'text'}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    )
                )}
            </InfiniteScroll>
        </div>
    )
}

export default memo(ContentMessage)
