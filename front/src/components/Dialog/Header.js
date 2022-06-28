import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'

function Header({ children, handleClose, ...props }) {
    return (
        <div
            className="flex items-center justify-between p-3 border-b dark:border-b-gray-500"
            {...props}
        >
            <div className="text-lg dark:text-gray-100">{children}</div>
            <Button
                circle={true}
                primary={true}
                className="!w-8 !h-8"
                onClick={handleClose}
            >
                <ion-icon name="close-sharp"></ion-icon>
            </Button>
        </div>
    )
}

Header.propTypes = {
    children: PropTypes.node.isRequired,
    handleClose: PropTypes.func.isRequired,
    props: PropTypes.object,
}

export default memo(Header)
