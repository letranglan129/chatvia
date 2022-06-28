import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { useMountTransition } from '../../../hooks'
import { toggleForward } from '../../../redux/dialogSlice'
import { socket } from '../../../socket'
import Avatar from '../Avatar'
import Search from '../Search'
import ForwardChecked from './ForwardChecked'
import TypeMessage from './TypeMessage'

function ForwardDialog() {
    const [search, setSearch] = useState(null)
    const [resultSearch, setResultSearch] = useState()
    const [chooses, setChooses] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const dispatch = useDispatch()
    const dialogRef = useRef()
    const { message } = useSelector(state => state.dialog.isOpenForward)
    const [textMessage, setTextMessage] = useState(message.text)
    const handleToggle = () => dispatch(toggleForward({}))
    const friendList = useSelector(state => state.friend.list)
    const { user } = useSelector(state => state.auth.currentUser)
    const hasTransition = useMountTransition(chooses.length > 0, 300)

    useEffect(() => {
        if (search) {
            setResultSearch(
                friendList.filter(friend =>
                    friend.name.toLowerCase().includes(search.toLowerCase())
                )
            )
        }
        if (!search) {
            setResultSearch(friendList)
        }
    }, [search, friendList])

    const handleChoose = friendId => {
        const index = friendList.findIndex(item => item._id === friendId)
        const isExist = chooses.findIndex(item => item._id === friendId) !== -1
        if (isExist) setChooses(chooses.filter(item => item._id !== friendId))
        else setChooses([...chooses, friendList[index]])
    }

    return (
        <>
            <div className='dialog-container'>
                <div className="overlay" onClick={handleToggle}></div>
                <div className="h-full flex items-center justify-center">
                    <div
                        className="dialog dialog-forward flex flex-col bg-gray-50 dark:bg-gray-800 w-full xs:max-w-lg"
                        ref={dialogRef}
                    >
                        <div className="flex items-center justify-between p-3 border-b">
                            <div className="text-lg dark:text-gray-100">
                                Chia sẻ
                            </div>
                            <div
                                className="flex items-center rounded-full cursor-pointer hover:bg-gray-300 dark:text-gray-100 dark:hover:bg-gray-500 p-2"
                                onClick={handleToggle}
                            >
                                <ion-icon name="close-sharp"></ion-icon>
                            </div>
                        </div>
                        <div className="p-3">
                            <Search
                                id="search-forward"
                                name="search-forward"
                                placeholder="Tìm kiếm người chia sẻ..."
                                setResultSearch={setSearch}
                                onChange={value => setSearch(value)}
                            />
                        </div>

                        <div className="flex flex-col flex-1 p-3 pt-0">
                            <div className="mb-2 dark:text-gray-100">
                                Danh sách bạn bè
                            </div>
                            <div className="flex h-full">
                                <div className="flex-1 h-full flex flex-col">
                                    <SimpleBar
                                        style={{ height: '100px', flex: 1 }}
                                    >
                                        {resultSearch?.map(friend => (
                                            <label
                                                key={friend._id}
                                                className="flex items-center cursor-pointer px-2 py-2 dark:hover:bg-gray-900 bg-opacity-25 rounded-md"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="mr-4 flex-shrink-0 cursor-pointer"
                                                    value={friend._id}
                                                    name="forward-friend"
                                                    onChange={() =>
                                                        handleChoose(friend._id)
                                                    }
                                                    checked={
                                                        chooses.findIndex(
                                                            item =>
                                                                item._id ===
                                                                friend._id
                                                        ) !== -1
                                                            ? 'checked'
                                                            : ''
                                                    }
                                                />

                                                <div className="flex items-center">
                                                    <Avatar.NotDot
                                                        className="w-8 h-8 rounded-full"
                                                        src={friend?.avatar}
                                                    />
                                                    <div className="ml-3 dark:text-gray-100 select-none line-clamp-1">
                                                        {friend.name}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </SimpleBar>
                                </div>
                                <div
                                    className={`${
                                        chooses.length > 0 && 'show'
                                    } ${
                                        hasTransition && 'in'
                                    } forward-choose bg-gray-100 w-48 dark:bg-gray-900 rounded-md`}
                                >
                                    <div className="flex flex-col p-2 h-full">
                                        <div className="flex items-center mb-2">
                                            <div className="text-sm dark:text-gray-100 whitespace-nowrap">
                                                Đã chọn
                                            </div>
                                            <div className="text-center text-xs p-1 text-blue-700 bg-blue-200 font-semibold rounded-md ml-2">
                                                {chooses.length}/
                                                {friendList.length}
                                            </div>
                                        </div>
                                        <ForwardChecked
                                            list={chooses}
                                            onChoose={handleChoose}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="p-3 border-t border-b">
                                <div className="text-sm font-thin leading-none mb-3 dark:text-gray-100 ">
                                    Nội dung chia sẻ
                                </div>
                                <div className="p-3 flex items-center justify-between bg-gray-200 dark:bg-gray-700 rounded-lg">
                                    <div className="text-sm leading-5 max-h-16 font-normal overflow-auto dark:text-gray-100 flex-1">
                                        <TypeMessage
                                            type={message?.type}
                                            messInfo={message}
                                            isTiny={true}
                                            contentEditable={isEdit}
                                            textState={setTextMessage}
                                        />
                                    </div>
                                    {message?.type === 'text' && !isEdit && (
                                        <div className="">
                                            <button
                                                className="bg-gray-50 bg-opacity-70 text-black active:bg-purple-600 font-semibold text-sm px-2 p-1 mx-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setIsEdit(true)}
                                            >
                                                Sửa
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-3 text-right select-none">
                                <button
                                    className="text-center bg-gray-50 bg-opacity-70 text-black active:bg-purple-600 font-semibold text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={handleToggle}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="text-center bg-purple-500 text-white active:bg-purple-600 font-semibold text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                                    type="button"
                                    disabled={
                                        chooses.length === 0 ? 'disabled' : ''
                                    }
                                    onClick={() => {
                                        chooses.forEach(friend => {
                                            socket.emit('chatMessage', {
                                                type: message?.type,
                                                text: textMessage,
                                                imageGroup:
                                                    message?.imageGroup || [],
                                                file: message?.file || [],
                                                senderId: user._id,
                                                roomId: friend.conversation._id,
                                            })
                                        })
                                        handleToggle()
                                        toast.success('Chuyển tiếp tin nhắn thành công!!!', {
                                            position: 'bottom-left',
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: false,
                                            draggable: true,
                                            progress: undefined,
                                        })
                                    }}
                                >
                                    Chia sẻ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(ForwardDialog)
