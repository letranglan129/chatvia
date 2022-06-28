import { memo } from "react"

function GroupItem({ avaGr, nameGr, lastMess }) {
	return (
		<div className='flex items-center px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700'>
			<div className='flex-none mr-4'>
				<img src={avaGr} className='w-10 h-10 rounded-full' alt='' />
			</div>
			<div className='flex-1'>
				<p className='font-medium line-clamp-1 text-gray-700 dark:text-gray-200'>{nameGr}</p>
				<p className='line-clamp-1 text-sm text-gray-500 dark:text-gray-400'>{lastMess}</p>
			</div>
			<div className='text-xs font-medium  bg-red-500 bg-opacity-30 text-red-500 px-1 rounded'>99+</div>
		</div>
	)
}

export default memo(GroupItem)