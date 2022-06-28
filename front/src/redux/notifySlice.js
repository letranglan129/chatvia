import { createSlice } from '@reduxjs/toolkit'
import { STATUS_NOTIFY } from '../constant'
import { socket } from '../socket'

export const notifySlice = createSlice({
    name: 'notify',
    initialState: {
        notifyList: [],
        newMessageNotify: [],
        dotNotify: {},
    },
    reducers: {
        pushNotify: (state, action) => {
            state.notifyList = state.notifyList.filter(
                notify => notify?.id !== action?.payload.id
            )

            if (Array.isArray(action.payload)) {
                state.notifyList = [...state.notifyList, ...action.payload]
            } else {
                state.notifyList = [...state.notifyList, action.payload]
            }
        },

        updateNotify: (state, action) => {
            const keys = Object.keys(action.payload)

            keys.forEach(key => {
                state.notifyList[key] = action.payload[key]
            })
        },

        readedNotify: state => {
            const unreadNotifyIdList = state.notifyList
                .filter(
                    notify =>
                        notify.status === STATUS_NOTIFY.sent || !notify.status
                )
                .map(notify => notify._id)

            socket.emit('readedNotify', unreadNotifyIdList)

            state.notifyList = state.notifyList.map(notify => {
                if (notify.status === STATUS_NOTIFY.sent || !notify.status) {
                    notify.status = STATUS_NOTIFY.seen
                }
                return notify
            })
        },

        addNewMessageNotify: (state, action) => {
            if (Array.isArray(action.payload)) {
                state.newMessageNotify.push(...action.payload)
            }

            if (typeof action.payload === 'string') {
                state.newMessageNotify.push(action.payload)
            }

            state.newMessageNotify = [...new Set(state.newMessageNotify)]
        },

        removeNewsMessageNotify: (state, action) => {
            if (Array.isArray(action.payload)) {
                state.newMessageNotify = state.newMessageNotify.filter(
                    element => !action.payload.includes(element)
                )
            }

            if (typeof action.payload === 'string') {
                state.newMessageNotify = state.newMessageNotify.filter(
                    element => element !== action.payload
                )
            }
        },
    },
})

export const {
    pushNotify,
    updateNotify,
    readedNotify,
    addNewMessageNotify,
    removeNewsMessageNotify,
} = notifySlice.actions
export default notifySlice.reducer
