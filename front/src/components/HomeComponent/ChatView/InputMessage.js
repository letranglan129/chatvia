import { memo, useCallback, useEffect, useRef, useState } from 'react'
import ContentEditable from 'react-contenteditable'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { STATUS_RESPONSE } from '../../../constant'
import { uploadFile } from '../../../services/cloudinary'
import { socket } from '../../../socket'
import { getResourceType } from '../../../ulti'
import ButtonFile from '../../Button/ButtonFile'
import EmojiPicker from './EmojiPicker'

function InputMessage({ setLoadingMessages }) {
    const editMess = useRef()
    const sendBtn = useRef()
    const [chosenEmoji, setChosenEmoji] = useState()
    const { conversation } = useSelector(state => state.currentChat)
    const { user } = useSelector(state => state.auth.currentUser)
    const onEmojiClick = useCallback(
        (event, emojiObject) => setChosenEmoji(emojiObject),
        []
    )

    // Send message to server
    const sendMessage = () => {
        const message = editMess.current.innerHTML
        if (message.trim() === '') return
        socket.emit(
            'chatMessage',
            {
                roomId: conversation._id,
                text: message,
                senderId: user._id,
                name: user.name,
            },
            response => {
                console.log(response)
                if (response.status === STATUS_RESPONSE.success) {
                    editMess.current.innerHTML = ''
                } else {
                    toast.error('Gửi tin nhắn thất bại')
                }
            }
        )
    }

    // Send message when enter key is pressed
    const handlePressEnter = e => {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault()
            sendBtn.current.click()
        }
    }

    // Emoji picker
    useEffect(() => {
        if (chosenEmoji) {
            editMess.current.innerHTML += `<img class="emoji-icon" src='https://projectertest.000webhostapp.com/emoji/${chosenEmoji.unified}.png' onError="this.onError=null;console.clear();this.src='https://twemoji.maxcdn.com/2/72x72/${chosenEmoji.unified}.png'"> `
        }
        editMess.current?.focus()
    }, [chosenEmoji])

    useEffect(() => {
        editMess.current.setAttribute('contenteditable', 'plaintext-only')
        // editMess.current
    }, [])

    const handleChangeImage = async e => {
        setLoadingMessages(true)
        const files = e.target.files
        const listImage = []

        if (files.length === 0) return

        for (let i = 0; i < files.length; i++) {
            const { data } = await uploadFile(files[i])
            listImage.push(data.secure_url)
        }

        socket.emit(
            'chatMessage',
            {
                roomId: conversation._id,
                imageGroup: listImage,
                senderId: user._id,
                type: 'imageGroup',
                name: user.name,
            },
            response => {
                setLoadingMessages(false)
                e.target.value = ''
                if (response.status !== STATUS_RESPONSE.success) {
                    toast.error('Gửi tin nhắn thất bại')
                }
            }
        )
    }

    const handleChangeFile = async e => {
        setLoadingMessages(true)
        const files = e.target.files

        if (files.length === 0) return

        for (let i = 0; i < files.length; i++) {
            const { data } = await uploadFile(files[i])
            socket.emit(
                'chatMessage',
                {
                    roomId: conversation._id,
                    file: {
                        name: data?.original_filename,
                        link: data?.secure_url,
                        size: data?.bytes,
                        type: getResourceType(data?.secure_url, data?.format),
                    },
                    senderId: user._id,
                    name: user.name,
                    type: 'file',
                },
                response => {
                    setLoadingMessages(false)
                    e.target.value = ''
                    if (response.status !== STATUS_RESPONSE.success) {
                        toast.error('Gửi tin nhắn thất bại')
                    }
                }
            )
        }
    }

    return (
        <div className="w-full p-2 border-t border-gray-300 dark:border-gray-500 sm:px-4">
            <div className="flex items-center flex-wrap">
                <div className="flex-1 order-2 md:order-1">
                    <ContentEditable
                        className="editable outline-none rounded-xl break-all p-3 cursor-text bg-gray-500 bg-opacity-25 border-gray-200 text-black dark:text-gray-100"
                        style={{
                            overflow: 'auto',
                            minHeight: '24px',
                            maxHeight: '124px',
                            fontSize: '15px',
                            lineHeight: '24px',
                        }}
                        innerRef={editMess}
                        html={editMess.current?.innerHTML || ''}
                        onKeyPress={handlePressEnter}
                        data-placeholder="Nhập tin nhắn tới Lân"
                    />
                </div>

                <div className="order-1 flex w-full mb-2 md:mb-0 md:order-2 md:w-auto">
                    <div className="md:mx-2">
                        <EmojiPicker handleClick={onEmojiClick} />
                    </div>
                    <div className="md:mx-2">
                        <ButtonFile
                            id="attach-file"
                            onChange={handleChangeFile}
                        >
                            <ion-icon name="attach"></ion-icon>
                        </ButtonFile>
                    </div>
                    <div className="md:mx-2">
                        <ButtonFile
                            onChange={handleChangeImage}
                            id="image-file"
                            accept="image/*"
                        >
                            <ion-icon name="image"></ion-icon>
                        </ButtonFile>
                    </div>
                </div>
                <div
                    className="hover:bg-indigo-700 bg-indigo-500 rounded-lg order-3 p-3 text-xl flex items-center text-gray-100 cursor-pointer ml-10 md:ml-0"
                    onClick={sendMessage}
                    ref={sendBtn}
                >
                    <ion-icon name="send"></ion-icon>
                </div>
            </div>
        </div>
    )
}

export default memo(InputMessage)
