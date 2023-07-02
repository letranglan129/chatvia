import React from 'react'
import Avatar from '../HomeComponent/Avatar'
import ForwardChecked from '../HomeComponent/Message/ForwardChecked'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { useDispatch, useSelector } from 'react-redux'
import { useMountTransition } from '../../hooks'
import { memo } from 'react'

const ListFriendChooses = ({ chooses = [], handleChoose, list = [] }) => {
    const friendList = useSelector((state) => state.friend.list)
    const hasTransition = useMountTransition(chooses.length > 0, 300)

    return (
        <div className="flex h-full">
            <div className="flex h-full flex-1 flex-col">
                <SimpleBar style={{ height: '200px', flex: 1 }}>
                    {list?.map((friend) => (
                        <label
                            key={friend._id}
                            className="flex cursor-pointer items-center rounded-md bg-opacity-25 px-2 py-2 dark:hover:bg-gray-900"
                        >
                            <input
                                type="checkbox"
                                className="mr-4 flex-shrink-0 cursor-pointer"
                                value={friend._id}
                                name="forward-friend"
                                onChange={() => handleChoose(friend._id)}
                                checked={
                                    chooses.findIndex(
                                        (item) => item._id === friend._id
                                    ) !== -1
                                        ? 'checked'
                                        : ''
                                }
                            />
            
                            <div className="flex items-center">
                                <Avatar
                                    className="h-8 w-8 rounded-full"
                                    user={{
                                        id: friend._id,
                                        avatar: friend.avatar,
                                    }}
                                />
                                <div className="ml-3 select-none line-clamp-1 dark:text-gray-100">
                                    {friend.name}
                                </div>
                            </div>
                        </label>
                    ))}
                </SimpleBar>
            </div>
            <div
                className={`${chooses.length > 0 && 'show'} ${
                    hasTransition && 'in'
                } forward-choose w-48 rounded-md bg-gray-100 dark:bg-gray-900`}
            >
                <div className="flex h-full flex-col p-2">
                    <div className="mb-2 flex items-center">
                        <div className="whitespace-nowrap text-sm dark:text-gray-100">
                            Đã chọn
                        </div>
                        <div className="ml-2 rounded-md bg-blue-200 p-1 text-center text-xs font-semibold text-blue-700">
                            {chooses.length}/{friendList.length}
                        </div>
                    </div>
                    <ForwardChecked list={chooses} onChoose={handleChoose} />
                </div>
            </div>
        </div>
    )
}

export default memo(ListFriendChooses)
