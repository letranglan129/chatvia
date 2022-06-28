import { useContext } from 'react'
import { createContext } from 'react'
import { useCollapse } from '../../../hooks'

const CollapseContext = createContext()

const CollapseProvider = ({ children, showAll, openDefault }) => {
    const [open, setOpen, isShowAll] = useCollapse(
        Array.isArray(openDefault) ? openDefault : [],
        showAll
    )

    const value = {
        open,
        setOpen,
        isShowAll,
    }

    return (
        <CollapseContext.Provider value={value}>
            {children}
        </CollapseContext.Provider>
    )
}

const useCollapseStore = () => {
    const context = useContext(CollapseContext)

    return context
}

export { CollapseProvider, useCollapseStore }
