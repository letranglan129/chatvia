import { createSlice } from '@reduxjs/toolkit'

export const swiperImageSlice = createSlice({
    name: 'dialog',
    initialState: {
        swiperImage: {
            isShow: false,
            activeIndex: 0,
            listImg: [],
        },
    },
    reducers: {
        toggleSwiperImage(state, action) {
            state.swiperImage.isShow = action.payload.isShow
            state.swiperImage.activeIndex = action.payload.activeIndex || 0
            state.swiperImage.listImg = action.payload.listImg || []
        },
    },
})

export const { toggleSwiperImage } = swiperImageSlice.actions
export default swiperImageSlice.reducer
