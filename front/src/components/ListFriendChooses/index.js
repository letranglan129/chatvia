import React from 'react'
import Avatar from '../HomeComponent/Avatar'
import ForwardChecked from '../HomeComponent/Message/ForwardChecked'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { useDispatch, useSelector } from 'react-redux'
import { useMountTransition } from '../../hooks'
import { memo } from 'react'

const ListFriendChooses = ({ chooses = [], handleChoose, list = [] }) => {
    const friendList = useSelector(state => state.friend.list)
    const hasTransition = useMountTransition(chooses.length > 0, 300)

    return (
        <div className="flex h-full">
            <div className="flex-1 h-full flex flex-col">
                <SimpleBar
                    style={{ height: '200px', flex: 1 }}
                >
                    {list?.map(friend => (
                        <label
                            key={friend._id}
                            className="flex items-center cursor-pointer px-2 py-2 dark:hover:bg-gray-900 bg-opacity-25 rounded-md"
                        >
                            <input
                                type="checkbox"
                                className="mr-4 flex-shrink-0 cursor-pointer"
                                value={friend._id}
                                name="forward-friend"
                                onChange={() =>
                                    handleChoose(friend._id)
                                }
                                checked={
                                    chooses.findIndex(
                                        item =>
                                            item._id ===
                                            friend._id
                                    ) !== -1
                                        ? 'checked'
                                        : ''
                                }
                            />

                            <div className="flex items-center">
                                <Avatar isNoDot={true}
                                    className="w-8 h-8 rounded-full"
                                    src={friend?.avatar}
                                />
                                <div className="ml-3 dark:text-gray-100 select-none line-clamp-1">
                                    {friend.name}
                                </div>
                            </div>
                        </label>
                    ))}
                </SimpleBar>
            </div>
            <div
                className={`${chooses.length > 0 && 'show'
                    } ${hasTransition && 'in'
                    } forward-choose bg-gray-100 w-48 dark:bg-gray-900 rounded-md`}
            >
                <div className="flex flex-col p-2 h-full">
                    <div className="flex items-center mb-2">
                        <div className="text-sm dark:text-gray-100 whitespace-nowrap">
                            Đã chọn
                        </div>
                        <div className="text-center text-xs p-1 text-blue-700 bg-blue-200 font-semibold rounded-md ml-2">
                            {chooses.length}/
                            {friendList.length}
                        </div>
                    </div>
                    <ForwardChecked
                        list={chooses}
                        onChoose={handleChoose}
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(ListFriendChooses)