import { memo } from 'react'
import { useDispatch } from 'react-redux'
import ButtonCircle from '../ButtonCircle'
import { toggleForward } from '../../../redux/dialogSlice'

function ForwardButton({ own, message }) {
    const dispatch = useDispatch()
	const forwardMessage = {
		...message
	}
	delete forwardMessage.time
    const handleToggle = () => dispatch(toggleForward(forwardMessage))

    return (
        <div className={own ? 'order-2' : ''} onClick={handleToggle}>
            <div className='icon'>
                <ButtonCircle>
                    <div className="flex">
                        <ion-icon name="arrow-redo-outline"></ion-icon>
                    </div>
                </ButtonCircle>
            </div>
        </div>
    )
}

export default memo(ForwardButton)
