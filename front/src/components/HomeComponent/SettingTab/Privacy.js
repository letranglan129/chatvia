import { memo } from "react"

function Privacy() {
	return (
		<>
			<li>
				<div className='flex items-center justify-between dark:text-gray-200 text-sm py-5'>
					<div>Xem ảnh đại diện của bạn</div>
					<div className='selectEl'>
						<select>
							<option>Mọi người</option>
							<option>Trừ...</option>
							<option>Không ai</option>
						</select>
					</div>
				</div>
			</li>
			<li>
				<div className='flex items-center justify-between dark:text-gray-200 text-sm py-5'>
					<div>Tin nhắn trạng thái đã xem</div>
					<label className='switch'>
						<input type='checkbox' />
						<span className='slider round'></span>
					</label>
				</div>
			</li>
			<li>
				<div className='flex items-center justify-between dark:text-gray-200 text-sm py-5'>
					<div>Nhận tin nhắn từ người lạ</div>
					<label className='switch'>
						<input type='checkbox' />
						<span className='slider round'></span>
					</label>
				</div>
			</li>
			<li>
				<div className='flex items-center justify-between dark:text-gray-200 text-sm py-5'>
					<div>Trạng thái hoạt động</div>
					<div className='selectEl'>
						<select>
							<option>Mọi người</option>
							<option>Trừ...</option>
							<option>Không ai</option>
						</select>
					</div>
				</div>
			</li>
			<li>
				<div className='flex items-center justify-between dark:text-gray-200 text-sm py-5'>
					<div>Nhận cuộc gọi từ người lạ</div>
					<label className='switch'>
						<input type='checkbox' />
						<span className='slider round'></span>
					</label>
				</div>
			</li>
			<li>
				<div className='flex items-center justify-between dark:text-gray-200 text-sm py-5'>
					<div>Hiển thị ngày sinh với mọi người</div>
					<label className='switch'>
						<input type='checkbox' />
						<span className='slider round'></span>
					</label>
				</div>
			</li>
		</>
	)
}

export default memo(Privacy)