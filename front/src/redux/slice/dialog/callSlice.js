import { createSlice } from '@reduxjs/toolkit'

export const callDialogSlice = createSlice({
    name: 'dialog',
    initialState: {
        call: {
            isShow: false,
            type: 'audio',
        }
    },
    reducers: {
        toggleCall(state, action) {
            state.call.isShow = action.payload.isShow
            state.call.type = action.payload.type ?? ''
        }
    },
})

export const {
    toggleCall,
} = callDialogSlice.actions
export default callDialogSlice.reducer
