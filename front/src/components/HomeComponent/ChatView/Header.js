import { memo } from 'react'
import { useDispatch } from 'react-redux'
import Avatar from '../Avatar'
import ButtonCircle from '../ButtonCircle'
import { updateToggleMess } from '../../../redux/viewMessageSlice'
import { toggleCall } from '../../../redux/dialogSlice'
import { removeAllMessage } from '../../../redux/messageSlice'
import { useSelector } from 'react-redux'
import { changeCurrentChat } from '../../../redux/currentChatSlice'

function Header() {
    const dispatch = useDispatch()
    const { conversation } = useSelector(state => state.currentChat)
    const theme = useSelector(state => state.theme)

    return (
        <div className="w-full flex items-center justify-between p-2 border-b border-gray-300 dark:border-gray-500 sm:px-4 sm:py-2">
            <div className="flex items-center justify-center dark:text-gray-200">
                {theme.isHidden && (
                    <div className="mr-2">
                        <ButtonCircle
                            clickFunc={() => {
                                dispatch(removeAllMessage())
                                dispatch(updateToggleMess({ toggleMess: null }))
                                dispatch(changeCurrentChat({ _id: null }))
                            }}
                        >
                            <div className="cursor-pointer flex w-8 h-8 items-center justify-center">
                                <ion-icon name="chevron-back-sharp"></ion-icon>
                            </div>
                        </ButtonCircle>
                    </div>
                )}
                <div className="mr-3">
                    <Avatar src="https://random.imagecdn.app/200/200" />
                </div>
                <div className="text-semibold line-clamp-1">
                    {conversation?.name || ''}
                </div>
            </div>
            <div className="flex items-center justify-center text-2xl dark:text-gray-200">
                <div className='icon'>
                    <ButtonCircle
                        clickFunc={() => {
                            dispatch(
                                toggleCall({ isShow: true, type: 'audio' })
                            )
                        }}
                    >
                        <div className="cursor-pointer flex w-8 h-8 items-center justify-center">
                            <ion-icon name="call"></ion-icon>
                        </div>
                    </ButtonCircle>
                </div>
                <div className='icon'>
                    <ButtonCircle
                        clickFunc={() => {
                            dispatch(
                                toggleCall({ isShow: true, type: 'video' })
                            )
                        }}
                    >
                        <div className="cursor-pointer flex w-8 h-8 items-center justify-center">
                            <ion-icon name="videocam"></ion-icon>
                        </div>
                    </ButtonCircle>
                </div>
                <div className='icon'>
                    <ButtonCircle>
                        <div className="cursor-pointer flex w-8 h-8 items-center justify-center">
                            <ion-icon name="ellipsis-horizontal-sharp"></ion-icon>
                        </div>
                    </ButtonCircle>
                </div>
            </div>
        </div>
    )
}

export default memo(Header)
