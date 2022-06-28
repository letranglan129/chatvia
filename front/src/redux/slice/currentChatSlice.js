import { createSlice } from '@reduxjs/toolkit'

export const currentChat = createSlice({
    name: 'currentChat',
    initialState: {
        conversation: {},
    },
    reducers: {
        changeCurrentChat(state, action) {
            state.conversation = action.payload
        },
    },
})

export const { changeCurrentChat } = currentChat.actions
export default currentChat.reducer
