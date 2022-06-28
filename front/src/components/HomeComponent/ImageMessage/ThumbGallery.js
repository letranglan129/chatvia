import { useState, memo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'
import SwiperCore, { Navigation, Mousewheel } from 'swiper'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import 'swiper/modules/mousewheel/mousewheel'
import { useDispatch, useSelector } from 'react-redux'
import SlideImage from './SlideImage'
import { reset } from '../../../redux/slice/swiperSlice'
import Button from '../../Button'

SwiperCore.use([Navigation, Mousewheel])

function ThumbGallery() {
    const { swiperImage } = useSelector(state => state.swiperImageDialog)
	const [swiper, setSwiper] = useState()
	const dispatch = useDispatch()
	const [imgActive, setImgActive] = useState(swiperImage?.listImg[swiperImage?.activeIndex])
	
	const thumbSwiper = {
		navigation: { nextEl: '.swiper-main .swiper-next', prevEl: '.swiper-main .swiper-prev' },
		spaceBetween: 0,
		slideToClickedSlide: true,
		speed: 300,
		mousewheel: true,
		initialSlide: swiperImage?.activeIndex,
		centeredSlides: true,
		breakpoints: {
			768: {
				direction: 'vertical',
				slidesPerView: 5,
			},

			0: {
				direction: 'horizontal',
				slidesPerView: 3,
			},
			500: {
				direction: 'horizontal',
				slidesPerView: 4,
			},
		},
	}

	const resetDispatch = () => {
		dispatch(reset())
	}

	const getImageActive = () => {
		if (!swiper) return
		let slideActive = swiper?.slides[swiper.activeIndex] ?? swiper.slides[swiperImage?.activeIndex]
		setImgActive(slideActive?.querySelector('img').src)
	}

	return (
		<div className='thumb-gallery'>
			<div className='relative swiper-main mx-0 h-4/5 w-full md:h-full md:w-4/5'>
				<Button circle={true}
					className='swiper-button swiper-prev'
					onClick={() => {
						getImageActive()
						resetDispatch()
					}}>
					{window.innerWidth > 768 ? <ion-icon name='chevron-up-outline'></ion-icon> : <ion-icon name='arrow-back-outline'></ion-icon>}
				</Button>
				<Button circle={true}
					className='swiper-button swiper-next'
					onClick={() => {
						getImageActive()
						resetDispatch()
					}}>
					{window.innerWidth > 768 ? <ion-icon name='chevron-down-outline'></ion-icon> : <ion-icon name='arrow-forward-outline'></ion-icon>}
				</Button>
				<SlideImage img={imgActive} />
			</div>
			<Swiper
				onSlideChange={() => getImageActive()}
				onScroll={() => getImageActive()}
				onSwiper={setSwiper}
				{...thumbSwiper}
				className='w-full h-1/6 md:w-1/6 mt-auto md:h-full md:ml-auto swiper-thumb'>
				{swiperImage?.listImg.map((img, index) => (
					<SwiperSlide key={index}>
						<img className='w-full h-full pr-2 md:pb-2 md:pr-0 object-cover' src={img} alt='' />
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}

export default memo(ThumbGallery)
