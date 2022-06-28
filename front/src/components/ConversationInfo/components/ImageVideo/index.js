import React from 'react'
import { useState } from 'react'
import { usePopper } from 'react-popper'

const ImageVideo = ({ src }) => {
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
            className="relative w-[72px] h-[72px] rounded-md border border-gray-400 dark:border-gray-400"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {isHover && (
                <div className="absolute inset-0 bg-black opacity-40 z-10 cursor-pointer"></div>
            )}
            {isHover && (
                <div
                    ref={setReferenceElement}
                    className="parent absolute rounded-md bg-white top-1 right-1 z-20 p-[2px]"
                >
                    <button className="flex items-center justify-center w-5 h-6 hover:bg-gray-300 rounded-md">
                        <ion-icon name="ellipsis-vertical"></ion-icon>
                    </button>

                    <ul
                        ref={setPopperElement}
                        style={styles.popper}
                        {...attributes.popper}
                        className="min-w-[150px] bg-white py-2 rounded-md children"
                    >
                        <li className="px-4 py-1 text-sm hover:bg-gray-200">
                            <button className="flex items-center justify-center">
                                <span className="flex mr-2 text-base">
                                    <ion-icon name="arrow-redo"></ion-icon>
                                </span>
                                <span>Chia sẻ</span>
                            </button>
                        </li>
                        <li className="px-4 py-1 text-sm hover:bg-gray-200">
                            <button className="flex items-center justify-center">
                                <span className="flex mr-2 text-base">
                                <ion-icon name="download"></ion-icon>
                                </span>
                                <span>Tải xuống</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}
            <img className="object-cover rounded-md" src={src} alt="" />
        </div>
    )
}

export default ImageVideo
