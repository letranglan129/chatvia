import { useContext } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import { Home, Members } from '../path'

const ConversationInfoContext = createContext()

const routes = [
    {
        path: 'home',
        title: 'Thông tin nhóm',
        component: Home,
    },
    {
        path: 'members',
        title: 'Thành viên',
        component: Members,
        children: [{ path: 'member', title: '' }],
    },
    {
        path: 'media',
        title: 'Kho lưu trữ',
        component: '',
        children: [{ path: 'member', title: '' }],
    },
]

const ConversationInfoProvider = ({ children, ...props }) => {
    const [history, setHistory] = useState([routes[0]])

    const pushPath = path => {
        if (path)
            setHistory(prev => {
                const route = routes.find(route => route.path === path)
                return [route, ...prev]
            })
        else setHistory([])
    }

    const shiftPath = () => {
        setHistory(prev => prev.slice(1))
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
