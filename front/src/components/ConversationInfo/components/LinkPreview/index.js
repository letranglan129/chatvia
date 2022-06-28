import Microlink from '@microlink/react'
import React from 'react'
import { useState } from 'react'
import { usePopper } from 'react-popper'

const LinkPreview = () => {
    const [isHover, setIsHover] = useState()
    const [popperElememt, setPopperElement] = useState()
    const [referenceElement, setReferenceElement] = useState()
    const { styles, attributes } = usePopper(referenceElement, popperElememt, {
        placement: 'bottom',
        modifiers: [
            {
                name: 'flip',
                options: {
                    fallbackPlacements: ['top-start', 'left'],
                },
            },
        ],
    })

    return (
        <div
            className="link-preview-small relative"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <Microlink
                url="https://www.youtube.com/watch?v=-nyBBEFpkrk"
                size="small"
                media={['image', 'logo']}
            />
            {isHover && (
                <div className="absolute flex rounded-md bg-white top-1 right-6 z-20 p-[2px]">
                    <div>
                        <button className="flex items-center justify-center w-5 h-6 hover:bg-gray-300 rounded-md">
                            <ion-icon name="arrow-redo-outline"></ion-icon>
                        </button>
                    </div>
                    <div ref={setReferenceElement} className="parent ">
                        <button className="flex items-center justify-center w-5 h-6 hover:bg-gray-300 rounded-md">
                            <ion-icon name="ellipsis-vertical"></ion-icon>
                        </button>

                        <ul
                            ref={setPopperElement}
                            style={styles.popper}
                            {...attributes.popper}
                            className="min-w-[150px] bg-white py-2 rounded-md children overflow-ellipsis shadow-lg"
                        >
                            <li className="px-4 py-1 text-sm hover:bg-gray-200 line-clamp-1">
                                <button className="w-full flex items-center">
                                    <span className="flex mr-2 text-base">
                                        <ion-icon name="copy-outline"></ion-icon>
                                    </span>
                                    <span>Copy</span>
                                </button>
                            </li>
                            <li className="px-4 py-1 text-sm hover:bg-gray-200 line-clamp-1">
                                <button className="w-full flex items-center">
                                    <span className="flex mr-2 text-base">
                                        <ion-icon name="arrow-redo"></ion-icon>
                                    </span>
                                    <span>Chia sẻ</span>
                                </button>
                            </li>
                            <li className="px-4 py-1 text-sm hover:bg-gray-200">
                                <button className="w-full flex items-center">
                                    <span className="flex mr-2 text-base">
                                        <ion-icon name="earth-outline"></ion-icon>
                                    </span>
                                    <span className="whitespace-nowrap">
                                        Mở trên trình duyệt
                                    </span>
                                </button>
                            </li>
                            <li className="px-4 py-1 text-sm hover:bg-gray-200 line-clamp-1">
                                <button className="w-full flex items-center">
                                    <span className="flex mr-2 text-base">
                                        <ion-icon name="trash-outline"></ion-icon>
                                    </span>
                                    <span>Xóa</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LinkPreview
