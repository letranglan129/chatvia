const AddFriend = require('../app/models/AddFriend')
const Message = require('../app/models/Message')
const Notification = require('../app/models/Notification')
const User = require('../app/models/User')
const Conversation = require('../app/models/Conversation')

let users = []

const userJoin = (userId, socketId, roomId) => {
    const user = { userId, socketId, roomId }
    !users.some(user => user.userId === userId && user.roomId === roomId) &&
        users.push(user)
    return user
}

const getCurrentUser = (userId, roomId) =>
    users.find(user => user.userId === userId && user.roomId === roomId)

const userLeave = socketId => users.filter(user => user.socketId !== socketId)

const getUserById = userId => users.find(user => user.userId === userId)

const getRoomUsers = roomId => users.filter(user => user.roomId === roomId)

const {
    STATUS_NOTIFY,
    STATUS_RESPONSE,
    STATUS_MESSAGE,
} = require('../contanst')

const joinApp = function (socket, io, { userId, roomId }) {
    const user = userJoin(userId, socket.id, roomId)
    socket.join(user.roomId)

    io.to(user.roomId).emit('roomUsers', {
        roomId: user.roomId,
        users: getRoomUsers(user.roomId),
    })
}

const chatMessage = async function (
    socket,
    io,
    { senderId, text, roomId, type, imageGroup, file },
    callback = () => {}
) {
    try {
        const newMessage = new Message({
            senderId,
            text,
            file,
            imageGroup,
            conversationId: roomId,
            type: type || 'text',
        })
        const resMessage = await newMessage.save()

        await Conversation.updateOne({ _id: roomId }, { updatedAt: new Date() })

        // Send message to all users in room
        io.to(roomId).emit('message', resMessage)
        callback({ status: STATUS_RESPONSE.success })
    } catch (err) {
        callback({ status: 'ERROR', err })
    }
}

const handleNotify = async function (socket, io, data, callback = () => {}) {
    switch (data.type) {
        case 'ADD_FRIEND': {
            const { sender, receiver, type } = data
            const notification = new Notification({
                content: `<p><strong>${sender.name}</strong> đã gửi lời mời kết bạn cho bạn</p>`,
                sender: {
                    id: sender?.id,
                    name: sender?.name,
                    avatar: sender?.avatar,
                },
                receiver: Array.isArray(receiver) ? receiver : [receiver],
                status: STATUS_NOTIFY.sent,
                type,
            })
            const addFriendRequest = new AddFriend({
                senderId: sender?.id,
                receiverId: receiver?.id,
            })
            try {
                const res = await notification.save()

                // Check exist add friend request
                AddFriend.findOne({
                    senderId: sender?.id,
                    receiverId: receiver?.id,
                })
                    .then(async data => {
                        await addFriendRequest.save()

                        //Get socketId of sender
                        const friendSocket = getUserById(receiver?.id)
                        // Send notification status (success or error) to sender
                        io.to(friendSocket?.socketId).emit(
                            'sendAddFriendStatus',
                            {
                                status: friendSocket?.socketId
                                    ? STATUS_RESPONSE.success
                                    : STATUS_RESPONSE.error,
                                senderId: sender?.id,
                                receiverId: receiver?.id,
                            }
                        )

                        for (let item of res.receiver) {
                            const user = getUserById(item?.id)
                            user &&
                                io.to(user.socketId).emit('receiveNotify', res)
                        }

                        callback({ status: STATUS_RESPONSE.success })
                    })
                    .catch(err => callback({ status: STATUS_RESPONSE.error }))
            } catch (err) {
                callback({ status: STATUS_RESPONSE.error })
            }
            break
        }

        // Revoke add friend request
        case 'REVOKE_ADD_FRIEND': {
            const { senderId, receiverId } = data
            if (senderId && receiverId) {
                await Notification.findOneAndDelete({
                    'sender.id': senderId,
                    'receiver.id': receiverId,
                    type: 'ADD_FRIEND',
                })
                await AddFriend.findOneAndDelete({
                    senderId,
                    receiverId,
                })
                callback({ status: STATUS_RESPONSE.success })

                const friendSocket = getUserById(receiverId)
                io.to(friendSocket?.socketId).emit('revokeAddFriend', {
                    status: STATUS_RESPONSE.success,
                    senderId,
                    receiverId,
                })
            }
        }

        case 'ACCEPT_FRIEND': {
            const { sender, receiver } = data

            const isExistAddFriendRequest = await AddFriend.exists({
                senderId: sender?.id,
                receiverId: receiver?.id,
            })

            if (sender && receiver && isExistAddFriendRequest) {
                const acceptNotifyOfReceiver =
                    await Notification.findOneAndUpdate(
                        {
                            'sender.id': sender?.id,
                            'receiver.id': receiver?.id,
                            type: 'ADD_FRIEND',
                        },
                        {
                            content: `<p>Bạn đã chấp nhận mời kết bạn của <strong>${sender?.name}</strong></p>`,
                            type: 'ACCEPT_FRIEND',
                        },
                        {
                            new: true,
                        }
                    )

                const accecptNotifyOfSender = await Notification.create({
                    sender: {
                        id: receiver?.id,
                        name: receiver?.name,
                        avatar: receiver?.avatar,
                    },
                    receiver: [sender],
                    content: `<p><strong>${receiver?.name}</strong> đã chấp nhận mời kết bạn của bạn</p>`,
                    type: 'ACCEPT_FRIEND',
                })

                await AddFriend.findOneAndDelete({
                    senderId: sender?.id,
                    receiverId: receiver?.id,
                })
                await User.updateOne(
                    { _id: sender?.id },
                    { $push: { friends: receiver?.id } }
                )
                await User.updateOne(
                    { _id: receiver?.id },
                    { $push: { friends: sender?.id } }
                )
                const friendSocket = getUserById(sender?.id)

                io.to(socket.id).emit('acceptFriend', {
                    status: STATUS_RESPONSE.success,
                    id: sender?.id,
                })
                io.to(friendSocket?.socketId).emit('acceptFriend', {
                    status: STATUS_RESPONSE.success,
                    id: receiver?.id,
                })

                io.to(friendSocket.socketId).emit(
                    'receiveNotify',
                    accecptNotifyOfSender
                )
                io.to(socket.id).emit('receiveNotify', acceptNotifyOfReceiver)

                callback({ status: STATUS_RESPONSE.success })
            }
        }

        case 'REJECT_FRIEND': {
            const { sender, receiver } = data
            if (sender && receiver) {
                await Notification.findOneAndUpdate(
                    {
                        'sender.id': sender?.id,
                        'receiver.id': receiver?.id,
                        type: 'ADD_FRIEND',
                    },
                    {
                        content: `<p>Bạn đã từ chối lời mới kết bạn của <strong>${receiver?.name}</strong></p>`,
                    }
                )
                await AddFriend.findOneAndDelete({
                    senderId: sender?.id,
                    receiverId: receiver?.id,
                })
                callback({ status: STATUS_RESPONSE.success })
            }
            callback({ status: STATUS_RESPONSE.error })
        }

        case 'GET_FRIEND_LIST': {
            const { userId } = data
            const listFriend = await User.findOne({
                _id: userId,
            }).select('friends')

            callback({
                status: STATUS_RESPONSE.success,
                data: listFriend?.friends,
            })
        }
    }
}

