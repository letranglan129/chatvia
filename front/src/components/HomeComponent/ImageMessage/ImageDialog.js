import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSwiperImage } from '../../../redux/slice/dialog/swiperImageSlice'
import Dialog from '../../Dialog'
import ThumbGallery from './ThumbGallery'

function ImageDialog() {
    const { swiperImage } = useSelector(state => state.swiperImageDialog)
    const dispatch = useDispatch()

    // Turn off swiper image
    const closeModal = () => dispatch(toggleSwiperImage({ isShow: false }))

    return (
        <Dialog
            isOpen={swiperImage.isShow}
            onRequestClose={closeModal}
            className="thumb-gallery"
        >
            <div className="relative w-full h-full">
                <div className="absolute h-10 top-0 right-0 left-0 flex items-center justify-end bg-gray-600">
                    <button
                        onClick={closeModal}
                        className="w-10 h-10 text-white flex items-center justify-center hover:bg-gray-900 hover:bg-opacity-50"
                    >
                        <ion-icon
                            style={{ fontSize: '24px' }}
                            name="close-outline"
                        ></ion-icon>
                    </button>
                </div>
                <div className="absolute flex items-center top-10 right-0 bottom-0 left-0">
                    <ThumbGallery />
                </div>
            </div>
        </Dialog>
    )
}

export default memo(ImageDialog)
