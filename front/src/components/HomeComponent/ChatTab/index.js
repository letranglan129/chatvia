import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSearchResult } from '../../../redux/slice/dialog/searchResultSlice'
import createAxios from '../../../ulti/createInstance'
import Search from '../Search'
import { SearchResultUser } from '../SearchResult'
import TitleTab from '../TitleTab'
import ChatItemList from './ChatItemList'
import ChatSlider from './ChatSlider'

function ChatTab() {
    const [resultSearch, setResultSearch] = useState()
    const searchResult = useSelector((state) => state.searchResultDialog)
    const { conversation } = useSelector((state) => state.conversation)
    const theme = useSelector((state) => state.theme)
    const dispatch = useDispatch()
    const [searchKey, setSearchKey] = useState('')
    const axios = createAxios()

    const onSubmit = async (searchKey) => {
        setSearchKey(searchKey)
    }

    return (
        <div className={`tab-container ${theme.isHidden ? '' : 'maxWidth'}`}>
            <div className="mb-2 md:mb-4">
                <TitleTab>Tin nhắn</TitleTab>
            </div>

            <Search
                className="mb-2 md:mb-5"
                id="search-chat"
                name="search-chat"
                placeholder="Tìm kiếm cuộc trò chuyện..."
                setResultSearch={setResultSearch}
                onSubmit={onSubmit}
            />
            {searchKey ? (
                <>
                    <div className="mb-2 overflow-hidden">
                        <ChatSlider />
                    </div>
                    <h4 className="mb-2 font-bold text-gray-800 dark:text-gray-200 md:mb-4">
                        Kết quả tìm kiếm: {searchKey}
                    </h4>

                    <ChatItemList keyword={searchKey} />
                </>
            ) : (
                <>
                    <div className="mb-2 overflow-hidden">
                        <ChatSlider />
                    </div>
                    <h4 className="mb-2 font-bold text-gray-800 dark:text-gray-200 md:mb-4">
                        Gần đây
                    </h4>
                    <ChatItemList />
                </>
            )}
        </div>
    )
}

export default ChatTab
