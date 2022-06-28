import { memo } from 'react'
import Swiper from 'react-id-swiper'
import { SwiperSlide } from 'swiper/react/swiper-react'
import UserStatusBox from '../UserStatusBox'

const ChatSlider = () => {
	const params = {
		slidesPerView: 'auto',
		spaceBetween: 30,
		freeMode: true,
	}
	
	return (
		<Swiper {...params} allowTouchMove={true} containerClass='swiper-slider'>
			<SwiperSlide className='w-auto select-none'>
				<UserStatusBox name='Le Trang Lan' src='https://random.imagecdn.app/200/200' />
			</SwiperSlide>
			<SwiperSlide className='w-auto select-none'>
				<UserStatusBox name='Le Trang Lan' src='https://random.imagecdn.app/201/201' />
			</SwiperSlide>
			<SwiperSlide className='w-auto select-none'>
				<UserStatusBox name='Le Trang Lan' src='https://random.imagecdn.app/202/202' />
			</SwiperSlide>
			<SwiperSlide className='w-auto select-none'>
				<UserStatusBox name='Le Trang Lan' src='https://random.imagecdn.app/203/203' />
			</SwiperSlide>
			<SwiperSlide className='w-auto select-none'>
				<UserStatusBox name='Le Trang Lan' src='https://random.imagecdn.app/204/204' />
			</SwiperSlide>
			<SwiperSlide className='w-auto select-none'>
				<UserStatusBox name='Le Trang Lan' src='https://random.imagecdn.app/205/205' />
			</SwiperSlide>
			<SwiperSlide className='w-auto select-none'>
				<UserStatusBox name='Le Trang Lan' src='https://random.imagecdn.app/206/206' />
			</SwiperSlide>
			<SwiperSlide className='w-auto select-none'>
				<UserStatusBox name='Le Trang Lan' src='https://random.imagecdn.app/207/207' />
			</SwiperSlide>
			<SwiperSlide className='w-auto select-none'>
				<UserStatusBox name='Le Trang Lan' src='https://random.imagecdn.app/208/208' />
			</SwiperSlide>
			<SwiperSlide className='w-auto select-none'>
				<UserStatusBox name='Le Trang Lan' src='https://random.imagecdn.app/209/209' />
			</SwiperSlide>
		</Swiper>
	)
}

export default memo(ChatSlider)
