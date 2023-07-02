import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import createAxios from '../../ulti/createInstance'

export const getListFriend = createAsyncThunk(
    'friend/getListFriend',
    async (_, thunkAPI) => {
        const axios = createAxios()
        try {
            const { data } = await axios.get('/user/list-friend')
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

const friends = createSlice({
    name: 'friend',
    initialState: {
        list: [],
        status: null,
    },
    extraReducers: {
        [getListFriend.pending]: (state, action) => {
            state.status = 'loading'
        },
        [getListFriend.rejected]: (state, action) => {
            state.status = 'error'
        },
        [getListFriend.fulfilled]: (state, action) => {
            state.list = action.payload
            state.status = 'success'
        },
    },
    reducers: {
        removeFriend: (state, action) => {
            state.list = state.list.filter(
                (friend) => friend._id !== action.payload
            )
        },
    },
})

export const { removeFriend } = friends.actions
export default friends.reducer
