const AddFriend = require('../app/models/AddFriend')
const Message = require('../app/models/Message')
const Notification = require('../app/models/Notification')
const User = require('../app/models/User')
const Conversation = require('../app/models/Conversation')
const usersOnline = require('./managerUser')

const {
    STATUS_NOTIFY,
    STATUS_RESPONSE,
    STATUS_MESSAGE,
} = require('../contanst')

const joinApp = function (socket, io, { userId, roomId }) {
    const user = usersOnline.userJoin(userId, socket.id, roomId)
    socket.join(user.roomId)

    io.to(user.roomId).emit('roomUsers', {
        roomId: user.roomId,
        users: usersOnline.getRoomUsers(user.roomId),
    })
}

const chatMessage = async function (
    socket,
    io,
    message,
    callback = () => {}
) {
    try {
        const newMessage = new Message({
            ...message,
            viewer: [message.senderId],
            conversationId: message.roomId,
            type: message.type || 'text',
        })
        const resMessage = await newMessage.save()

        await Conversation.updateOne({ _id: message.roomId }, { updatedAt: new Date() })

        // Send message to all users in room
        io.to(message.roomId).emit('message', resMessage)
        callback({ status: STATUS_RESPONSE.success, resMessage })
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
                        const friendSocket = usersOnline.getUserById(receiver?.id)
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
                            const user = usersOnline.getUserById(item?.id)
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

                const friendSocket = usersOnline.getUserById(receiverId)
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
                const friendSocket = usersOnline.getUserById(sender?.id)

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
        viewer: { 
            $nin: [userId]
        }
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
    { conversationId, userId },

    callback = () => {}
) {
    await Message.updateMany(
        {
            conversationId,
            status: STATUS_MESSAGE.unread,
        },
        {
            $push: {
                viewer: userId
            }
        },
        {
            new: true,
        }
    )
}

const setMessageEmoji = async function (
    socket,
    io,
    { _id, emoji, room },
    callback = () => {}
) {
    const message = await Message.findOneAndUpdate(
        { _id },
        {
            emoji,
        },
        {
            new: true,
        }
    )

    io.to(room).emit("set-message-emoji", {id: _id, emoji})
    
    callback({ status: STATUS_RESPONSE.success, message })
}

const disconnect = function (socket, io) {
    usersOnline.users = usersOnline.userLeave(socket.id)
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
