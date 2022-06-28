import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import createAxios from '../../../api/createInstance'
import { toggleSearchResult } from '../../../redux/dialogSlice'
import Search from "../Search"
import { SearchResultUser } from "../SearchResult"
import TitleTab from "../TitleTab"
import ChatItemList from "./ChatItemList"
import ChatSlider from "./ChatSlider"

function ChatTab() {
	const [resultSearch, setResultSearch] = useState()
	const { searchResult } = useSelector((state) => state.dialog)
	const theme = useSelector(state => state.theme)
	const dispatch = useDispatch()
	const axios = createAxios()

	const onSubmit = async (searchKey) => {
		if (!searchKey) {
			setResultSearch(null)
			dispatch(toggleSearchResult(false))
			return 
		}

		const res = await axios.post("/user/search", { query: searchKey })
		setResultSearch(res.data?.user)
		dispatch(toggleSearchResult(true))
	}

	return (
		<div className={`tab-container ${theme.isHidden ? '' : 'maxWidth'}`} >
			<div className='mb-4'>
				<TitleTab>Tin nhắn</TitleTab>
			</div>

			<Search className='mb-5' id='search-chat' name='search-chat' placeholder='Tìm kiếm...' setResultSearch={setResultSearch} onSubmit={onSubmit} />

			{resultSearch && searchResult ? (
				<SearchResultUser results={[resultSearch, setResultSearch]} />
			) : (
				<>
					<div className='overflow-hidden mb-2'>
						<ChatSlider />
					</div>
					<h4 className='font-bold mb-4 text-gray-800 dark:text-gray-200'>Gần đây</h4>
					<ChatItemList />
				</>
			)}
		</div>
	)
}

export default ChatTab
