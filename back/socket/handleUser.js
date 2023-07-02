const AddFriend = require('../app/models/AddFriend')
const Message = require('../app/models/Message')
const Notification = require('../app/models/Notification')
const User = require('../app/models/User')
const Conversation = require('../app/models/Conversation')
const usersOnline = require('./managerUser')
const jwt = require('jsonwebtoken')

const { STATUS_NOTIFY, STATUS_RESPONSE, STATUS_MESSAGE, URI_HTTP_REG } = require('../contanst')

const setInfo = socket => {
	const key = 'refreshToken='
	const start = socket.handshake.headers.cookie.indexOf(key)
	if (start !== -1) {
		const end = socket.handshake.headers.cookie.indexOf(';', start)
		const refreshToken = socket.handshake.headers.cookie.substring(start + key.length, end !== -1 ? end : undefined)

		socket.email = jwt.decode(refreshToken).email
	} else {
		console.log('Không tìm thấy refreshToken trong chuỗi.')
	}
}

const joinApp = async function (socket, io, { userId, roomId }) {
	const conversations = await Conversation.find({
		members: { $in: [userId] },
	})
	usersOnline.userJoin(userId, socket.id, null)
	conversations.forEach(conversation => {
		usersOnline.userJoin(userId, socket.id, conversation._id.toString())
		socket.join(conversation._id.toString())
	})

	console.log(usersOnline)
	// io.to(user.roomId).emit('roomUsers', {
	// 	roomId: user.roomId,
	// 	users: usersOnline.getRoomUsers(user.roomId),
	// })
}

const chatMessage = async function (socket, io, message, callback = () => {}) {
	try {
		message.type = URI_HTTP_REG.test(message?.text) ? 'link' : message?.type

		const newMessage = new Message({
			...message,
			viewer: [message.senderId],
			conversationId: message.roomId,
			type: message.type || 'text',
		})
		const saveMessage = await newMessage.save()
		const resMessage = await Message.findById(saveMessage._id).populate('senderId', 'name, avatar')

		await Conversation.updateOne({ _id: message.roomId }, { updatedAt: new Date() })

		// Send message to all users in room
		io.to(message.roomId).emit('message', resMessage)
		callback({ status: STATUS_RESPONSE.success, resMessage })
	} catch (err) {
		callback({ status: 'ERROR', err })
	}
}

