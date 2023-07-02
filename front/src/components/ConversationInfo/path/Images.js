import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import ImageVideo from '../components/ImageVideo'
import { toggleSwiperImage } from '../../../redux/slice/dialog/swiperImageSlice'

const Images = () => {
    const { conversation } = useSelector((state) => state.currentChat)
    const [images, setImages] = useState({})
    const dispatch = useDispatch()

    useEffect(() => {
        const images = JSON.parse(JSON.stringify(conversation.imageMessages))
            ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
            ?.reduce((acc, msg) => {
                const date = new Date(msg.createdAt).toLocaleDateString()

                if (!acc[date]) {
                    acc[date] = []
                }
                acc[date].push(...msg?.imageGroup)
                return acc
            }, {})

        setImages(images)
    }, [conversation])

    return (
        <>
            <div className="z-0 bg-white dark:bg-gray-600"></div>
            <div className="relative z-10 flex flex-1 flex-col bg-white dark:bg-gray-700">
                <SimpleBar style={{ flex: 1 }}>
                    {Object.entries(images).map(([key, imageList]) => {
                        const dateParts = key.split('/')
                        const day = dateParts[1]
                        const month = dateParts[0]
                        const year = dateParts[2]
                        return (
                            <Fragment key={key}>
                                <div>
                                    <h4 className="px-4 pt-4 pb-2 text-sm dark:text-gray-200">
                                        {`Ngày ${day} tháng ${month} năm ${year}`}
                                    </h4>
                                </div>
                                <div className="flex items-center justify-center py-2">
                                    <div className="grid grid-cols-4 gap-2">
                                        {imageList?.map((image, index) => (
                                            <ImageVideo
                                                src={image}
                                                key={image}
                                                onClick={(e) => {
                                                    dispatch(
                                                        toggleSwiperImage({
                                                            isShow: true,
                                                            activeIndex: index,
                                                            listImg: imageList,
                                                        })
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })}
                </SimpleBar>
            </div>
        </>
    )
}

export default Images
