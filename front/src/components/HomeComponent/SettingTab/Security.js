import { memo } from "react"

function Security() {
	return (
		<>
			<li>
				<div className='flex items-center justify-between dark:text-gray-200 text-sm py-5'>
					<div>Bật thông báo bảo mật</div>
					<label className='switch'>
						<input type='checkbox' />
						<span className='slider round'></span>
					</label>
				</div>
			</li>
		</>
	)
}

export default memo(Security)
