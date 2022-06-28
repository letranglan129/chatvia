import { memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ThumbGallery from './ThumbGallery'
import { toggleSwiperImage } from '../../../redux/dialogSlice'

function ImageDialog() {
    const { isOpenSwiperImage } = useSelector(state => state.dialog)
    const dispatch = useDispatch()

    // Turn off swiper image
    const handleOutsideClick = () =>
        dispatch(toggleSwiperImage({ isShow: false }))

    return (
        <div className='dialog-container'>
            <div className="overlay" onClick={handleOutsideClick}></div>
            <div className="dialog relative h-full">
                <div className="absolute h-10 top-0 right-0 left-0 flex items-center justify-end bg-gray-600">
                    <button
                        onClick={handleOutsideClick}
                        className="w-10 h-10 text-white flex items-center justify-center hover:bg-gray-900 hover:bg-opacity-50"
                    >
                        <ion-icon
                            style={{ fontSize: '24px' }}
                            name="close-outline"
                        ></ion-icon>
                    </button>
                </div>
                <div className="absolute flex items-center top-10 right-0 bottom-0 left-0">
                    <ThumbGallery
                        activeIndex={isOpenSwiperImage.activeIndex}
                        Imgs={isOpenSwiperImage.listImg}
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(ImageDialog)
