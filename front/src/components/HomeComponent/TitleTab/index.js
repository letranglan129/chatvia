import { memo } from "react"

function TitleTab({ children }) {
	return <h2 className='text-2xl text-gray-800 dark:text-gray-200 mb-0'>{children}</h2>
}

export default memo(TitleTab)
