import { useEffect, useState, useRef, memo } from 'react'
import Picker from 'emoji-picker-react'
import ButtonCircle from '../ButtonCircle'

function EmojiPicker({ handleClick }) {
    const [open, setOpen] = useState(false)
    const pop = useRef(null)
    const el = useRef(null)

    const useDetectOutsideClick = (ref, callback) => {
        const handleClickOutside = e => {
            if (
                ref.every(ref => ref.current && !ref.current.contains(e.target))
            ) {
                return callback()
            }
        }

        //Handle mousedown outside hide Picker
        useEffect(() => {
            document.addEventListener('mousedown', handleClickOutside)
            return () =>
                document.removeEventListener('mousedown', handleClickOutside)
        })

        //Handle resize hide Picker
        useEffect(() => {
            window.addEventListener('resize', () => setOpen(false))
            return () =>
                window.removeEventListener('resize', () => setOpen(false))
        })
    }

    useDetectOutsideClick([el, pop], () => setOpen(false))

    return (
        <div
            className="relative text-xl flex items-center text-gray-900  dark:text-gray-200 cursor-pointer"
            onClick={() => setOpen(true)}
            ref={pop}
        >
            <div className='icon'>
                <ButtonCircle>
                    <div className="flex">
                        <ion-icon name="happy"></ion-icon>
                    </div>
                </ButtonCircle>
                {open && (
                    <div className="absolute bottom-full md:right-0" ref={el}>
                        <Picker
                            onEmojiClick={handleClick}
                            disableSearchBar={true}
                            native={true}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(EmojiPicker)
