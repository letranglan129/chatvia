import { createSlice } from '@reduxjs/toolkit'

export const messageSlice = createSlice({
    name: 'message',
    initialState: {
        messageArr: [],
        from: null,
        prevFrom: null,
        to: null,
    },
    reducers: {
        pushMessage(state, action) {
            let messages

            if (Array.isArray(action.payload)) {
                messages = [...state.messageArr, ...action.payload]
                state.messageArr = messages
            } else {
                messages = [...state.messageArr, action.payload]
                state.messageArr = messages
            }
            state.to = messages.length
            state.from = state.to - 20 >= 0 ? state.to - 20 : 0
            state.prevFrom = state.from
        },
        loadMoreMessage(state) {
            state.prevFrom = state.from
            state.from = state.from - 20 >= 0 ? state.from - 20 : 0
        },
        removeAllMessage(state) {
            state.messageArr.length = 0
            state.from = null
            state.to = null
        },
        removeMessageById(state, action) {
            state.messageArr = state.messageArr.filter(
                message => message._id !== action.payload
            )
            state.to = state.messageArr.length
            state.from = state.to - 20 >= 0 ? state.to - 20 : 0
            state.prevFrom = state.from
        },
        updateMessageById(state, action) {
            const { id, ...updateData } = action.payload
            const index = state.messageArr.findIndex(item => item._id === id)
            if (index !== -1) {
                state.messageArr[index] = {
                    ...state.messageArr[index],
                    ...updateData,
                }
            }
        },
    },
})

export const {
    pushMessage,
    removeAllMessage,
    loadMoreMessage,
    updateMessageById,
    removeMessageById,
} = messageSlice.actions
export default messageSlice.reducer
