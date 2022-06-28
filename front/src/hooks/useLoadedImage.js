import { useState, useEffect } from 'react'

const useLoadedImage = (ref, elementList) => {
    const [status, setStatus] = useState(false)
    const [imagesLoaded, setImagesLoaded] = useState(elementList)

    useEffect(() => {
        const updateStatus = images => {
            setStatus(
                images.map(image => image.complete).every(item => item === true)
            )
        }
        
        if (!ref.current) return

        if (imagesLoaded?.length === 0) {
            setStatus(true)
            return
        }

        imagesLoaded.forEach(image => {
            image.addEventListener('load', () => updateStatus(imagesLoaded), {
                once: true,
            })

            image.addEventListener('error', () => updateStatus(imagesLoaded), {
                once: true,
            })
        })

        return
    }, [ref, imagesLoaded])

    return [status, setImagesLoaded]
}

export default useLoadedImage