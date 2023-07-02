import { useRef } from 'react'
import { useState } from 'react'
import Modal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import 'simplebar/dist/simplebar.min.css'
import createInstance from '../../../ulti/createInstance'
import { DEFAULT_IMG } from '../../../assets/image'
import { updateInfo } from '../../../redux/slice/authSlice'
import { deleteImage, uploadFile } from '../../../services/cloudinary'
import Avatar from '../Avatar'
import Button from '../../Button'

Modal.setAppElement('#root')

export default function Update({ isOpen, onRequestClose }) {
    const axiosInstance = createInstance()
    const dispacth = useDispatch()
    const [imageFile, setImageFile] = useState()
    const { user } = useSelector((state) => state.auth.currentUser)
    const [name, setName] = useState(user.name)
    const showImageRef = useRef(null)

    const handleChangeImage = async (e) => {
        const imageFile = e.target.files[0]
        setImageFile(imageFile)

        var linkAvatar = URL.createObjectURL(imageFile)
        showImageRef.current.src = linkAvatar
        e.target.value = ''
    }

    const handleUpdateInfo = async () => {
        let resUploadImage
        try {
            if (imageFile) {
                resUploadImage = await uploadFile(imageFile)
                setImageFile(null)
            }

            axiosInstance
                .put(`${process.env.REACT_APP_API_URL}/user/update-info`, {
                    name,
                    avatar: resUploadImage?.data.secure_url || user.avatar,
                })
                .then(async () => {
                    if (user?.avatar) {
                        const avatarSplit = user?.avatar?.split('/')
                        const avatarName =
                            avatarSplit[avatarSplit.length - 1].split('.')[0]

                        await deleteImage(
                            `${process.env.REACT_APP_CLOUDINARY_PRESET_NAME}/${avatarName}`
                        )
                    }

                    dispacth(
                        updateInfo({
                            name,
                            avatar:
                                resUploadImage?.data.secure_url || user.avatar,
                        })
                    )
                })
            toast('Cập nhật ảnh thành công!!!')
        } catch (error) {
            toast('Đã xảy ra lỗi!!!')
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Example Modal"
            overlayClassName="profile-modal-overlay"
            className="profile-modal-content"
        >
            <div>
                <div className="flex items-center justify-between border-b p-4 dark:border-b-gray-500">
                    <h2 className="text-lg">Cập nhật thông tin</h2>
                    <span
                        className="cursor-pointer text-3xl leading-0"
                        onClick={onRequestClose}
                    >
                        <ion-icon name="close-outline"></ion-icon>
                    </span>
                </div>
                <div className="p-4">
                    <div className="mb-4 text-center">
                        <div className="relative mx-auto inline-block">
                            <Avatar
                                isNoDot={true}
                                className="h-32 w-32 rounded-full"
                                id="changeImageProfile"
                                ref={showImageRef}
                                user={user}
                                alt=""
                            />
                            <input
                                type="file"
                                name="changeImage"
                                id="changeImage"
                                hidden
                                onChange={handleChangeImage}
                            />
                            <label
                                htmlFor="changeImage"
                                className="absolute top-3/4 left-2/3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 bg-white leading-0 dark:border-gray-700 dark:bg-gray-500"
                            >
                                <ion-icon name="camera-reverse-outline"></ion-icon>
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">
                            <p className="mb-1 text-sm">Tên hiển thị</p>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            name=""
                            id=""
                            className="w-full rounded-md border px-3 py-2 text-15 focus:border-blue-500 focus:outline-none dark:border-gray-500 dark:bg-gray-700"
                        />
                        <p className="mt-1 text-xs">
                            Sử dụng tên thật để bạn bè dễ dàng nhận diện hơn
                        </p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">
                            <p className="mb-1 text-sm">Email đăng kí</p>
                        </label>
                        <input
                            type="text"
                            value="letranglan129@gmail.com"
                            readOnly
                            name=""
                            id=""
                            className="w-full cursor-not-allowed rounded-md border px-3 py-2 text-15 text-gray-400 focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">
                            <p className="mb-1 text-sm">Số điện đăng kí</p>
                        </label>
                        <input
                            type="text"
                            value="0393673245"
                            readOnly
                            name=""
                            id=""
                            className="w-full cursor-not-allowed rounded-md border px-3 py-2 text-15 text-gray-400 focus:outline-none"
                        />
                    </div>
                    <div className="text-right">
                        <Button
                            className="!min-w-0 !rounded-lg bg-gray-200 !py-1 !px-3 font-medium dark:bg-gray-500 dark:text-white"
                            onClick={onRequestClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleUpdateInfo}
                            className="!min-w-0 !rounded-lg bg-blue-500 !py-1 !px-3 font-medium text-white"
                        >
                            Cập nhật
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
