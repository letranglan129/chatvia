import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { toggleForward } from '../../../redux/slice/dialog/forwardSlice'
import Button from '../../Button'

function ForwardButton({ own, message }) {
    const dispatch = useDispatch()
    const forwardMessage = {
        ...message,
    }
    delete forwardMessage.time
    const handleToggle = () => dispatch(toggleForward(forwardMessage))

    return (
        <div className={own ? 'order-2' : ''} onClick={handleToggle}>
            <div className="icon">
                <Button circle={true} primary={true} className="!w-8 !h-8">
                    <div className="flex">
                        <ion-icon name="arrow-redo-outline"></ion-icon>
                    </div>
                </Button>
            </div>
        </div>
    )
}

export default memo(ForwardButton)
