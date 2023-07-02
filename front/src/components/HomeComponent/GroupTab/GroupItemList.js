import { memo, useEffect, useState } from 'react'
import GroupItem from './GroupItem'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { useSelector } from 'react-redux'
import { NotFound } from '../SearchResult'

function GroupItemList({ keyword }) {
    const conversations = useSelector(
        (selector) => selector.conversation.conversation
    )
    const [result, setResult] = useState([])
    useEffect(() => {
        setResult(
            conversations.filter(
                (conversation) =>
                    conversation.type === 'GROUP' &&
                    conversation.name
                        ?.toUpperCase()
                        ?.includes(keyword?.toUpperCase() || '')
            )
        )
    }, [conversations, keyword])
    return (
        <SimpleBar style={{ height: '200px', flex: '1' }}>
            {result.length > 0 ? (
                result.map((conversation) => (
                    <GroupItem
                        key={conversation._id}
                        conversation={conversation}
                    />
                ))
            ) : (
                <NotFound />
            )}
        </SimpleBar>
    )
}

export default memo(GroupItemList)
