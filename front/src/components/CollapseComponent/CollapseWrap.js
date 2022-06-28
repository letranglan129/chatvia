import { memo } from 'react'

function CollapseWrap({ id, arrCheck, children }) {
	return (
		<div
			className={`bg-white overflow-hidden dark:bg-gray-900 bg-opacity-50 rounded-b-lg transition-all ease-linear duration-300 ${
				arrCheck.includes(id) ? 'max-h-full px-5' : 'max-h-0'
			}`}>
			<ul className=''>{children}</ul>
		</div>
	)
}

export default memo(CollapseWrap, (prevProp, nextProp) => prevProp.arrCheck.includes(prevProp.id) === nextProp.arrCheck.includes(nextProp.id))
