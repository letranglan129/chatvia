import { createSlice } from '@reduxjs/toolkit'

export const auth = createSlice({
    name: 'auth',
    initialState: {
        currentUser: {
            isFetching: false,
            user: null,
            isError: false,
        },
    },
    reducers: {
        loginStart: state => {
            state.currentUser.isFetching = true
            state.currentUser.isError = false
            state.currentUser.user = null
        },
        loginSuccess: (state, action) => {
            state.currentUser.isFetching = false
            state.currentUser.user = action.payload
            state.currentUser.isError = false
        },
        loginError: state => {
            state.currentUser.isFetching = false
            state.currentUser.user = null
            state.currentUser.isError = true
        },
        logoutStart: state => {
            state.currentUser.isFetching = true
        },
        logoutSuccess: state => {
            state.currentUser.isFetching = false
            state.currentUser.user = null
            state.currentUser.isError = false
            window.indexedDB.databases().then(db => {
                db.forEach(({ name }) => {
                    window.indexedDB.deleteDatabase(name)
                })
            })
        },
        logoutError: state => {
            state.currentUser.isFetching = false
            state.currentUser.isError = true
        },
        addFriend: (state, action) => {
            state.currentUser.user?.friends.push(action.payload)
        },
        getFriendList: (state, action) => {
            state.currentUser.user.friends = action.payload
        },
        updateInfo: (state, action) => {
            state.currentUser.user = {
                ...state.currentUser.user,
                ...action.payload,
            }
        }
        // removeFriend: (state, action) => {
        // 	state.currentUser.user?.friends = state.currentUser.user?.friends.filter(
        // 		(friend) => friend.id !== action.payload
        // 	)
        // }
    },
})

export const {
    loginError,
    loginStart,
    loginSuccess,
    logoutStart,
    logoutSuccess,
    logoutError,
    addFriend,
    getFriendList,
    updateInfo,
} = auth.actions
export default auth.reducer
