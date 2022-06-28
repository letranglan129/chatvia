import { createSlice } from '@reduxjs/toolkit'

export const themeSlice = createSlice({
	name: "theme",
	initialState: {
		isHidden: false,
		colorTheme: "light",
	},
	reducers: {
		updateTheme: (state, action) => {
			const htmlEl = document.querySelector("html")
			htmlEl.classList.remove(state.colorTheme)
			htmlEl.classList.add(action.payload.colorTheme)
			state.colorTheme = action.payload.colorTheme
		},

		loadTheme: (state) => {
			if (state.colorTheme === "dark") {
				document.documentElement.classList.add("dark")
			} else {
				document.documentElement.classList.remove("dark")
			}
		},

		updateStatusResolution(state, action) {
			state.isHidden = action.payload.isHidden ?? state.isHidden
		},
	},
})

export const { updateTheme, loadTheme, updateStatusResolution } = themeSlice.actions
export default themeSlice.reducer
