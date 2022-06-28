import {
    useEffect,
    useRef, useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import {
    STORE_NAME_INDEXEDDB
} from '../../../constant'
import { set } from '../../../indexDB'
import { loadMoreMessage } from '../../../redux/messageSlice'
import ListMessage from './ListMessage'

function ContentMessage({ loadingMessage }) {
    const dispatch = useDispatch()
    const simpleBar = useRef()
    const messageLastEl = useRef()
    const [showScrollToBottom, setShowScrollToBottom] = useState(false)
    let { messageArr, to, from, prevFrom } = useSelector(state => state.message)
    const { user } = useSelector(state => state.auth.currentUser)
    const currentChat = useSelector(state => state.currentChat.conversation)
    const [isLoading, setIsLoading] = useState(false)
    const [length, setLength] = useState(0)
    const [count, setCount] = useState(0)
    const [countLoadedImage, setCountLoadedImage] = useState(0)

    // Save message to IndexedDB
    useEffect(() => {
        const setMessageIndexedDB = async () => {
            for (let message of messageArr) {
                await set(
                    message._id,
                    message,
                    message.conversationId,
                    STORE_NAME_INDEXEDDB
                )
            }
        }
        setMessageIndexedDB()
    }, [])

    useEffect(() => {
        setCount(0)
    }, [currentChat])

    // Scroll to bottom when chat dialog active or new message
    useEffect(() => {
        if (countLoadedImage <= length) {
            setIsLoading(true)
            simpleBar.current.scrollTop = simpleBar.current?.scrollHeight
        }
    }, [length, countLoadedImage])

    useEffect(() => {
        if (messageArr.length !== 0 && count === 0) {
            simpleBar.current.scrollTop = simpleBar.current?.scrollHeight
            setCount(1)
        }
    }, [messageArr])

    // Load more message
    useEffect(() => {
        function handleScroll() {
            if (this.scrollTop <= 50) {
                if (!messageLastEl.current) return
                messageLastEl.current?.scrollIntoView()
                dispatch(loadMoreMessage())
            }

            setShowScrollToBottom(
                this.scrollTop + 2 * this.clientHeight < this.scrollHeight
            )
        }

        simpleBar.current.addEventListener('scroll', handleScroll)

        return () =>
            simpleBar.current?.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (showScrollToBottom) {
            const scrollToBottomButton = document.createElement('div')
            scrollToBottomButton.className = 'scroll-to-bottom-btn'
            scrollToBottomButton.innerHTML =
                '<ion-icon name="arrow-down-outline"></ion-icon>'
            scrollToBottomButton.addEventListener('click', function () {
                simpleBar.current.scroll({
                    top: simpleBar.current.scrollHeight,
                })
            })
            simpleBar.current.parentElement.appendChild(scrollToBottomButton)
        } else {
            setShowScrollToBottom(false)
            const scrollToBottomButton = document.querySelector(
                '.scroll-to-bottom-btn'
            )
            if (scrollToBottomButton) scrollToBottomButton.remove()
        }
    }, [showScrollToBottom])

    useEffect(() => {
        const imageList = []

        const load = image => {
            return new Promise((resolve, reject) => {
                const loadImg = new Image()
                loadImg.src = image
                loadImg.onload = () => resolve(image)

                loadImg.onerror = err => reject(err)
            })
        }

        const loadImage = () => {
            let list = messageArr
                ?.slice(from, to)
                .filter(message => message.type === 'imageGroup')
            list.forEach(message => imageList.push(...message.imageGroup))
        }

        loadImage()

        setLength(imageList.length)

        Promise.all(imageList.map(image => load(image)))
            .then()
            .catch(err => {
                toast.error('Cannot load image')
            })
    }, [messageArr])

    return (
        <SimpleBar
            style={{ height: '50px', flex: 1 }}
            className="relative"
            scrollableNodeProps={{ ref: simpleBar }}
        >
            <div
                className={`${isLoading ? 'min-w-[420px]' : 'hidden'}`}
                onLoad={e => {
                    if (
                        e.target.classList.contains('message-image') &&
                        countLoadedImage <= length
                    )
                        setCountLoadedImage(prev => prev + 1)
                }}
                onError={e => {
                    if (
                        e.target.classList.contains('message-image') &&
                        countLoadedImage <= length
                    )
                        setCountLoadedImage(prev => prev + 1)
                }}
            >
                <ListMessage
                    messageArr={messageArr}
                    from={from}
                    prevFrom={prevFrom}
                    to={to}
                    userId={user?._id}
                    ref={messageLastEl}
                />
            </div>

            {loadingMessage && (
                <div className="text-white">Loading message</div>
            )}
        </SimpleBar>
    )
}

export default ContentMessage
