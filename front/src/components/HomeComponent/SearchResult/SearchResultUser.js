import { NotFound, UserResult } from './index'

const SearchResultUser = ({ results }) => {
    const [users, setUsers] = results
	
    if (!Array.isArray(users) || users.length === 0) return <NotFound />

    return users?.map((element, index) => (
        <UserResult key={index} friend={element} />
    ))
}

export default SearchResultUser
