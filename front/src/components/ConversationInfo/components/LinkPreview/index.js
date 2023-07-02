import Microlink from '@microlink/react'
import React from 'react'
import { useState } from 'react'
import { usePopper } from 'react-popper'

const LinkPreview = ({ url }) => {
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
                url={url}
                size="small"
                media={['image', 'logo']}
            />
            {isHover && (
                <div className="absolute top-1 right-6 z-20 flex rounded-md bg-white p-[2px]">
                    <div>
                        <button className="flex h-6 w-5 items-center justify-center rounded-md hover:bg-gray-300">
                            <ion-icon name="arrow-redo-outline"></ion-icon>
                        </button>
                    </div>
                    <div ref={setReferenceElement} className="parent ">
                        <button className="flex h-6 w-5 items-center justify-center rounded-md hover:bg-gray-300">
                            <ion-icon name="ellipsis-vertical"></ion-icon>
                        </button>

                        <ul
                            ref={setPopperElement}
                            style={styles.popper}
                            {...attributes.popper}
                            className="children min-w-[150px] overflow-ellipsis rounded-md bg-white py-2 shadow-lg"
                        >
                            <li className="px-4 py-1 text-sm line-clamp-1 hover:bg-gray-200">
                                <button className="flex w-full items-center">
                                    <span className="mr-2 flex text-base">
                                        <ion-icon name="copy-outline"></ion-icon>
                                    </span>
                                    <span>Copy</span>
                                </button>
                            </li>
                            <li className="px-4 py-1 text-sm line-clamp-1 hover:bg-gray-200">
                                <button className="flex w-full items-center">
                                    <span className="mr-2 flex text-base">
                                        <ion-icon name="arrow-redo"></ion-icon>
                                    </span>
                                    <span>Chia sẻ</span>
                                </button>
                            </li>
                            <li className="px-4 py-1 text-sm hover:bg-gray-200">
                                <button className="flex w-full items-center">
                                    <span className="mr-2 flex text-base">
                                        <ion-icon name="earth-outline"></ion-icon>
                                    </span>
                                    <span className="whitespace-nowrap">
                                        Mở trên trình duyệt
                                    </span>
                                </button>
                            </li>
                            <li className="px-4 py-1 text-sm line-clamp-1 hover:bg-gray-200">
                                <button className="flex w-full items-center">
                                    <span className="mr-2 flex text-base">
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
