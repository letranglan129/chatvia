import { useSelector } from 'react-redux'
import { DEFAULT_IMG } from '../../../image'

function Avatar({ src, classImgAttr = '' }) {
    const theme = useSelector((state) => state.theme)
	
    return (
        <div className={`avatar ${theme.colorTheme === 'light' ? 'border-dark' : 'border-light'}`} >
            <img
                className={classImgAttr + ` rounded-full h-10 w-10`}
                src={src || DEFAULT_IMG.AVATAR}
                onError={e => (e.target.src = DEFAULT_IMG.AVATAR)}
            />
        </div>
    )
}

Avatar.NotDot = ({ src, alt = '', className, ...props }) => {
    return (
        <img
            src={src || DEFAULT_IMG.AVATAR}
            alt={alt}
            className={className}
            {...props}
            onError={e => (e.target.src = DEFAULT_IMG.AVATAR)}
        />
    )
}

export default Avatar
