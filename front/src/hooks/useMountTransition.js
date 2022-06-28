import { useEffect, useState } from 'react'

const useMountTransition = (condition, delay) => {
    const [hasTransition, setHasTransition] = useState(false)

    useEffect(() => {
        let timeOutId
        if(condition && !hasTransition) {
            setHasTransition(true)
        }
        else if(!condition && hasTransition) {
            timeOutId = setTimeout(() => setHasTransition(false), delay)
        }

        return () => {
            clearTimeout(timeOutId)
        }
    }, [condition, hasTransition, delay])

    return hasTransition
}

export default useMountTransition