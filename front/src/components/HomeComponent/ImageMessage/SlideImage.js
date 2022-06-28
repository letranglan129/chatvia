import { useRef, memo } from 'react'
import Draggable from 'react-draggable'
import { useDispatch, useSelector } from 'react-redux'
import { DEFAULT_IMG, SWIPER_THEME } from '../../../assets/image'
import {
    zoomIn,
    zoomOut,
    reset,
    rotate,
    wheelZoom,
} from '../../../redux/slice/swiperSlice'

function SlideImage({ img }) {
    const nodeRef = useRef(null)
    const dispatch = useDispatch()
    const swiper = useSelector(state => state.swiper)

    const zoomInDispatch = () => dispatch(zoomIn())
    const zoomOutDispatch = () => dispatch(zoomOut())
    const resetDispatch = () => dispatch(reset())
    const rotateDispatch = () => dispatch(rotate())
    const wheelZoomDispatch = e => dispatch(wheelZoom(e.deltaY))

    return (
        <div className="img-box relative w-full h-full">
            <div className="absolute top-4 left-4 z-10 px-2 bg-gray-800 rounded-full flex items-center bg-opacity-50">
                <button
                    onClick={zoomInDispatch}
                    className="text-center px-2 w-10 h-10"
                    title="Phóng to"
                >
                    <img
                        className="control-image"
                        src={SWIPER_THEME.zoomIn}
                        alt="Zoom in"
                    />
                </button>
                <button
                    onClick={zoomOutDispatch}
                    className="text-center px-2 w-10 h-10"
                    title="Thu nhỏ"
                >
                    <img
                        className="control-image"
                        src={SWIPER_THEME.zoomOut}
                        alt="Zoom out"
                    />
                </button>
                <button
                    onClick={resetDispatch}
                    className="text-center px-2 w-10 h-10"
                    title="Đưa về mặc định"
                >
                    <img
                        className="control-image"
                        src={SWIPER_THEME.reset}
                        alt="Reset"
                    />
                </button>
                <button
                    onClick={rotateDispatch}
                    className="text-center px-2 w-10 h-10"
                    title="Xoay"
                >
                    <img
                        className="control-image"
                        src={SWIPER_THEME.rotate}
                        alt="Rotate"
                    />
                </button>
            </div>
            <div className="overflow-hidden border-red-500 flex items-center justify-center w-full h-full">
                <Draggable nodeRef={nodeRef} disabled={!swiper.isDraggable}>
                    <span
                        ref={nodeRef}
                        className="h-full flex items-center justify-center"
                    >
                        <img
                            onWheel={e => wheelZoomDispatch(e)}
                            style={{
                                transform: `scale(${swiper.swiperImage.zoom}) rotate(${swiper.swiperImage.rotate}deg)`,
                                cursor: swiper.isDraggable ? 'move' : 'default',
                                transition: '0.3s',
                            }}
                            className="max-w-full max-h-full"
                            src={img}
                            draggable="false"
                            alt=""
                            onError={e =>
                                (e.target.src = DEFAULT_IMG.ERROR_IMAGE)
                            }
                        />
                    </span>
                </Draggable>
            </div>
        </div>
    )
}

export default memo(SlideImage)
