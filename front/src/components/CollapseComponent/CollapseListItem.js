import { memo } from "react"

function CollapseListItem({ title, content }) {
	return (
		<li className=''>
			<div className='py-3'>
				<p className='text-sm text-gray-600 dark:text-gray-400' title={title}>
					{title !== undefined ? title : ""}
				</p>
				<p
					className='text-sm font-medium line-clamp-1 text-gray-700 dark:text-gray-200'
					title={content}>
					{content}
				</p>
			</div>
		</li>
	)
}

export default memo(CollapseListItem)
