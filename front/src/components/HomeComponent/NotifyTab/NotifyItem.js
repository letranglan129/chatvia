import parse from 'html-react-parser'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import ChatHover from '../../ChatHover'
import { STATUS_RESPONSE } from './../../../constant'
import { socket } from './../../../socket'

export default function NotifyItem({ isReaded, notify }) {
    const dispatch = useDispatch()

    // Click add friend send notification to friend
    const handleAcceptFriend = () => {
        socket.emit(
            'handleUser',
            {
                sender: {
                    id: notify.sender?.id,
                    name: notify.sender?.name,
                },
                receiver: {
                    id: notify.receiver[0]?.id,
                    name: notify.receiver[0]?.name,
                },
                type: 'ACCEPT_FRIEND',
            },

            //  After accept friend successfully, change button open chat conversation
            response => {
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
                    id: notify.sender?.id,
                    name: notify.sender?.name,
                },
                receiver: {
                    id: notify.receiver[0]?.id,
                    name: notify.receiver[0]?.name,
                },
                type: 'REJECT_FRIEND',
            },
            response => {
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
                <div className="flex-none mr-4 relative">
                    <img
                        src="https://random.imagecdn.app/200/200"
                        className="w-16 h-w-16 rounded-full"
                        alt=""
                    />
                    <div
                        style={{
                            background:
                                'linear-gradient(to bottom, #00acee, #0072e0)',
                        }}
                        className="absolute bottom-0 right-0 p-1 text-white rounded-full leading-0"
                    >
                        <ion-icon name="person-add"></ion-icon>
                    </div>
                </div>
                <div className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <div
                            className={`line-clamp-2 flex-1 text-sm ${
                                isReaded
                                    ? 'text-gray-400 dark:text-gray-400'
                                    : 'text-gray-900  dark:text-gray-100'
                            }`}
                        >
                            {parse(notify?.content)}
                        </div>
                        <p
                            className={`text-xs font-semibold ml-5 ${
                                isReaded
                                    ? 'text-gray-400 dark:text-gray-400'
                                    : 'text-blue-500'
                            }`}
                            title={moment(notify?.createdAt).format('HH:mm DD/MM/YYYY')}
                        >
                            {moment(notify?.createdAt).fromNow()}
                        </p>
                    </div>

                    {notify.type === 'ADD_FRIEND' && (
                        <div className="flex">
                            <button
                                style={{ maxWidth: '120px' }}
                                onClick={handleAcceptFriend}
                                className="inline-block flex-1 mr-2 px-4 py-2 bg-blue-500 text-white font-medium text-13 leading-tight uppercase rounded shadow-md hover:bg-blue-600 hover:shadow-lg focus:bg-blue-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                            >
                                Xác nhận
                            </button>
                            <button
                                style={{ maxWidth: '120px' }}
                                onClick={handleRejectFriend}
                                className="inline-block flex-1 ml-2 px-4 py-2 bg-gray-200 text-black font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
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
