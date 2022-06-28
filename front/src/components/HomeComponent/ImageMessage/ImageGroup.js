import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { toggleSwiperImage } from '../../../redux/dialogSlice'
import { Image } from "../ImageMessage"

function ImageGroup({ listImg }) {
	const dispatch = useDispatch()

	// Turn on swiper image
	const clickHandle = (e) => {
		dispatch(toggleSwiperImage({ isShow: true, activeIndex: listImg.indexOf(e.target.src), listImg }))
	}
	
	let widthImg, heightImg, classLayout
	switch (listImg?.length) {
		case 1:
			widthImg = '320px'
			heightImg = 'auto'
			classLayout = 'grid-cols-1 gap-0'
			break
		case 2:
			widthImg = '240px'
			heightImg = 'auto'
			classLayout = 'grid-cols-2 gap-2'
			break

		default:
			widthImg = '120px'
			heightImg = '120px'
			classLayout = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'
			break
	}

	const listItem = listImg?.map((img, index) => (
		<div style={{ maxWidth: widthImg, maxHeight: heightImg }} key={index} className='flex justify-center bg-gray-500'>
			<Image src={img} onClick={clickHandle} className='message-image'/>
		</div>
	))


	return <div className={`grid ${classLayout}`}>{listItem}</div>
}

export default memo(ImageGroup)