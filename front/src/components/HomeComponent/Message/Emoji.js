import { memo, useState } from 'react'
import { usePopper } from 'react-popper'
import { MESSAGE_ICON } from '../../../constant'
import Button from '../../Button'

function Emoji({ own, handleIncreaseEmoji }) {
    const [referenceEl, setReferenceEl] = useState()
    const [popperEl, setPopperEl] = useState()

    const { styles, attributes } = usePopper(referenceEl, popperEl, {
        placement: 'bottom',
        modifiers: [
            {
                name: 'flip',
                options: {
                    allowedAutoPlacements: ['bottom', 'top'],
                },
            },
        ],
    })

    return (
        <div className={own ? 'order-3' : ''}>
            <div className="chat-option">
                <div ref={setReferenceEl}>
                    <Button circle={true} primary={true} className="!w-8 !h-8">
                        <div className="flex">
                            <ion-icon name="happy-outline"></ion-icon>
                        </div>
                    </Button>

                    <div
                        className="flex absolute chat-option-child bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full overflow-hidden"
                        ref={setPopperEl}
                        style={styles.popper}
                        {...attributes.popper}
                    >
                        {Object.keys(MESSAGE_ICON).map((key, index) => (
                            <div
                                key={index}
                                onClick={() => handleIncreaseEmoji(key)}
                                className="w-5 h-5 m-1 transform hover:scale-125 cursor-pointer select-none"
                            >
                                <img alt="" src={MESSAGE_ICON[key]} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Emoji)
