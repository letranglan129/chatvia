import { createSlice } from '@reduxjs/toolkit'
import { SWIPER_PARAMS } from '../constant/index'

export const swiperSlice = createSlice({
	name: 'swiper',
	initialState: {
		isDraggable: false,
		swiperImage: {
			zoom: SWIPER_PARAMS.defaultZoom,
			rotate: SWIPER_PARAMS.defaultRotate,
			version: 0,
		},
	},
	reducers: {
		zoomIn(state, action) {
			let newScale
			if (typeof action === 'number') newScale = state.swiperImage.zoom + action
			else newScale = state.swiperImage.zoom + SWIPER_PARAMS.zoomStep

			newScale = newScale >= SWIPER_PARAMS.maxZoom ? SWIPER_PARAMS.maxZoom : newScale
			state.swiperImage.zoom = newScale
			state.swiperImage.version = newScale !== SWIPER_PARAMS.maxZoom ? state.swiperImage.version + 1 : state.swiperImage.version
            state.isDraggable = state.swiperImage.zoom > 1
		},

		zoomOut(state, action) {
			let newScale

			if (typeof action === 'number') newScale = state.swiperImage.zoom - action
			else newScale = state.swiperImage.zoom - SWIPER_PARAMS.zoomStep

			newScale = newScale <= SWIPER_PARAMS.minZoom ? SWIPER_PARAMS.minZoom : newScale
			state.swiperImage.zoom = newScale
			state.swiperImage.version = newScale !== SWIPER_PARAMS.minZoom ? state.swiperImage.version + 1 : state.swiperImage.version
            state.isDraggable = state.swiperImage.zoom > 1
		},

		reset(state) {
			state.swiperImage.zoom = SWIPER_PARAMS.defaultZoom
			state.swiperImage.rotate = SWIPER_PARAMS.defaultRotate
			state.swiperImage.version = state.swiperImage.version + 1
		},

		rotate(state) {
			state.swiperImage.rotate = state.swiperImage.rotate === 270 ? 0 : state.swiperImage.rotate + 90
		},

		wheelZoom(state, action) {
			if (action.payload > 0) {
				swiperSlice.caseReducers.zoomOut(state, 0.1)
			} else {
				swiperSlice.caseReducers.zoomIn(state, 0.1)
			}
		},
	},
})

export const { zoomIn, zoomOut, reset, rotate, wheelZoom } = swiperSlice.actions
export default swiperSlice.reducer