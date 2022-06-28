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

export default function DialogCreateGroup() {
    const dispatch = useDispatch()
    const friendList = useSelector(state => state.friend.list)
    const createGroupDialog = useSelector(state => state.createGroupDialog)
    const [search, setSearch] = useState(null)
    const [resultSearch, setResultSearch] = useState()
    const [chooses, setChooses] = useState([])
    const [avatarGroup, setAvatarGroup] = useState(null)
    const [name, setName] = useState()
    const [previewAvatarGroup, setPreviewAvatarGroup] = useState({
        previewURL: '',
    })
    const [listPreviewUpload, setListPreviewUpload] = useState([])
    const [isOpenAvatarDialog, setIsOpenAvatarDialog] = useState(false)
    const avatarGroupData = useRef(AVATAR_GROUP_JSON.avatarGroup)
    const { user } = useSelector(state => state.auth.currentUser)

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
    }, [search])

    const handleChoose = useCallback(
        friendId => {
            const index = friendList.findIndex(item => item._id === friendId)
            const isExist =
                chooses.findIndex(item => item._id === friendId) !== -1
            if (isExist)
                setChooses(chooses.filter(item => item._id !== friendId))
            else setChooses([...chooses, friendList[index]])
        },
        [friendList, chooses]
    )

    const toggleDialog = useCallback(() => {
        dispatch(toggleCreateGroup())
    }, [])

    const handleChangeImage = async e => {
        const imageFile = e.target.files[0]
        var linkAvatar = URL.createObjectURL(imageFile)

        setPreviewAvatarGroup({
            previewURL: linkAvatar,
            isUpload: true,
            file: imageFile,
        })
        setListPreviewUpload(prev => [...prev, linkAvatar])

        e.target.value = ''
    }

    const handleChooseAvatarPreview = useCallback(
        e =>
            setPreviewAvatarGroup({
                previewURL: e.target.src,
                isUpload: false,
            }),
        []
    )

    const handleChangeSearch = useCallback(value => setSearch(value), [])
    const handleChangeName = e => setName(e.target.value)

    const handleOpenAvatarDialog = useCallback(
        () => setIsOpenAvatarDialog(true),
        []
    )

    const closeChooseAvatarDialog = useCallback(() => {
        setIsOpenAvatarDialog(false)
        setPreviewAvatarGroup({
            previewURL: '',
            isUpload: false,
        })
        setListPreviewUpload([])
    }, [])

    const handleConfirmAvatar = () => {
        setAvatarGroup(previewAvatarGroup)
        listPreviewUpload.forEach(image => {
            if (image !== previewAvatarGroup.previewURL)
                URL.revokeObjectURL(image)
        })

        closeChooseAvatarDialog()
    }

    const handleConfirmCreateGroup = async () => {
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

            socket.emit('create-group', {
                name,
                members: [user._id, ...chooses.map(friend => friend._id)],
                type: CONVERSATION_TYPE.group,
                avatar: imageUpload,
                creator: user._id,
                admin: {
                    own: user._id,
                },
            })
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
                    <div className="flex p-3 items-center">
                        <div
                            onClick={handleOpenAvatarDialog}
                            className="flex items-center justify-center text-2xl w-12 h-12 border rounded-full"
                        >
                            <ion-icon name="camera"></ion-icon>
                            <Avatar
                                src={avatarGroup?.previewURL}
                                isNoDot={true}
                                className={`w-12 h-12 flex-shrink-0 ${
                                    !avatarGroup?.previewURL ? 'hidden' : ''
                                }`}
                            />
                        </div>
                        <input
                            type="text"
                            className="flex-1 py-2 ml-2 text-sm border-b bg-transparent focus:border-b-purple-700 outline-none"
                            placeholder="Nhập tên nhóm..."
                            name="name"
                            onChange={handleChangeName}
                        />
                    </div>

                    <div className="flex flex-col flex-1 p-3 pt-0">
                        <p className="text-13 mb-1">
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
                        <div className="p-3 text-right select-none">
                            <Button
                                className="text-center bg-gray-50 bg-opacity-70 text-black active:bg-purple-600 font-semibold text-sm !min-w-0 !px-4 !py-2 !rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={toggleDialog}
                            >
                                Hủy
                            </Button>
                            <Button
                                className="min-w-0 !px-4 !py-2 text-sm font-semibold text-center text-white transition-all duration-150 ease-linear bg-purple-500 !rounded shadow outline-none active:bg-purple-600 hover:shadow-md focus:outline-none"
                                type="button"
                                disabled={
                                    !avatarGroup || !name || chooses.length < 2
                                }
                                onClick={handleConfirmCreateGroup}
                            >
                                Tạo nhóm
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
                        <div className="p-4 pb-0 h-[300px] overflow-y-auto">
                            {avatarGroupData.current.map((elemenet, index) => (
                                <div className="mb-4 last:mb-0" key={index}>
                                    <h2 className="text-sm font-medium mb-1">
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
                                                    className="w-14 h-14"
                                                    src={img}
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
                        <div className="p-4 pb-0 h-[300px] overflow-y-auto">
                            <h2 className="text-sm font-medium mb-1">
                                Ảnh từ máy tính
                            </h2>
                            <div className="avatar-group-available-list">
                                <label className="w-14 h-14 bg-blue-600 inline-flex items-center justify-center rounded-full text-2xl text-white">
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
                                            className="w-14 h-14"
                                            src={image}
                                            onClick={handleChooseAvatarPreview}
                                            alt=""
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div alwayShow={true}>
                        <div className="m-4 relative">
                            <img
                                src={previewAvatarGroup.previewURL}
                                className={`w-full rounded-full aspect-square object-cover ${
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
                    <div className="p-3 text-right select-none">
                        <Button
                            className="text-center bg-gray-50 bg-opacity-70 text-black active:bg-purple-600 font-semibold text-sm !min-w-0 !px-4 !py-2 !rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={closeChooseAvatarDialog}
                        >
                            Hủy
                        </Button>
                        <Button
                            className="min-w-0 !px-4 !py-2 text-sm font-semibold text-center text-white transition-all duration-150 ease-linear bg-purple-500 !rounded shadow outline-none active:bg-purple-600 hover:shadow-md focus:outline-none"
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
