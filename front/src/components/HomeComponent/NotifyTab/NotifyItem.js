import parse from 'html-react-parser'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import ChatHover from '../../ChatHover'
import { STATUS_RESPONSE } from './../../../constant'
import { socket } from './../../../socket'
import Avatar from '../Avatar'

export default function NotifyItem({ isReaded, notify }) {
    const dispatch = useDispatch()

    // Click add friend send notification to friend
    const handleAcceptFriend = () => {
        socket.emit(
            'handleUser',
            {
                sender: {
                    id: notify.sender?._id,
                    name: notify.sender?.name,
                },
                receiver: {
                    id: notify.receiver?._id,
                    name: notify.receiver?.name,
                },
                type: 'ACCEPT_FRIEND',
            },

            //  After accept friend successfully, change button open chat conversation
            (response) => {
                if (response.status === STATUS_RESPONSE.success) {
                    // Update status notify
                    // dispatch(updateNotify({
                    //     content: ,
                    // }))

                    // setState("OPEN_CHAT")
                    return
                }
            }
        )
    }

    const handleRejectFriend = () => {
        socket.emit(
            'handleUser',
            {
                sender: {
                    id: notify.sender?._id,
                    name: notify.sender?.name,
                },
                receiver: {
                    id: notify.receiver?._id,
                    name: notify.receiver?.name,
                },
                type: 'REJECT_FRIEND',
            },
            (response) => {
                if (response.status === STATUS_RESPONSE.success) {
                    // setState("OPEN_CHAT")
                    return
                }
            }
        )
    }

    return (
        <div>
            <ChatHover>
                <div className="relative mr-4 flex-none">
                    <Avatar
                        user={notify.sender}
                        className="h-12 w-12 rounded-full"
                        alt=""
                    />
                    <div
                        style={{
                            background:
                                'linear-gradient(to bottom, #00acee, #0072e0)',
                        }}
                        className="absolute bottom-0 right-0 rounded-full p-1 leading-0 text-white lg:text-13 text-11"
                    >
                        <ion-icon name="person-add"></ion-icon>
                    </div>
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="mb-2 flex items-center justify-between">
                        <div
                            className={`flex-1 text-sm line-clamp-2 ${
                                isReaded
                                    ? 'text-gray-400 dark:text-gray-400'
                                    : 'text-gray-900  dark:text-gray-100'
                            }`}
                        >
                            {parse(notify?.content)}
                        </div>
                        <p
                            className={`ml-5 text-xs font-semibold ${
                                isReaded
                                    ? 'text-gray-400 dark:text-gray-400'
                                    : 'text-blue-500'
                            }`}
                            title={moment(notify?.createdAt).format(
                                'HH:mm DD/MM/YYYY'
                            )}
                        >
                            {moment(notify?.createdAt).fromNow()}
                        </p>
                    </div>

                    {notify.type === 'ADD_FRIEND' && (
                        <div className="flex">
                            <button
                                style={{ maxWidth: '120px' }}
                                onClick={handleAcceptFriend}
                                className="mr-2 inline-block flex-1 rounded bg-blue-500 px-4 py-2 text-13 font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-600 hover:shadow-lg focus:bg-blue-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
                            >
                                Xác nhận
                            </button>
                            <button
                                style={{ maxWidth: '120px' }}
                                onClick={handleRejectFriend}
                                className="ml-2 inline-block flex-1 rounded bg-gray-200 px-4 py-2 text-xs font-medium uppercase leading-tight text-black shadow-md transition duration-150 ease-in-out hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
                            >
                                Xóa
                            </button>
                        </div>
                    )}
                </div>
            </ChatHover>
        </div>
    )
}
