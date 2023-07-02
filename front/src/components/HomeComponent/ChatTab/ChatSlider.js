import { memo } from 'react'
import Swiper from 'react-id-swiper'
import { SwiperSlide } from 'swiper/react/swiper-react'
import UserStatusBox from '../UserStatusBox'

import 'swiper/swiper-bundle.min.css'
import { useSelector } from 'react-redux'

const ChatSlider = () => {
    const onlines = useSelector((selector) => selector.online.list)
    const friends = useSelector((selector) => selector.friend.list)
    const params = {
        slidesPerView: 'auto',
        spaceBetween: 30,
        freeMode: true,
    }

    return (
        <Swiper
            {...params}
            allowTouchMove={true}
            containerClass="swiper-slider overflow-[unset]"
        >
            {friends
                .filter((friend) => onlines.includes(friend._id))
                .map((friend) => (
                    <SwiperSlide
                        key={friend._id}
                        className="w-auto select-none"
                    >
                        <UserStatusBox user={friend} />
                    </SwiperSlide>
                ))}
        </Swiper>
    )
}

export default memo(ChatSlider)
