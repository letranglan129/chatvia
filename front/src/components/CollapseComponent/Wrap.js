import React from 'react'
import { CollapseProvider } from './context'

const Collapse = ({ children, ...props }) => {
    return <CollapseProvider {...props}>{children}</CollapseProvider>
}

export default Collapse
