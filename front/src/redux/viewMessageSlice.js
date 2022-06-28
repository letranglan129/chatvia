import { createSlice } from '@reduxjs/toolkit'

export const viewMessageSlice = createSlice({
	name: 'theme',
	initialState: {
		toggleMess: null,
	},
	reducers: {
		updateToggleMess(state, action) {
			state.toggleMess = action.payload.toggleMess
		},
	},
})

export const { updateToggleMess } = viewMessageSlice.actions
export default viewMessageSlice.reducer