const handleNotify = async function (socket, io, data, callback = () => {}) {
	try {
		switch (data.type) {
			case 'ADD_FRIEND': {
				const { sender, receiver, type } = data
				const notification = new Notification({
					content: `<p><strong>${sender.name}</strong> đã gửi lời mời kết bạn cho bạn</p>`,
					sender: sender?.id,
					receiver: receiver.id,
					status: STATUS_NOTIFY.sent,
					type,
				})
				const addFriendRequest = new AddFriend({
					senderId: sender?.id,
					receiverId: receiver?.id,
				})
				try {
					const res = await notification.save()
					const newNotify = await Notification.findById(res._id).populate('sender').populate('receiver')

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
							io.to(socket.id).emit('sendAddFriendStatus', {
								status: friendSocket?.socketId ? STATUS_RESPONSE.success : STATUS_RESPONSE.error,
								senderId: sender?.id,
								receiverId: receiver?.id,
							})
							io.to(friendSocket?.socketId).emit('receiveNotify', newNotify)

							callback({ status: STATUS_RESPONSE.success })
						})
						.catch(err => callback({ status: STATUS_RESPONSE.error }))
				} catch (err) {
					console.log(err)
					callback({ status: STATUS_RESPONSE.error })
				}
				break
			}

			// Revoke add friend request
			case 'REVOKE_ADD_FRIEND': {
				const { senderId, receiverId } = data
				if (senderId && receiverId) {
					await Notification.findOneAndDelete({
						sender: senderId,
						receiver: receiverId,
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
				break
			}

			case 'ACCEPT_FRIEND': {
				const { sender, receiver } = data

				const isExistAddFriendRequest = await AddFriend.exists({
					senderId: sender?.id,
					receiverId: receiver?.id,
				})

				if (sender && receiver && isExistAddFriendRequest) {
					const acceptNotifyOfReceiver = await Notification.findOneAndUpdate(
						{
							sender: sender?.id,
							receiver: receiver?.id,
							type: 'ADD_FRIEND',
						},
						{
							content: `<p>Bạn đã chấp nhận mời kết bạn của <strong>${sender?.name}</strong></p>`,
							type: 'ACCEPT_FRIEND',
						},
						{
							new: true,
						},
					)

					const accecptNotifyOfSender = await Notification.create({
						sender: receiver?.id,
						receiver: sender.id,
						content: `<p><strong>${receiver?.name}</strong> đã chấp nhận mời kết bạn của bạn</p>`,
						type: 'ACCEPT_FRIEND',
					})

					const newNotifyOfSender = await Notification.findById(accecptNotifyOfSender._id)
						.populate('sender')
						.populate('receiver')
					const newNotifyOfReceiver = await Notification.findById(acceptNotifyOfReceiver._id)
						.populate('sender')
						.populate('receiver')

					const newConversation = new Conversation({
						members: [sender?.id, receiver?.id],
						type: 'PERSONAL',
					})
					await newConversation.save()

					await AddFriend.findOneAndDelete({
						senderId: sender?.id,
						receiverId: receiver?.id,
					})
					await User.updateOne({ _id: sender?.id }, { $push: { friends: receiver?.id } })
					await User.updateOne({ _id: receiver?.id }, { $push: { friends: sender?.id } })
					const friendSocket = usersOnline.getUserById(sender?.id)

					io.to(socket.id).emit('acceptFriend', {
						status: STATUS_RESPONSE.success,
						id: sender?.id,
					})
					io.to(friendSocket?.socketId).emit('acceptFriend', {
						status: STATUS_RESPONSE.success,
						id: receiver?.id,
					})

					io.to(friendSocket?.socketId).emit('receiveNotify', newNotifyOfSender)
					io.to(socket.id).emit('receiveNotify', newNotifyOfReceiver)

					callback({ status: STATUS_RESPONSE.success })
				}
				break
			}

			case 'REJECT_FRIEND': {
				const { sender, receiver } = data
				if (sender && receiver) {
					await Notification.findOneAndUpdate(
						{
							sender: sender?.id,
							receiver: receiver?.id,
							type: 'ADD_FRIEND',
						},
						{
							content: `<p>Bạn đã từ chối lời mới kết bạn của <strong>${receiver?.name}</strong></p>`,
						},
					)
					await AddFriend.findOneAndDelete({
						senderId: sender?.id,
						receiverId: receiver?.id,
					})
					callback({ status: STATUS_RESPONSE.success })
				}
				callback({ status: STATUS_RESPONSE.error })
				break
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
				break
			}
			case 'DELETE_FRIEND': {
				try {
					const { receiver } = data
					const result = await User.findByIdAndUpdate(
						socket._id,
						{
							$pull: {
								friends: receiver,
							},
						},
						{
							new: true,
						},
					)

					await User.findByIdAndUpdate(receiver, {
						$pull: {
							friends: socket._id,
						},
					})

					const friendSocket = usersOnline.getUserById(receiver)
					io.to(friendSocket?.socketId).emit('deleteFriend', { ...result, friendId: socket._id })
					io.to(socket.id).emit('deleteFriend', { ...result, friendId: receiver })
				} catch (error) {
					console.log(error)
					socket.emit('error', error)
				}
				break
			}
		}
	} catch (err) {
		console.log(err)
	}
}

const getNotify = function (socket, io, { userId }, callback = () => {}) {
	Notification.find({ receiver: userId })
		.populate('sender')
		.populate('receiver')
		.then(res => {
			callback({ data: res })
		})
}

const readedNotify = async function (socket, io, data, callback = () => {}) {
	if (Array.isArray(data)) {
		await Notification.updateMany({ _id: { $in: data } }, { status: STATUS_NOTIFY.seen })
		callback({ status: STATUS_RESPONSE.success })
	}
}

const getUnreadMessage = async function (socket, io, { userId }, callback = () => {}) {
	const conversation = await Conversation.find({
		members: { $in: [userId] },
	})
	const listConversationId = conversation.map(item => item._id)

	const messageUnread = await Message.find({
		conversationId: { $in: listConversationId },
		senderId: { $ne: userId },
		viewer: {
			$nin: [userId],
		},
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

	callback = () => {},
) {
	await Message.updateMany(
		{
			conversationId,
			status: STATUS_MESSAGE.unread,
		},
		{
			$addToSet: {
				viewer: userId,
			},
		},
		{
			new: true,
			timestamps: false,
		},
	)
}

const setMessageEmoji = async function (socket, io, { _id, emoji, room }, callback = () => {}) {
	const message = await Message.findOneAndUpdate(
		{ _id },
		{
			emoji,
		},
		{
			new: true,
		},
	)

	io.to(room).emit('setMessageEmoji', { id: _id, emoji })

	callback({ status: STATUS_RESPONSE.success, message })
}

const disconnect = function (socket, io) {
	usersOnline.users = usersOnline.userLeave(socket.id)
}

const getOnline = async function (socket, io, { userId }) {
	setInterval(async function () {
		const friendIds = await usersOnline.getUserIdsInListFriend(userId)
		io.to(socket.id).emit('responseGetOnline', friendIds)
	}, 3000)
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
	getOnline,
	setInfo,
}
