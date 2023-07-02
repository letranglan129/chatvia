import { forwardRef, memo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_IMG } from '../../../assets/image'

function Avatar(
    { user, className = '', isNoDot = false, alt = '', ...props },
    ref
) {
    const theme = useSelector((state) => state.theme)
    const onlines = useSelector((state) => state.online.list)
    const [isOnline, setIsOnline] = useState(false)

    useEffect(() => {
        if (!isNoDot) {
            setIsOnline(onlines.includes(user.id))
        }
    }, [onlines, user.id])

    return (
        <>
            {(isNoDot || !isOnline) && (
                <img
                    src={user?.avatar || DEFAULT_IMG.AVATAR}
                    alt={alt}
                    ref={ref}
                    className={`h-10 w-10 rounded-full object-cover ${className}`}
                    {...props}
                    onError={(e) => (e.target.src = DEFAULT_IMG.AVATAR)}
                />
            )}
            {isOnline && (
                <div
                    className={`avatar ${
                        theme.colorTheme === 'light'
                            ? 'border-light'
                            : 'border-dark'
                    }`}
                >
                    <img
                        className={`h-10 w-10 rounded-full ${className}`}
                        ref={ref}
                        src={user?.avatar || DEFAULT_IMG.AVATAR}
                        onError={(e) => (e.target.src = DEFAULT_IMG.AVATAR)}
                        alt={alt}
                    />
                </div>
            )}
        </>
    )
}

export default memo(forwardRef(Avatar))
