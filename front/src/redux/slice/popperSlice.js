import { createSlice } from "@reduxjs/toolkit"

export const popperSlice = createSlice({
	name: "popper",
	initialState: {
		openDropdownListContact: null,
	},
	reducers: {
		toggleDropdown(state, action) {
			if (action.payload === state.openDropdownListContact) {
				state.openDropdownListContact = null
			} else {
				state.openDropdownListContact = action.payload
			}
		},
	},
})

export const { toggleDropdown } = popperSlice.actions
export default popperSlice.reducer
