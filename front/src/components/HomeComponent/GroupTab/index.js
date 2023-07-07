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
    const [searchKey, setSearchKey] = useState('')
    const dispatch = useDispatch()
    const axios = createAxios()

    const openCreateDialog = () => {
        dispatch(toggleCreateGroup())
    }

    // Submit form
    const onSubmit = async searchKey => {
        setSearchKey(searchKey)
    }

    return (
        <div className={`tab-container ${theme.isHidden ? '' : 'maxWidth'}`}>
            <div className="mb-4 flex items-center justify-between">
                <TitleTab> Nhóm </TitleTab>
                <Button
                    primary={true}
                    className="rounded-lg bg-gray-200 !p-1 text-sm text-gray-800 dark:bg-gray-600 dark:text-gray-200"
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
                placeholder="Tìm kiếm nhóm chat hiện có..."
                setResultSearch={setResultSearch}
                onSubmit={onSubmit}
            />
            {searchKey ? (
                <GroupItemList keyword={searchKey} />
            ) : (
                <GroupItemList />
            )}
        </div>
    )
}

export default memo(GroupTab)
