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
            const arrayCopy = JSON.parse(JSON.stringify(state.conversation))
            if(Array.isArray(action.payload)) {
                arrayCopy.push(...action.payload)
            } else {
                const index = arrayCopy.findIndex(conversation => conversation._id === action.payload._id)
                if(index !== -1)
                    return
                arrayCopy.push(action.payload)
            }
            
            arrayCopy.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )
            state.conversation = JSON.parse(JSON.stringify(arrayCopy))
        },
        sortConsersation(state) {
            state.conversation.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            ) 
        },
        updateLastestMessage(state, action) {
            const arrayCopy = JSON.parse(JSON.stringify(state.conversation))
            const index = arrayCopy.findIndex(
                item => item?._id === action.payload?.conversationId
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

            arrayCopy.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )
            state.conversation = JSON.parse(JSON.stringify(arrayCopy))
        },
        updateLoadingStatus(state, action) {
            state.isLoading = action.payload
        }
    },
})

export const {
    getConversation,
    updateLastestMessage,
    updateLoadingStatus,
    sortConsersation
} = conversationSlice.actions
export default conversationSlice.reducer
