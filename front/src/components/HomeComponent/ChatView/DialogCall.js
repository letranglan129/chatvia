import { memo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { toggleCall } from '../../../redux/dialogSlice'

function DialogCall({ hanleCall, typeCall }) {
    const dispatch = useDispatch()
    const dialogRef = useRef()

    // Turn off dialog call when click outside
    const handleOutsideClick = () => dispatch(toggleCall({ isShow: false }))

    return (
        <div className='dialog-container'>
            <div className="overlay" onClick={handleOutsideClick}></div>
            <div
                className="h-full flex m-auto"
                style={{ maxWidth: '400px' }}
                ref={dialogRef}
            >
                <div className="dialog dialog-style items-center bg-gray-50 dark:bg-gray-800 py-20">
                    <div>
                        <img
                            src="https://random.imagecdn.app/200/200"
                            alt=""
                            className="w-20 h-20 mx-auto rounded-full mb-4"
                        />
                        <h2 className="text-xl text-center text-gray-800 dark:text-gray-100 mb-2">
                            Lê Trạng Lân
                        </h2>
                        <p className="text-center text-gray-800 dark:text-gray-400 mb-4">
                            {
                                {
                                    audio: 'Bắt đầu cuộc gọi thoại',
                                    video: 'Bắt đầu cuộc gọi video',
                                }[typeCall]
                            }
                        </p>
                    </div>
                    <div>
                        <button
                            className="call-btn btn-error p-4 rounded-full leading-0 mx-4 text-lg text-white"
                            style={{ background: '#ef476f' }}
                            onClick={() =>
                                dispatch(toggleCall({ isShow: false }))
                            }
                        >
                            <ion-icon name="close-outline"></ion-icon>
                        </button>
                        <button
                            className="call-btn btn-success p-4 rounded-full leading-0 mx-4 text-lg text-white"
                            style={{ background: '#06d6a0' }}
                        >
                            {
                                {
                                    audio: <ion-icon name="call"></ion-icon>,
                                    video: (
                                        <ion-icon name="videocam"></ion-icon>
                                    ),
                                }[typeCall]
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(DialogCall)
