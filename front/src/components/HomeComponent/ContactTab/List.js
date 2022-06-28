import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { toggleDropdown } from '../../../redux/slice/popperSlice'
import DropdownUserContact from './DropdownUserContact'

export default function List() {
    const dispatch = useDispatch()
    const simpleBar = useRef()
    const friends = useSelector(state => state.friend.list)

    // Turn off dialog call when scroll
    useEffect(() => {
        const handleScroll = () => {
            dispatch(toggleDropdown(null))
        }

        simpleBar?.current.addEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <SimpleBar
                style={{ height: '200px', flex: '1' }}
                scrollableNodeProps={{ ref: simpleBar }}
            >
                <div className="px-3">
                    <div className="font-semibold text-lg dark:text-indigo-500 mb-5">
                        A
                    </div>

                    {friends.map((friend, index) => (
                        <DropdownUserContact
                            key={index}
                            index={index + 1}
                            friend={friend}
                        />
                    ))}
                </div>
            </SimpleBar>
        </>
    )
}
