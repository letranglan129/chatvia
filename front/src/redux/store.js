import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import themeSlice from './slice/themeSlice'
import swiperSlice from './slice/swiperSlice'
import messageSlice from './slice/messageSlice'
import currentChatSlice from './slice/currentChatSlice'
import authSlice from './slice/authSlice'
import viewMessageSlice from './slice/viewMessageSlice'
import conversationSlice from './slice/conversationSlice'
import popperSlice from './slice/popperSlice'
import notifySlice from './slice/notifySlice'
import friendsSlice from './slice/friendsSlice'
import callSlice from './slice/dialog/callSlice'
import conversationInfoSlice from './slice/dialog/conversationInfoSlice'
import forwardDialogSlice from './slice/dialog/forwardSlice'
import createGroupSlice from './slice/dialog/createGroupSlice'
import searchResultSlice from './slice/dialog/searchResultSlice'
import swiperImageSlice from './slice/dialog/swiperImageSlice'
import onlineSlice from './slice/onlineSlice'

const persistConfig = {
    key: 'root',
    version: 1,
    whitelist: ['auth', 'theme'],
    blacklist: ['swiper', 'message', 'currentChat', 'viewMessage', 'popper'],
    storage,
}
const appReducer = combineReducers({
    theme: themeSlice,
    auth: authSlice,
    swiper: swiperSlice,
    message: messageSlice,
    currentChat: currentChatSlice,
    viewMessage: viewMessageSlice,
    popper: popperSlice,
    conversation: conversationSlice,
    notify: notifySlice,
    friend: friendsSlice,
    callDialog: callSlice,
    conversationInfoDialog: conversationInfoSlice,
    forwardDialog: forwardDialogSlice,
    createGroupDialog: createGroupSlice,
    searchResultDialog: searchResultSlice,
    swiperImageDialog: swiperImageSlice,
    online: onlineSlice,
})

const rootReducer = (state, action) => {
    if (action.type === 'auth/logoutSuccess') {
        state = {
            theme: state.theme,
            viewMessage: state.viewMessage,
        }
    }
    return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
})

export const persistor = persistStore(store)
