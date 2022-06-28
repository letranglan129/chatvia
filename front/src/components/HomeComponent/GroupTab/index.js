import { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleCreateGroup } from '../../../redux/slice/dialog/createGroupSlice'
import { toggleSearchResult } from '../../../redux/slice/dialog/searchResultSlice'
import createAxios from '../../../ulti/createInstance'
import Button from '../../Button'
import Search from '../Search'
import { SearchResultUser } from '../SearchResult'
import TitleTab from '../TitleTab'
import GroupItemList from './GroupItemList'

function GroupTab() {
    const [resultSearch, setResultSearch] = useState()
    const searchResultDialog = useSelector(state => state.searchResultDialog)
    const theme = useSelector(state => state.theme)
    const dispatch = useDispatch()
    const axios = createAxios()

    const openCreateDialog = () => {
        dispatch(toggleCreateGroup())
    }

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
                <TitleTab> Nhóm </TitleTab>
                <Button
                    primary={true}
                    className="!p-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
                    title="Tạo nhóm mới"
                    onClick={openCreateDialog}
                    leftIcon={<ion-icon name="add-outline"></ion-icon>}
                >
                    Nhóm mới
                </Button>
            </div>
            <Search
                className="mb-5"
                id="search-chat"
                name="search-chat"
                placeholder="Tìm kiếm..."
                setResultSearch={setResultSearch}
                onSubmit={onSubmit}
            />
            {resultSearch && searchResultDialog ? (
                <SearchResultUser results={[resultSearch, setResultSearch]} />
            ) : (
                <GroupItemList arrGr={[]} />
            )}
        </div>
    )
}

export default memo(GroupTab)
