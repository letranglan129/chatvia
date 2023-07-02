import { useCallback } from 'react'
import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeCurrentChat } from '../../../redux/slice/currentChatSlice'
import { toggleCall } from '../../../redux/slice/dialog/callSlice'
import { toogleConversationInfo } from '../../../redux/slice/dialog/conversationInfoSlice'
import { removeAllMessage } from '../../../redux/slice/messageSlice'
import { updateToggleMess } from '../../../redux/slice/viewMessageSlice'
import Button from '../../Button'
import Avatar from '../Avatar'
import { toast } from 'react-toastify'

function Header() {
    const dispatch = useDispatch()
    const { conversation } = useSelector((state) => state.currentChat)
    const theme = useSelector((state) => state.theme)

    const handleReturn = useCallback(() => {
        dispatch(removeAllMessage())
        dispatch(updateToggleMess({ toggleMess: null }))
        dispatch(changeCurrentChat({ _id: null }))
    }, [])

    const handleCallAudioClick = useCallback(() => {
        toast.success("Đang cập nhật")
        // dispatch(toggleCall({ isShow: true, type: 'audio' }))
    }, [])

    const handleCallVideoClick = useCallback(() => {
        toast.success("Đang cập nhật")
        // dispatch(toggleCall({ isShow: true, type: 'video' }))
    }, [])

    const handleEllipsisClick = useCallback(() => {
        dispatch(toogleConversationInfo())
    }, [])

    return (
        <div className="flex h-16 w-full items-center justify-between border-b border-gray-300 p-2 transition-none dark:border-gray-500 sm:px-4 sm:py-2">
            <div className="flex items-center justify-center dark:text-gray-200">
                {theme.isHidden && (
                    <div className="mr-2">
                        <Button
                            circle={true}
                            primary={true}
                            className="button-toggle !h-8 !w-8 !border-0 p-0"
                            onClick={handleReturn}
                        >
                            <div className="flex h-8 w-8 cursor-pointer items-center justify-center">
                                <ion-icon name="chevron-back-sharp"></ion-icon>
                            </div>
                        </Button>
                    </div>
                )}
                <div className="mr-3">
                    <Avatar
                        user={{
                            id: conversation?.receiverId,
                            avatar: conversation.avatar,
                        }}
                    />
                </div>
                <div className="text-semibold line-clamp-1">
                    {conversation?.name || ''}
                </div>
            </div>
            <div className="flex items-center justify-center text-base dark:text-gray-200">
                <div className="icon">
                    <Button
                        circle={true}
                        primary={true}
                        className="button-toggle !h-8 !w-8 !border-0 p-0"
                        onClick={handleCallAudioClick}
                    >
                        <div className="flex h-8 w-8 cursor-pointer items-center justify-center">
                            <ion-icon name="call"></ion-icon>
                        </div>
                    </Button>
                </div>
                <div className="icon">
                    <Button
                        circle={true}
                        primary={true}
                        className="button-toggle mx-2 !h-8 !w-8 !border-0 p-0"
                        onClick={handleCallVideoClick}
                    >
                        <div className="flex h-8 w-8 cursor-pointer items-center justify-center">
                            <ion-icon name="videocam"></ion-icon>
                        </div>
                    </Button>
                </div>
                <div className="icon">
                    <Button
                        circle={true}
                        primary={true}
                        className="button-toggle !h-8 !w-8 !border-0 p-0"
                        onClick={handleEllipsisClick}
                    >
                        <div className="flex h-8 w-8 cursor-pointer items-center justify-center">
                            <ion-icon name="ellipsis-horizontal-sharp"></ion-icon>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default memo(Header)
