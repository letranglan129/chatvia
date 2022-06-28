import Swiper from "react-id-swiper"
import { useSelector } from 'react-redux'
import { Pagination, Autoplay } from "swiper"
import { WELCOME_SWIPER } from '../../../image'

export default function ChatWelcome() {
	const theme = useSelector(state => state.theme)

	const toggleViewMessage = () => {
		if (theme?.isHidden && !false)
			return 'hidden not-toggle-mess'
		if (!theme?.isHidden)
            return 'not-hidden'
    }

	const data = [
		{
			img: WELCOME_SWIPER.Image_1,
			title: "Nhắn tin nhiều hơn, soạn thảo ít hơn",
			desc: 'Sử dụng tin nhắn nhanh để lưu sẵn các tin nhắn thường dùng và gửi nhanh trong hội thoại bất kỳ.'
		},
		{
			img: WELCOME_SWIPER.Image_2,
			title: "Tin nhắn tự động xóa",
			desc: 'Tin nhắn tự động xóa sau một thời gian nhất định, để bạn không bị mất tin nhắn.'
		},
		{
			img: WELCOME_SWIPER.Image_3,
			title: "Chat nhóm với đồng nghiệp",
			desc: 'Chat nhóm với đồng nghiệp với các tin nhắn đặc biệt, nhắn tin nhóm để gửi tin nhắn đến nhiều người.'
		},
	]

	const params = {
		slidesPerView: "auto",
		autoplay: {
			delay: 2500,
			disableOnInteraction: false,
		},
		loop: true,
		navigation: {
			nextEl: ".swiper-next",
			prevEl: ".swiper-prev",
		},
		renderPrevButton: () => (
			<div className='swiper-prev dark:text-gray-100 dark:hover:text-blue-600 hover:text-blue-600'>
				<ion-icon name='chevron-back-outline'></ion-icon>
			</div>
		),
		renderNextButton: () => (
			<div className='swiper-next dark:text-gray-100 dark:hover:text-blue-600 hover:text-blue-600'>
				<ion-icon name='chevron-forward-outline'></ion-icon>
			</div>
		),
		pagination: {
			el: ".swiper-pagination",
			clickable: true,
		},
		modules: [Pagination, Autoplay],
		containerClass: "swiper-container h-full chatwelcome overflow-hidden lg:max-w-sm llg:max-w-none mx-auto",
	}

	return (
		<div className={`view-message ${toggleViewMessage()}`}>
			<div className='py-20 h-full overflow-hidden flex flex-col'>
				<div className='mb-4 px-10'>
					<h1 className='text-center text-xl mb-4 dark:text-gray-200 font-light'>
						Chào mừng đến với <span className='font-medium'>ChatVia!</span>
					</h1>

					<p className='text-center text-sm line-clamp-2 dark:text-gray-300'>
						Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè được tối ưu hoá cho máy tính của bạn.
					</p>
				</div>

				<div className='px-10 relative'>
					<Swiper {...params}>
						{
							data.map((item, index) => (
								<div key={index} className='select-none' style={{ height: "auto" }}>
									<div className=' flex items-center justify-between flex-col h-full '>
										<img src={item.img} alt='' className='object-contain w-96' />
										<div>
											<h2 className='text-lg text-center text-blue-600 font-medium line-clamp-2 my-4 w-full'>
												{item.title}
											</h2>
											<p className='text-sm text-center line-clamp-2 leading-6 h-12 w-full dark:text-gray-300'>
												{item.desc}
											</p>
										</div>
									</div>
								</div>
							))
						}
					</Swiper>
				</div>
			</div>
		</div>
	)
}
