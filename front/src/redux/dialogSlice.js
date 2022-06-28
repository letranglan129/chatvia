import { createSlice } from '@reduxjs/toolkit'

export const dialogSlice = createSlice({
	name: 'dialog',
	initialState: {
		isOpenForward: {
			isShow: false,
			message: {},
		},
		isOpenSwiperImage: {
			isShow: false,
			activeIndex: 0,
			listImg: [],
		},
		isOpenCallAudio: {
			isShow: false,
			type: 'audio',
		},
		searchResult: false,
	},
	reducers: {
		toggleForward(state, action) {				
			state.isOpenForward.isShow = !state.isOpenForward.isShow
			state.isOpenForward.message = action.payload
		},
		toggleSwiperImage(state, action) {
			state.isOpenSwiperImage.isShow = action.payload.isShow
			state.isOpenSwiperImage.activeIndex = action.payload.activeIndex
			state.isOpenSwiperImage.listImg = action.payload.listImg
		},
		toggleCall(state, action) {
			state.isOpenCallAudio.isShow = action.payload.isShow
			state.isOpenCallAudio.type = action.payload.type ?? ''
		},
		toggleSearchResult(state, action) {
			if(action.payload) 
				state.searchResult = action.payload
			else 
				state.searchResult = !state.searchResult
		}
	},
})

export const { toggleForward, toggleSwiperImage, toggleCall, toggleSearchResult } = dialogSlice.actions
export default dialogSlice.reducer
