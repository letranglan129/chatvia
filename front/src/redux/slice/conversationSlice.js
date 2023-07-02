import { createSlice } from '@reduxjs/toolkit'
import { getLastMessage } from '../../ulti'

export const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        isLoading: true,
        conversation: [],
    },
    reducers: {
        getConversation(state, action) {
            let arrayCopy = JSON.parse(JSON.stringify(state.conversation))
            if (Array.isArray(action.payload)) {
                const conversationIds = arrayCopy.map(
                    (conversation) => conversation._id
                )

                action.payload.forEach((conversation) => {
                    if (!conversationIds.includes(conversation._id))
                        arrayCopy.push(conversation)
                })
            } else {
                const index = arrayCopy.findIndex(
                    (conversation) => conversation._id === action.payload._id
                )

                if (index !== -1) return
                arrayCopy.push(action.payload)
            }

            arrayCopy = arrayCopy.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )
            
            state.conversation = JSON.parse(JSON.stringify(arrayCopy))
        },
        sortConsersation(state) {
            state.conversation = state.conversation.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )
        },
        updateLastestMessage(state, action) {
            let arrayCopy = JSON.parse(JSON.stringify(state.conversation))
            const index = arrayCopy.findIndex(
                (item) => item?._id === action.payload?.conversationId
            )

            arrayCopy[index] = {
                ...arrayCopy[index],
                lastMessage: {
                    text: getLastMessage(
                        action.payload.type,
                        action.payload.text
                    ),
                    type: action.payload.type || 'text',
                },
                createdAt: action.payload?.createdAt,
                updatedAt: action.payload?.updatedAt,
                senderId: action.payload?.senderId,
            }
            console.log(arrayCopy)
            
            arrayCopy = arrayCopy.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )

            console.log(
                arrayCopy.sort(
                    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                )
            )
            state.conversation = JSON.parse(JSON.stringify(arrayCopy))
        },
        updateLoadingStatus(state, action) {
            state.isLoading = action.payload
        },
        removeLastMessage(state, action) {
            let arrayCopy = JSON.parse(JSON.stringify(state.conversation))
            const index = arrayCopy.findIndex(
                (item) => item?._id === action.payload?.conversationId
            )

            arrayCopy[index] = {
                ...arrayCopy[index],
                lastMessage: null,
            }

            arrayCopy = arrayCopy.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )
            state.conversation = JSON.parse(JSON.stringify(arrayCopy))
        },
        replaceConversation(state, action) {
            state.conversation = state.conversation.filter(conversation => conversation._id !== action.payload._id)
            
            state.conversation.push(action.payload)
            
            state.conversation = state.conversation.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )
        },
        deleteConversation(state, action) {
            state.conversation = state.conversation.filter(
                (conversation) => conversation._id !== action.payload._id
            )
            state.conversation = state.conversation.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )
        }
    },
})

export const {
    getConversation,
    removeLastMessage,
    updateLastestMessage,
    updateLoadingStatus,
    sortConsersation,
    replaceConversation,
    deleteConversation,
} = conversationSlice.actions
export default conversationSlice.reducer
