import { createSlice } from '@reduxjs/toolkit'

export const searchResultSlice = createSlice({
    name: 'dialog',
    initialState: {
        searchResult: false,
        conversationInfo: false,
    },
    reducers: {
        toggleSearchResult(state, action) {
            if (action.payload) state.searchResult = action.payload
            else state.searchResult = !state.searchResult
        },
    },
})

export const { toggleSearchResult } = searchResultSlice.actions
export default searchResultSlice.reducer
