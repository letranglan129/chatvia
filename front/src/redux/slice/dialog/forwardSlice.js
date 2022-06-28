import { createSlice } from '@reduxjs/toolkit'

export const forwardDialogSlice = createSlice({
    name: 'dialog',
    initialState: {
        forward: {
            isShow: false,
            message: {},
        }
    },
    reducers: {
        toggleForward(state, action) {
            state.forward.isShow = !state.forward.isShow
            state.forward.message = action.payload
        }
    },
})

export const {
    toggleForward,
} = forwardDialogSlice.actions
export default forwardDialogSlice.reducer
