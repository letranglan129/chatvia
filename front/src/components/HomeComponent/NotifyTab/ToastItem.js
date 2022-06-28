import React from 'react'

export const ToastItem = ({type, img, text}) => {
  return (
		<div className='flex items-center p-4'>
			<div className='relative mr-4'>
				<img className='w-14 h-14 rounded-full' src={img} alt='' />
				<div
					style={{ background: "linear-gradient(to bottom, #00acee, #0072e0)" }}
					className='absolute bottom-0 right-0 p-1 text-white rounded-full leading-0'>
					{
						{
							FRIEND: <ion-icon name='person-add'></ion-icon>,
						}[type]
					}
				</div>
			</div>
			<span className='line-clamp-1'>
				<strong>Lê Trạng Lân</strong> đã gửi lời mời kết bạn cho bạn đã gửi lời mời kết bạn cho bạn đã gửi lời mời kết bạn cho bạn đã gửi lời
				mời kết bạn cho bạn đã gửi lời mời kết bạn cho bạn
			</span>
		</div>
  )
}
