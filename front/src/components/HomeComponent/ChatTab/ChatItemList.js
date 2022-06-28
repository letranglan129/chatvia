import { useState, memo } from "react"
import { useSelector } from "react-redux"
import ChatItem from "./ChatItem"
import SimpleBar from "simplebar-react"

function ChatItemList() {
	const [activeConversation, setActiveConversation] = useState(null)
	const { conversation } = useSelector((state) => state.conversation)
	
	return (
		<SimpleBar style={{ height: "300px", flex: 1 }}>
			{conversation?.map((item, index) => (
				<ChatItem
					activeState={[activeConversation, setActiveConversation]}
					conversation={item}
					key={index}
				/>
			))}
		</SimpleBar>
	)
}

export default memo(ChatItemList)
