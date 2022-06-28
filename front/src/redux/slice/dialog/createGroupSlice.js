import { createSlice } from '@reduxjs/toolkit'

export const createGroupSlice = createSlice({
    name: 'dialog',
    initialState: {
        isShow: false,
    },
    reducers: {
        toggleCreateGroup(state) {
            state.isShow = !state.isShow
        },
    },
})

export const {
    toggleCreateGroup
} = createGroupSlice.actions
export default createGroupSlice.reducer
