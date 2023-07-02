import Avatar from '../Avatar'

function ForwardCheckedItem({ avatar, name, onClick = () => {} }) {
    return (
        <div className="mb-2 flex w-full select-none items-center rounded-full bg-blue-200 p-1">
            <Avatar
                user={{ id: '', avatar }}
                isNoDot={true}
                className="mr-2 h-6 w-6 rounded-full"
            />
            <span className="flex-1 text-sm font-normal text-blue-700 line-clamp-1">
                {name}
            </span>
            <span
                className="ml-auto flex cursor-pointer text-2xl text-blue-700"
                onClick={onClick}
            >
                <ion-icon name="close-circle"></ion-icon>
            </span>
        </div>
    )
}

export default ForwardCheckedItem
