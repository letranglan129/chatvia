import { createSlice, current } from '@reduxjs/toolkit'

export const messageSlice = createSlice({
    name: 'message',
    initialState: {
        messageArr: [],
        messageCurrent: [],
        step: 20,
        from: 0,
        isHasMore: true,
    },
    reducers: {
        pushMessage(state, action) {
            let messages

            if (Array.isArray(action.payload)) {
                messages = [...state.messageArr, ...action.payload]
                state.messageArr = messages
                state.messageArr = state.messageArr.reverse()
            } else {
                messages = [action.payload, ...state.messageArr]
                state.messageArr = messages
            }
            
            state.from = 0
            state.step = 20
            state.isHasMore = true
            state.messageCurrent = state.messageArr.slice(
                state.from,
                state.step
            )
        },
        loadMoreMessage(state) {
            state.from += state.step
            let to = state.from + state.step

            if (to > state.messageArr.length) {
                to = state.messageArr.length
                state.isHasMore = false
            }

            state.messageCurrent = state.messageCurrent.concat(
                state.messageArr.slice(state.from, to)
            )
        },
        removeAllMessage(state) {
            state.messageArr.length = 0
            state.messageCurrent.length = 0
            state.isHasMore = true
            state.from = 0
        },
        removeMessageById(state, action) {
            state.messageArr = state.messageArr.filter(
                (message) => message._id !== action.payload
            )
            state.messageCurrent = state.messageArr.slice(
                state.from,
                state.step
            )
        },
        updateMessageById(state, action) {
            const { id, ...updateData } = action.payload
            const index = state.messageCurrent.findIndex(
                (item) => item._id === id
            )
            if (index !== -1) {
                state.messageCurrent[index] = {
                    ...state.messageCurrent[index],
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
