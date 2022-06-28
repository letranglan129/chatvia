import { forwardRef, memo } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_IMG } from '../../../assets/image'

function Avatar(
    { src, className = '', isNoDot = false, alt = '', ...props },
    ref
) {
    const theme = useSelector((state) => state.theme)

    if (isNoDot)
        return (
            <img
                src={src || DEFAULT_IMG.AVATAR}
                alt={alt}
                ref={ref}
                className={`h-10 w-10 rounded-full object-cover ${className}`}
                {...props}
                onError={(e) => (e.target.src = DEFAULT_IMG.AVATAR)}
            />
        )

    return (
        <div
            className={`avatar ${
                theme.colorTheme === 'light' ? 'border-light' : 'border-dark'
            }`}
        >
            <img
                className={`h-10 w-10 rounded-full ${className}`}
                ref={ref}
                src={src || DEFAULT_IMG.AVATAR}
                onError={(e) => (e.target.src = DEFAULT_IMG.AVATAR)}
            />
        </div>
    )
}

export default memo(forwardRef(Avatar))
