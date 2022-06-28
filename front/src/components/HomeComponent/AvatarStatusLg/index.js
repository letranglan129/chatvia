import { memo } from 'react'
import Avatar from '../Avatar'

function AvatarStatusLg({name, src, status}) {
    return (
		<div className='text-center pb-5 border-b dark:border-gray-600 mb-8'>
			<Avatar.NotDot className='rounded-full w-24 h-24 mx-auto mb-4 object-cover' src={src} alt='' />
			<p className='font-medium line-clamp-1 text-gray-700 dark:text-gray-200'>{name}</p>
			<div>
				<span className='inline-block w-3 h-3 border-4 border-green-500 rounded-full mr-2'></span>
				<span className='text-sm text-gray-500 dark:text-gray-400'>Active</span>
			</div>
		</div>
	)
}

export default memo(AvatarStatusLg)