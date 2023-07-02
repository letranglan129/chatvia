import { createSlice } from '@reduxjs/toolkit'

export const onlineSlice = createSlice({
    name: 'online',
    initialState: {
        list: [],
    },
    reducers: {
        setOnline: (state, action) => {
            state.list = action.payload
        },
    },
})

export const { setOnline } = onlineSlice.actions
export default onlineSlice.reducer
