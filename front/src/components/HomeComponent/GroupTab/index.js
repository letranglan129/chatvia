import { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import createAxios from '../../../api/createInstance'
import { toggleSearchResult } from '../../../redux/dialogSlice'
import Search from '../Search'
import { SearchResultUser } from '../SearchResult'
import TitleTab from '../TitleTab'
import GroupItemList from './GroupItemList'

function GroupTab() {
    const [resultSearch, setResultSearch] = useState()
    const { searchResult } = useSelector(state => state.dialog)
	const theme = useSelector(state => state.theme)
    const dispatch = useDispatch()
    const axios = createAxios()

    // Submit form
    const onSubmit = async searchKey => {
        if (!searchKey) {
            setResultSearch(null)
            dispatch(toggleSearchResult(false))
            return
        }

        const res = await axios.post('/user/search', { query: searchKey })
        setResultSearch(res.data?.user)
        dispatch(toggleSearchResult(true))
    }

    return (
        <div className={`tab-container ${theme.isHidden ? '' : 'maxWidth'}`} >
            <div className="flex items-center justify-between mb-4">
                <TitleTab> Nhóm </TitleTab>
                <button
                    className="create p-1 text-gray-800 dark:text-gray-200 rounded-lg flex items-center justify-between"
                    title="Tạo nhóm mới"
                >
                    <ion-icon name="add-outline"></ion-icon>
                    Nhóm mới
                </button>
            </div>
            <Search
                className="mb-5"
                id="search-chat"
                name="search-chat"
                placeholder="Tìm kiếm..."
                setResultSearch={setResultSearch}
                onSubmit={onSubmit}
            />
            {resultSearch && searchResult ? (
                <SearchResultUser results={[resultSearch, setResultSearch]} />
            ) : (
                <GroupItemList arrGr={[]} />
            )}
        </div>
    )
}

export default memo(GroupTab)
