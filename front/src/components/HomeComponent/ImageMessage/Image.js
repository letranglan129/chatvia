import { DEFAULT_IMG } from '../../../image'

function Image({ src, className,...props }) {
    return (
        <img
            {...props}
            className={`object-contain w-full ${className || ''}`}
            src={`${src}`}
            alt=""
            onError={e => (e.target.src = DEFAULT_IMG.ERROR_IMAGE)}
        />
    )
}

export default Image
