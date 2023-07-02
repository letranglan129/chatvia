import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AVATAR_GROUP_JSON from '../../../data/create-new-group.json'
import { toast } from 'react-toastify'
import { CONVERSATION_TYPE } from '../../../constant'
import { toggleCreateGroup } from '../../../redux/slice/dialog/createGroupSlice'
import { uploadFile } from '../../../services/cloudinary'
import { socket } from '../../../socket'
import Button from '../../Button'
import Dialog from '../../Dialog'
import ListFriendChooses from '../../ListFriendChooses'
import Tabs from '../../Tab'
import Avatar from '../Avatar'
import { memo } from 'react'
import { debounce } from 'lodash'

function DialogCreateGroup() {
    const dispatch = useDispatch()
    const friendList = useSelector((state) => state.friend.list)
    const createGroupDialog = useSelector((state) => state.createGroupDialog)
    const [search, setSearch] = useState(null)
    const [resultSearch, setResultSearch] = useState()
    const [chooses, setChooses] = useState([])
    const [avatarGroup, setAvatarGroup] = useState(null)
    const [name, setName] = useState()
    const [previewAvatarGroup, setPreviewAvatarGroup] = useState({
        previewURL: '',
    })
    const [loading, setLoading] = useState(false)
    const [listPreviewUpload, setListPreviewUpload] = useState([])
    const [isOpenAvatarDialog, setIsOpenAvatarDialog] = useState(false)
    const avatarGroupData = useRef(AVATAR_GROUP_JSON.avatarGroup)
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
    }, [search])

    const handleChoose = (friendId) => {
        const index = friendList.findIndex((item) => item._id === friendId)
        const isExist =
            chooses.findIndex((item) => item._id === friendId) !== -1
        if (isExist) setChooses(chooses.filter((item) => item._id !== friendId))
        else setChooses([...chooses, friendList[index]])
    }

    const toggleDialog = () => {
        dispatch(toggleCreateGroup())
    }

    const handleChangeImage = async (e) => {
        const imageFile = e.target.files[0]
        var linkAvatar = URL.createObjectURL(imageFile)

        setPreviewAvatarGroup({
            previewURL: linkAvatar,
            isUpload: true,
            file: imageFile,
        })
        setListPreviewUpload((prev) => [...prev, linkAvatar])

        e.target.value = ''
    }

    const handleChooseAvatarPreview = (e) =>
        setPreviewAvatarGroup({
            previewURL: e.target.src,
            isUpload: false,
        })

    const handleChangeSearch = (value) => setSearch(value)

    const handleOpenAvatarDialog = () => setIsOpenAvatarDialog(true)

    const closeChooseAvatarDialog = () => {
        setIsOpenAvatarDialog(false)
        setPreviewAvatarGroup({
            previewURL: '',
            isUpload: false,
        })
        setListPreviewUpload([])
    }

    const handleConfirmAvatar = () => {
        setAvatarGroup(previewAvatarGroup)
        listPreviewUpload.forEach((image) => {
            if (image !== previewAvatarGroup.previewURL)
                URL.revokeObjectURL(image)
        })

        closeChooseAvatarDialog()
    }

    const handleConfirmCreateGroup = async () => {
        setLoading(true)
        let imageUpload
        try {
            if (avatarGroup.hasOwnProperty('file')) {
                const { data } = await uploadFile(avatarGroup.file)
                imageUpload = data.url
            } else {
                imageUpload = avatarGroup.previewURL
            }

            if (!name) toast.error('Vui lòng điền tên nhóm!!!')
            if (chooses.length < 2)
                toast.error('Vui lòng chọn tối thiểu 2 người bạn!!!')

            socket.emit(
                'createGroup',
                {
                    name,
                    members: [user._id, ...chooses.map((friend) => friend._id)],
                    type: CONVERSATION_TYPE.group,
                    avatar: imageUpload,
                    creator: user._id,
                    admin: {
                        own: user._id,
                    },
                },
                (response) => {
                    if (response) {
                        toast.success('Tạo nhóm thành công!!!')
                    } else {
                        toast.error('Đã xảy ra lỗi!!!')
                    }
                    setLoading(false)
                    toggleDialog()
                }
            )
        } catch (error) {}
    }

    return (
        <>
            <Dialog
                isOpen={createGroupDialog.isShow}
                className="dialog-lg"
                onRequestClose={toggleDialog}
            >
                <div className="dialog-lg dark:text-gray-100">
                    <Dialog.Header handleClose={toggleDialog}>
                        Tạo nhóm
                    </Dialog.Header>
                    <div className="flex items-center p-3">
                        <div
                            onClick={handleOpenAvatarDialog}
                            className="flex h-12 w-12 items-center justify-center rounded-full border text-2xl"
                        >
                            <ion-icon name="camera"></ion-icon>
                            <Avatar
                                user={{
                                    id: '',
                                    avatar: avatarGroup?.previewURL,
                                }}
                                isNoDot={true}
                                className={`h-12 w-12 flex-shrink-0 ${
                                    !avatarGroup?.previewURL ? 'hidden' : ''
                                }`}
                            />
                        </div>
                        <input
                            type="text"
                            className="ml-2 flex-1 border-b bg-transparent py-2 text-sm outline-none focus:border-b-purple-700"
                            placeholder="Nhập tên nhóm..."
                            name="name"
                            onChange={debounce(
                                (e) => setName(e.target.value),
                                300
                            )}
                        />
                    </div>

                    <div className="flex flex-1 flex-col p-3 pt-0">
                        <p className="mb-1 text-13">
                            Thêm bạn bè vào nhóm (tối thiểu 2 người bạn)
                        </p>
                        <Dialog.Search
                            id="search-forward"
                            name="search-forward"
                            placeholder="Nhập tên bạn bè..."
                            setResultSearch={setSearch}
                            onChange={handleChangeSearch}
                        />
                        <div className="my-1 dark:text-gray-100">
                            Danh sách bạn bè
                        </div>
                        <ListFriendChooses
                            chooses={chooses}
                            handleChoose={handleChoose}
                            list={resultSearch}
                        />
                    </div>

                    <div className="w-full">
                        <div className="select-none p-3 text-right">
                            <Button
                                className="mr-1 !min-w-0 !rounded bg-gray-50 bg-opacity-70 !px-4 !py-2 text-center text-sm font-semibold text-black shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-purple-600"
                                type="button"
                                disabled={loading}
                                onClick={toggleDialog}
                            >
                                Hủy
                            </Button>
                            <Button
                                className="min-w-0 !rounded bg-purple-500 !px-4 !py-2 text-center text-sm font-semibold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-purple-600"
                                type="button"
                                disabled={
                                    !avatarGroup ||
                                    !name ||
                                    chooses.length < 2 ||
                                    loading
                                }
                                onClick={handleConfirmCreateGroup}
                            >
                                {loading ? 'Đang tạo...' : 'Tạo nhóm'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog
                isOpen={isOpenAvatarDialog}
                className="dialog-center w-[500px] dark:text-gray-100"
                onRequestClose={closeChooseAvatarDialog}
            >
                <Tabs containerClassName="tabs avatar-group">
                    <div label="Chọn ảnh có sẵn">
                        <div className="h-[300px] overflow-y-auto p-4 pb-0">
                            {avatarGroupData.current.map((elemenet, index) => (
                                <div className="mb-4 last:mb-0" key={index}>
                                    <h2 className="mb-1 text-sm font-medium">
                                        {elemenet.title}
                                    </h2>
                                    <div className="avatar-group-available-list">
                                        {elemenet.imgs.map((img, index) => (
                                            <div
                                                className={`avatar-group-available-item ${
                                                    img ===
                                                    previewAvatarGroup.previewURL
                                                        ? 'checked'
                                                        : ''
                                                }`}
                                                key={index}
                                            >
                                                <Avatar
                                                    isNoDot={true}
                                                    className="h-14 w-14"
                                                    user={{
                                                        id: '',
                                                        avatar: img,
                                                    }}
                                                    onClick={
                                                        handleChooseAvatarPreview
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div label="Upload từ máy">
                        <div className="h-[300px] overflow-y-auto p-4 pb-0">
                            <h2 className="mb-1 text-sm font-medium">
                                Ảnh từ máy tính
                            </h2>
                            <div className="avatar-group-available-list">
                                <label className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white">
                                    <ion-icon name="add-outline"></ion-icon>
                                    <input
                                        type="file"
                                        accept=".jpg, .jpeg, .png"
                                        hidden
                                        onChange={handleChangeImage}
                                    />
                                </label>
                                {listPreviewUpload.map((image, index) => (
                                    <div
                                        className={`avatar-group-available-item inline-block ${
                                            image ===
                                            previewAvatarGroup.previewURL
                                                ? 'checked'
                                                : ''
                                        }`}
                                        key={index}
                                    >
                                        <Avatar
                                            isNoDot={true}
                                            className="h-14 w-14"
                                            user={{
                                                id: '',
                                                avatar: image,
                                            }}
                                            onClick={handleChooseAvatarPreview}
                                            alt=""
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div alwayShow={true}>
                        <div className="relative m-4">
                            <img
                                src={previewAvatarGroup.previewURL}
                                className={`aspect-square w-full rounded-full object-cover ${
                                    previewAvatarGroup.previewURL
                                        ? ''
                                        : 'invisible'
                                }`}
                                alt=""
                            />
                        </div>
                    </div>
                </Tabs>

                <div className="w-full border-t dark:border-slate-600">
                    <div className="select-none p-3 text-right">
                        <Button
                            className="mr-1 !min-w-0 !rounded bg-gray-50 bg-opacity-70 !px-4 !py-2 text-center text-sm font-semibold text-black shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-purple-600"
                            type="button"
                            onClick={closeChooseAvatarDialog}
                        >
                            Hủy
                        </Button>
                        <Button
                            className="min-w-0 !rounded bg-purple-500 !px-4 !py-2 text-center text-sm font-semibold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-purple-600"
                            type="button"
                            disabled={!previewAvatarGroup}
                            onClick={handleConfirmAvatar}
                        >
                            Chọn ảnh
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
export default memo(DialogCreateGroup)
