import React, { useCallback, useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import createAxios from '../../../ulti/createInstance'
import { UserResult } from '../../HomeComponent/SearchResult'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import Search from '../../HomeComponent/Search'

const Members = () => {
    const { conversation } = useSelector((state) => state.currentChat)
    const axios = createAxios()
    const [resultSearch, setResultSearch] = useState([])
    const [search, setSearch] = useState()

    const [members, setMembers] = useState([])

    useEffect(() => {
        const getMembers = async () => {
            try {
                const { data } = await axios.post(`/conversation/get-members`, {
                    members: conversation.members,
                })
                setMembers(data)
                setResultSearch(data)
            } catch (error) {}
        }
        getMembers()
    }, [])

    useEffect(() => {
        if (search) {
            setResultSearch(
                resultSearch.filter((friend) =>
                    friend.name.toLowerCase().includes(search.toLowerCase())
                )
            )
        }
        if (!search) {
            setResultSearch(members)
        }
    }, [search])

    const handleChangeSearch = useCallback((value) => setSearch(value), [])

    return (
        <>
            <div className="absolute inset-0 z-0 bg-white"></div>
            <div className="relative z-10 flex flex-1 flex-col bg-white dark:bg-gray-700">
                <div>
                    <h4 className="px-4 pt-4 pb-2 text-sm font-semibold dark:text-gray-200">
                        Danh sách thành viên ({conversation.members.length})
                    </h4>
                    <div className="mx-4 mb-2 overflow-hidden rounded-full">
                        <Search
                            name="search-members"
                            id="search-members"
                            placeholder="Tìm kiếm thành viên"
                            setResultSearch={setResultSearch}
                            onChange={handleChangeSearch}
                        />
                    </div>
                </div>

                <SimpleBar style={{ flex: 1 }}>
                    {resultSearch.map((member) => (
                        <UserResult
                            friend={member}
                            key={member._id}
                            className="rounded-none"
                        />
                    ))}
                </SimpleBar>
            </div>
        </>
    )
}

export default Members
