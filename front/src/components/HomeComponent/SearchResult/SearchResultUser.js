import { NotFound, UserResult } from './index'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

const SearchResultUser = ({ results }) => {
    const [users, setUsers] = results

    if (!Array.isArray(users) || users.length === 0) return <NotFound />

    return (
        <SimpleBar style={{ height: '200px', flex: '1' }}>
            {users?.map((element, index) => (
                <UserResult key={index} friend={element} />
            ))}
        </SimpleBar>
    )
}

export default SearchResultUser
