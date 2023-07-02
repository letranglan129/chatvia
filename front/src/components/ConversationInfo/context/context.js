import { useContext } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { Files, Home, Images, Links, Members } from '../path'

const ConversationInfoContext = createContext()

const routes = [
    {
        path: 'home',
        title: 'Thông tin',
        component: Home,
    },
    {
        path: 'members',
        title: 'Thành viên',
        component: Members,
    },
    {
        path: 'images',
        title: 'Ảnh',
        component: Images,
    },
    {
        path: 'files',
        title: 'File',
        component: Files,
    },
    {
        path: 'links',
        title: 'Link',
        component: Links,
    },
]

const ConversationInfoProvider = ({ children, ...props }) => {
    const [history, setHistory] = useState([routes[0]])

    const pushPath = (path) => {
        if (path)
            setHistory((prev) => {
                const route = routes.find((route) => route.path === path)
                return [route, ...prev]
            })
        else setHistory([])
    }

    const shiftPath = () => {
        setHistory((prev) => prev.slice(1))
    }

    const value = {
        routes: routes,
        history: history[0],
        shiftPath,
        pushPath,
    }

    return (
        <ConversationInfoContext.Provider value={value} {...props}>
            {children}
        </ConversationInfoContext.Provider>
    )
}

const useConversationInfo = () => {
    const context = useContext(ConversationInfoContext)
    return context
}

export { ConversationInfoProvider, useConversationInfo }
