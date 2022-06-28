import Avatar from '../Avatar'

function ForwardCheckedItem({ avatar, name, onClick = () => {} }) {
    return (
        <div className="flex items-center rounded-full w-full bg-blue-200 p-1 mb-2 select-none">
            <Avatar isNoDot={true} className="w-6 h-6 rounded-full mr-2" src={avatar} />
            <span className="text-sm font-normal flex-1 text-blue-700 line-clamp-1">
                {name}
            </span>
            <span
                className="ml-auto text-2xl flex text-blue-700 cursor-pointer"
                onClick={onClick}
            >
                <ion-icon name="close-circle"></ion-icon>
            </span>
        </div>
    )
}

export default ForwardCheckedItem
