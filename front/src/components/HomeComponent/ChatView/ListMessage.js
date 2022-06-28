import moment from 'moment'
import { forwardRef, memo, useCallback, useRef } from 'react'
import Message from '../Message'

const ListMessage = forwardRef(
    ({ messageArr, from, prevFrom, to, userId }, ref) => {
        let tempTime = useRef(new Date().getTime())
        const PERIOD_MESSAGE = useRef(new Date(0).setHours(24))

        // Calc show time message
        const timeNewMessage = useCallback((element, index) => {
            const timeCurrent = new Date(element.createdAt).getTime()
            const data = new Date(tempTime.current).getTime()
            if (index === 0) {
                tempTime.current = element.createdAt
                return tempTime.current
            }

            if (
                tempTime.current &&
                timeCurrent - data > PERIOD_MESSAGE.current
            ) {
                tempTime.current = new Date(timeCurrent)
                return tempTime.current
            }
        }, [])

        return (
            <>
                {messageArr?.slice(from, to).map((message, index, messages) => (
                    <div
                        key={index}
                        ref={
                            (from === prevFrom && prevFrom !== 0) ||
                            (from !== prevFrom && index === prevFrom - from)
                                ? ref
                                : null
                        }
                        className="message-item"
                    >
                        {timeNewMessage(message, index) && (
                            <p className="text-center text-11 my-2 text-gray-500 dark:text-gray-300">
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
                                    const period = new Date(0).setMinutes(5)
                                    const timeCurrent = new Date(
                                        message.createdAt
                                    ).getTime()
                                    const timeNext = new Date(
                                        messages[index + 1]?.createdAt
                                    ).getTime()
                                    if (!timeNext) return message.createdAt
                                    if (timeNext - timeCurrent > period)
                                        return message.createdAt
                                },
                                emoji: message?.emoji || {},
                                disableShareButton: true,
                                disableDeleteButton: true,
                            }}
                            createdAt={message.createdAt}
                            own={userId === message?.senderId}
                            type={message?.type || 'text'}
                        />
                    </div>
                ))}
            </>
        )
    }
)

export default memo(ListMessage)