const getNotify = function (socket, io, { userId }, callback = () => {}) {
    Notification.find({ 'receiver.id': { $in: [userId] } }).then(res => {
        callback({ data: res })
    })
}

const readedNotify = async function (socket, io, data, callback = () => {}) {
    if (Array.isArray(data)) {
        await Notification.updateMany(
            { _id: { $in: data } },
            { status: STATUS_NOTIFY.seen }
        )
        callback({ status: STATUS_RESPONSE.success })
    }
}

const getUnreadMessage = async function (
    socket,
    io,
    { userId },
    callback = () => {}
) {
    const conversation = await Conversation.find({
        members: { $in: [userId] },
    })
    const listConversationId = conversation.map(item => item._id)

    const messageUnread = await Message.find({
        conversationId: { $in: listConversationId },
        senderId: { $ne: userId },
        status: STATUS_MESSAGE.unread,
    })

    callback({
        status: STATUS_RESPONSE.success,
        listConversationId,
        messageUnread,
    })
}

const setReadedConversation = async function (
    socket,
    io,
    { conversationId },

    callback = () => {}
) {
    await Message.updateMany(
        {
            conversationId,
            status: STATUS_MESSAGE.unread,
        },
        {
            status: STATUS_MESSAGE.readed,
        },
        {
            new: true,
        }
    )
}

const setMessageEmoji = async function (
    socket,
    io,
    { _id, emoji },
    callback = () => {}
) {
    const message = await Message.findOneAndUpdate(
        { _id: _id },
        {
            emoji,
        },
        {
            new: true,
        }
    )
    callback({ status: STATUS_RESPONSE.success, message })
}

const disconnect = function (socket, io) {
    users = userLeave(socket.id)
}

module.exports = {
    joinApp,
    chatMessage,
    handleNotify,
    getNotify,
    readedNotify,
    getUnreadMessage,
    setReadedConversation,
    setMessageEmoji,
    disconnect,
}
