import { memo, useState } from 'react'
import { usePopper } from 'react-popper'
import { useDispatch } from 'react-redux'
import { STORE_NAME_INDEXEDDB } from '../../../constant'
import { del } from '../../../indexDB'
import { updateLastestMessage } from '../../../redux/slice/conversationSlice'
import { removeMessageById } from '../../../redux/slice/messageSlice'
import createAxios from '../../../ulti/createInstance'
import Button from '../../Button'

function ChatOption({ own, idMessage, conversationId }) {
    const [referenceEl, setReferenceEl] = useState()
    const [popperEl, setPopperEl] = useState()
    const dispatch = useDispatch()
    const axios = createAxios()

    const { styles, attributes } = usePopper(referenceEl, popperEl, {
        placement: 'bottom-end',
        modifiers: [
            {
                name: 'flip',
                options: {
                    allowedAutoPlacements: ['bottom-end', 'top-end'],
                },
            },
        ],
    })

    return (
        <div className="chat-option">
            <div className={own ? 'order-1 ' : ''}>
                <div className="chat-option-parent" ref={setReferenceEl}>
                    <Button circle={true} primary={true} className="!w-8 !h-8">
                        <div className="flex">
                            <ion-icon name="ellipsis-vertical"></ion-icon>
                        </div>
                    </Button>
                </div>
                <div
                    className="absolute chat-option-child bg-gray-200 dark:bg-gray-700 w-40 py-1 rounded-lg overflow-hidden"
                    ref={setPopperEl}
                    style={styles.popper}
                    {...attributes.popper}
                >
                    <div
                        onClick={async e => {
                            dispatch(removeMessageById(idMessage))

                            await del(
                                idMessage,
                                conversationId,
                                STORE_NAME_INDEXEDDB
                            )
                            await axios.delete(`/message/${idMessage}`)
                            const { data } = await axios.get(
                                `/conversation/get-conversation/${conversationId}`
                            )
                            dispatch(
                                updateLastestMessage({
                                    conversationId,
                                    type: data?.type,
                                    text: data?.text,
                                    createdAt: data?.createdAt,
                                    updatedAt: data?.updatedAt,
                                    senderId: data?.senderId,
                                })
                            )
                        }}
                        className="flex items-center justify-between py-1 px-3 text-sm  hover:bg-black hover:bg-opacity-10 dark:hover:bg-black dark:hover:bg-opacity-30 cursor-pointer"
                    >
                        <span>Xóa</span>
                        <ion-icon name="trash-sharp"></ion-icon>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(ChatOption)
