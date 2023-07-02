import React from 'react'
import { useState } from 'react'
import { usePopper } from 'react-popper'

const ImageVideo = ({ src, onClick }) => {
    const [isHover, setIsHover] = useState(false)
    const [popperElememt, setPopperElement] = useState()
    const [referenceElement, setReferenceElement] = useState()
    const { styles, attributes } = usePopper(referenceElement, popperElememt, {
        placement: 'bottom',
        modifiers: [
            {
                name: 'flip',
                options: {
                    fallbackPlacements: ['top', 'right'],
                },
            },
        ],
    })

    return (
        <div
            className="relative h-[72px] w-[72px] rounded-md"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={onClick}
        >
            {isHover && (
                <div className="absolute inset-0 z-10 cursor-pointer rounded-md bg-black opacity-40"></div>
            )}
            {isHover && (
                <div
                    ref={setReferenceElement}
                    className="parent absolute top-1 right-1 z-20 rounded-md bg-white p-[2px]"
                >
                    <button className="flex h-6 w-5 items-center justify-center rounded-md hover:bg-gray-300">
                        <ion-icon name="ellipsis-vertical"></ion-icon>
                    </button>

                    <ul
                        ref={setPopperElement}
                        style={styles.popper}
                        {...attributes.popper}
                        className="children min-w-[150px] rounded-md bg-white py-2"
                    >
                        <li className="px-4 py-1 text-sm hover:bg-gray-200">
                            <button className="flex items-center justify-center">
                                <span className="mr-2 flex text-base">
                                    <ion-icon name="arrow-redo"></ion-icon>
                                </span>
                                <span>Chia sẻ</span>
                            </button>
                        </li>
                        <li className="px-4 py-1 text-sm hover:bg-gray-200">
                            <button className="flex items-center justify-center">
                                <span className="mr-2 flex text-base">
                                    <ion-icon name="download"></ion-icon>
                                </span>
                                <span>Tải xuống</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
            <img
                className="h-[72px] w-[72px] rounded-md object-cover"
                src={src}
                alt=""
            />
        </div>
    )
}

export default ImageVideo
