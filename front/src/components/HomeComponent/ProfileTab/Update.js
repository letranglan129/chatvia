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
    const { user } = useSelector(state => state.auth.currentUser)
    const [name, setName] = useState(user.name)
    const showImageRef = useRef(null)

    const handleChangeImage = async e => {
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
                    const avatarSplit = user.avatar.split('/')
                    const avatarName =
                        avatarSplit[avatarSplit.length - 1].split('.')[0]

                    await deleteImage(
                        `${process.env.REACT_APP_CLOUDINARY_PRESET_NAME}/${avatarName}`
                    )

                    dispacth(
                        updateInfo({
                            name,
                            avatar:
                                resUploadImage?.data.secure_url || user.avatar,
                        })
                    )
                })
            toast('Thanh cong!')
        } catch (error) {
            toast('🦄 Wow so easy!')
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
                <div className="flex items-center justify-between p-4 border-b dark:border-b-gray-500">
                    <h2 className="text-lg">Cập nhật thông tin</h2>
                    <span
                        className="text-3xl leading-0 cursor-pointer"
                        onClick={onRequestClose}
                    >
                        <ion-icon name="close-outline"></ion-icon>
                    </span>
                </div>
                <div className="p-4">
                    <div className="text-center mb-4">
                        <div className="relative inline-block mx-auto">
                            <Avatar
                                isNoDot={true}
                                className="rounded-full w-32 h-32"
                                id="changeImageProfile"
                                ref={showImageRef}
                                src={user.avatar || DEFAULT_IMG.AVATAR}
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
                                className="absolute top-3/4 left-2/3 bg-white dark:bg-gray-500 dark:border-gray-700 cursor-pointer leading-0 w-8 h-8 flex items-center justify-center rounded-full border-2"
                            >
                                <ion-icon name="camera-reverse-outline"></ion-icon>
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">
                            <p className="text-sm mb-1">Tên hiển thị</p>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            name=""
                            id=""
                            className="px-3 py-2 text-15 w-full rounded-md border dark:border-gray-500 focus:outline-none focus:border-blue-500 dark:bg-gray-700"
                        />
                        <p className="text-xs mt-1">
                            Sử dụng tên thật để bạn bè dễ dàng nhận diện hơn
                        </p>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">
                            <p className="text-sm mb-1">Email đăng kí</p>
                        </label>
                        <input
                            type="text"
                            value="letranglan129@gmail.com"
                            readOnly
                            name=""
                            id=""
                            className="px-3 py-2 text-15 w-full rounded-md border focus:outline-none cursor-not-allowed text-gray-400"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="">
                            <p className="text-sm mb-1">Số điện đăng kí</p>
                        </label>
                        <input
                            type="text"
                            value="0393673245"
                            readOnly
                            name=""
                            id=""
                            className="px-3 py-2 text-15 w-full rounded-md border focus:outline-none cursor-not-allowed text-gray-400"
                        />
                    </div>
                    <div className="text-right">
                        <Button
                            className="!py-1 !px-3 !min-w-0 !rounded-lg bg-gray-200 dark:bg-gray-500 dark:text-white font-medium"
                            onClick={onRequestClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleUpdateInfo}
                            className="!py-1 !px-3 !min-w-0 !rounded-lg bg-blue-500 text-white font-medium"
                        >
                            Cập nhật
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
