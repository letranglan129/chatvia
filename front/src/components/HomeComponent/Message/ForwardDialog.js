import { useCallback } from 'react'
import { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import 'simplebar/dist/simplebar.min.css'
import { toggleForward } from '../../../redux/slice/dialog/forwardSlice'
import { socket } from '../../../socket'
import Button from '../../Button'
import Dialog from '../../Dialog'
import ListFriendChooses from '../../ListFriendChooses'
import TypeMessage from './TypeMessage'

function ForwardDialog() {
    const [search, setSearch] = useState(null)
    const [resultSearch, setResultSearch] = useState()
    const [chooses, setChooses] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const dispatch = useDispatch()
    const forwardDialog = useSelector((state) => state.forwardDialog)
    const [textMessage, setTextMessage] = useState(
        forwardDialog.forward?.message.text
    )
    const handleClose = useCallback(() => dispatch(toggleForward({})), [])
    const friendList = useSelector((state) => state.friend.list)
    const { user } = useSelector((state) => state.auth.currentUser)

    useEffect(() => {
        if (search) {
            setResultSearch(
                friendList.filter((friend) =>
                    friend.name.toLowerCase().includes(search.toLowerCase())
                )
            )
        }
        if (!search) {
            setResultSearch(friendList)
        }
    }, [search, friendList])

    const handleChoose = (friendId) => {
        const index = friendList.findIndex((item) => item._id === friendId)
        const isExist =
            chooses.findIndex((item) => item._id === friendId) !== -1
        if (isExist) setChooses(chooses.filter((item) => item._id !== friendId))
        else setChooses([...chooses, friendList[index]])
    }

    const handleForward = useCallback(() => {
        chooses.forEach((friend) => {
            socket.emit('chatMessage', {
                type: forwardDialog.forward?.message?.type,
                text: textMessage,
                imageGroup: forwardDialog.forward?.message?.imageGroup || [],
                file: forwardDialog.forward?.message?.file || [],
                senderId: user._id,
                roomId: friend.conversation._id,
            })
        })
        handleClose()
    }, [chooses])

    const handleChangeSearch = useCallback((value) => setSearch(value), [])

    return (
        <Dialog
            isOpen={forwardDialog.forward.isShow}
            className="dialog-lg"
            onRequestClose={handleClose}
        >
            <Dialog.Header handleClose={handleClose}>Chia sẻ</Dialog.Header>

            <div className="p-3">
                <Dialog.Search
                    id="search-forward"
                    name="search-forward"
                    placeholder="Tìm kiếm người chia sẻ..."
                    setResultSearch={setSearch}
                    onChange={handleChangeSearch}
                />
            </div>

            <div className="flex flex-1 flex-col p-3 pt-0">
                <div className="mb-2 dark:text-gray-100">Danh sách bạn bè</div>
                <ListFriendChooses
                    chooses={chooses}
                    handleChoose={handleChoose}
                    list={resultSearch}
                ></ListFriendChooses>
            </div>

            <div className="w-full">
                <div className="border-y p-3 dark:border-y-gray-500">
                    <div className="mb-3 text-sm font-thin leading-none dark:text-gray-100 ">
                        Nội dung chia sẻ
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
                        <div className="max-h-16 flex-1 overflow-auto text-sm font-normal leading-5 dark:text-gray-100">
                            <TypeMessage
                                type={forwardDialog.forward?.message?.type}
                                messInfo={forwardDialog.forward?.message}
                                isTiny={true}
                                contentEditable={isEdit}
                                textState={setTextMessage}
                            />
                        </div>
                        {forwardDialog.forward?.message?.type === 'text' &&
                            !isEdit && (
                                <div className="">
                                    <Button
                                        className="mx-3 !min-w-0 !rounded bg-gray-50 bg-opacity-70 !p-1 text-xs font-semibold text-black shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-purple-600"
                                        onClick={() => setIsEdit(true)}
                                    >
                                        Sửa
                                    </Button>
                                </div>
                            )}
                    </div>
                </div>
            </div>

            <div className="select-none border-t p-3 text-right">
                <Button
                    onClick={handleClose}
                    className="mr-1 !min-w-0 !rounded bg-gray-50 bg-opacity-70 !px-4 !py-2 text-center text-sm font-semibold text-black shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-purple-600"
                >
                    Hủy
                </Button>
                <Button
                    className="min-w-0 !rounded bg-purple-500 !px-4 !py-2 text-center text-sm font-semibold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-purple-600"
                    disabled={chooses.length === 0 ? 'disabled' : ''}
                    onClick={handleForward}
                >
                    Chia sẻ
                </Button>
            </div>
        </Dialog>
    )
}

export default memo(ForwardDialog)
