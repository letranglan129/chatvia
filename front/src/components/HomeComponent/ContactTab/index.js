import { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import 'simplebar/dist/simplebar.min.css'
import createAxios from '../../../api/createInstance'
import { toggleSearchResult } from '../../../redux/dialogSlice'
import Search from '../Search'
import { SearchResultUser } from '../SearchResult'
import TitleTab from '../TitleTab'
import List from './List'

function ContactTab() {
    const [resultSearch, setResultSearch] = useState()
	const { searchResult } = useSelector((state) => state.dialog)
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
        <div className={`tab-container ${theme.isHidden ? '' : 'maxWidth'}`} >
            <div className="flex items-center justify-between mb-4">
                <TitleTab>Danh bạ</TitleTab>
                <div
                    className="w-8 h-8 cursor-pointer rounded-full flex items-center justify-center text-2xl dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 hover:bg-opacity-10"
                >
                    <ion-icon name="person-add-outline"></ion-icon>
                </div>
            </div>
            <Search
                className="mb-5"
                id="search-chat"
                name="search-chat"
                placeholder="Tìm kiếm..."
                onSubmit={onSubmit}
                setResultSearch={setResultSearch}
            />
            {resultSearch && searchResult ? (
                <SearchResultUser
                    results={[resultSearch, setResultSearch]}
                />
            ) : (
                <List />
            )}
        </div>
    )
}

export default memo(ContactTab)
