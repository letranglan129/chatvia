import { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'simplebar/dist/simplebar.min.css'
import createAxios from '../../../ulti/createInstance'
import { toggleSearchResult } from '../../../redux/slice/dialog/searchResultSlice'
import Search from '../Search'
import { SearchResultUser } from '../SearchResult'
import TitleTab from '../TitleTab'
import List from './List'
import Button from '../../Button'

function ContactTab() {
    const [resultSearch, setResultSearch] = useState()
    const searchResultDialog = useSelector(state => state.searchResultDialog)
    const theme = useSelector(state => state.theme)
    const axios = createAxios()
    const dispatch = useDispatch()

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
        <div className={`tab-container ${theme.isHidden ? '' : 'maxWidth'}`}>
            <div className="flex items-center justify-between mb-4">
                <TitleTab>Danh bạ</TitleTab>
            </div>
            <Search
                className="mb-5"
                id="search-chat"
                name="search-chat"
                placeholder="Tìm kiếm..."
                onSubmit={onSubmit}
                setResultSearch={setResultSearch}
            />
            {resultSearch && searchResultDialog ? (
                <SearchResultUser results={[resultSearch, setResultSearch]} />
            ) : (
                <List />
            )}
        </div>
    )
}

export default memo(ContactTab)
