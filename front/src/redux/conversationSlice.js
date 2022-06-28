import { createSlice } from '@reduxjs/toolkit'
import { getLastMessage } from '../ulti'

export const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        conversation: [],
    },
    reducers: {
        getConversation(state, action) {
            const arrayCopy = JSON.parse(JSON.stringify(state.conversation))
            arrayCopy.push(...action.payload)

            arrayCopy.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            )
            state.conversation = JSON.parse(JSON.stringify(arrayCopy))
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
    },
})

export const {
    getConversation,
    updateLastestMessage,
} = conversationSlice.actions
export default conversationSlice.reducer
