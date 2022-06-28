import { memo } from 'react'
function Help() {
	return (
		<>
			<li>
				<div className='cursor-pointer border-b flex items-center justify-between dark:text-gray-200 text-sm py-5'>FAQs</div>
			</li>
			<li>
				<div className='cursor-pointer border-b flex items-center justify-between dark:text-gray-200 text-sm py-5'>Liên hệ</div>
			</li>
			<li>
				<div className='cursor-pointer flex items-center justify-between dark:text-gray-200 text-sm py-5'>Điều khoản và chính sách</div>
			</li>
		</>
	)
}

export default memo(Help)
