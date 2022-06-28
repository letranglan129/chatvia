import { createSlice } from '@reduxjs/toolkit'

export const conversationInfoSlice = createSlice({
    name: 'dialog',
    initialState: {
       
		conversationInfo: false,
    },
    reducers: {
		toogleConversationInfo(state) {
			state.conversationInfo = !state.conversationInfo
		}
    },
})

export const {
	toogleConversationInfo
} = conversationInfoSlice.actions
export default conversationInfoSlice.reducer
