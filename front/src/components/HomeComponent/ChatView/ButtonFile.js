import { memo } from 'react'
import ButtonCircle from '../ButtonCircle'

function ButtonFile({ id, children, ...props }) {
    return (
        <label htmlFor={id} className="flex">
            <div className='icon'>
                <div className="dark:text-gray-200">
                    <ButtonCircle>
                        <input
                            type="file"
                            {...props}
                            multiple
                            id={id}
                            name={id}
                            hidden
                        />
                        {children}
                    </ButtonCircle>
                </div>
            </div>
        </label>
    )
}

export default memo(ButtonFile)
