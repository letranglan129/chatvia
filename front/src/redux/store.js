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
import themeSlice from './themeSlice'
import dialogSlice from './dialogSlice'
import swiperSlice from './swiperSlice'
import messageSlice from './messageSlice'
import currentChatSlice from './currentChatSlice'
import authSlice from './authSlice'
import viewMessageSlice from './viewMessageSlice'
import conversationSlice from './conversationSlice'
import popperSlice from './popperSlice'
import notifySlice from './notifySlice'
import friendsSlice from './friendsSlice'

const persistConfig = {
    key: 'root',
    version: 1,
    whitelist: ['auth', 'theme'],
    blacklist: [
        'dialog',
        'swiper',
        'message',
        'currentChat',
        'viewMessage',
        'popper',
    ],
    storage,
}
const appReducer = combineReducers({
    theme: themeSlice,
    auth: authSlice,
    dialog: dialogSlice,
    swiper: swiperSlice,
    message: messageSlice,
    currentChat: currentChatSlice,
    viewMessage: viewMessageSlice,
    popper: popperSlice,
    conversation: conversationSlice,
    notify: notifySlice,
    friend: friendsSlice,
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
    middleware: getDefaultMiddleware =>
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
