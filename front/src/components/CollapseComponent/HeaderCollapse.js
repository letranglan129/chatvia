import { memo } from "react";

function HeaderCollapse({ func, contentFor, arrCheck, children }) {
	return (
		<label
			className={`text-sm cursor-pointer text-gray-800 select-none font-medium bg-gray-200 hover:bg-gray-300 hover:bg-opacity-50 dark:text-gray-200 flex justify-between items-center p-3 ${
				arrCheck.includes(contentFor) ? 'rounded-t-lg' : 'rounded-lg delay-300 '
			}`}>
			<input hidden type='checkbox' onChange={(e) => func(e.target.value)} value={contentFor} />
			{children}
			{arrCheck.includes(contentFor) ? <ion-icon name='chevron-up-sharp'></ion-icon> : <ion-icon name='chevron-forward-sharp'></ion-icon>}
		</label>
	)
}


export default memo(
	HeaderCollapse,
	(prevProp, nextProp) => prevProp.arrCheck.includes(prevProp.contentFor) === nextProp.arrCheck.includes(nextProp.contentFor)
)
