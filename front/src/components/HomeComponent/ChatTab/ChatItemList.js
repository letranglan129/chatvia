import { useState, memo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ChatItem from './ChatItem'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { NotFound } from '../SearchResult'

function ChatItemList({ keyword }) {
    const [activeConversation, setActiveConversation] = useState(null)
    const { conversation } = useSelector((state) => state.conversation)
    const [result, setResult] = useState([])
    useEffect(() => {
        setResult(
            conversation
                ?.filter(
                    (item) =>
                        item?.senderId &&
                        item?.lastMessage?.text &&
                        item?.name
                            ?.toUpperCase()
                            .includes(keyword?.toUpperCase() || '')
                )
                ?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        )
    }, [conversation, keyword])

    return (
        <SimpleBar style={{ height: '200px', flex: 1 }}>
            {result.length > 0 ? (
                result?.map((item, index) => (
                    <ChatItem
                        activeState={[
                            activeConversation,
                            setActiveConversation,
                        ]}
                        conversation={item}
                        key={index}
                    />
                ))
            ) : (
                <NotFound />
            )}
        </SimpleBar>
    )
}

export default memo(ChatItemList)
