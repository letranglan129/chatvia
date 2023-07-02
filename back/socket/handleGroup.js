const Conversation = require('../app/models/Conversation')
const Message = require('../app/models/Message')
const User = require('../app/models/User')
const { CONVERSATION_TYPE, URI_HTTP_REG } = require('../contanst')
const { getLastMessage } = require('../ulti')
const usersOnline = require('./managerUser')
const mongoose = require('mongoose')

const createGroup = async function (socket, io, data, callback = () => {}) {
	try {
		const newGroup = await Conversation.create({
			...data,
			creator: new mongoose.Types.ObjectId(data.creator),
		})

		data?.members.forEach(userId => {
			const user = usersOnline.getUserById(userId)
			if (user) {
				io.to(user.socketId).emit('joinNewGroup', newGroup)
			}
		})

		callback(true)
	} catch (error) {
		callback(false)
	}
}

const deleteHistoryConversation = async function (socket, io, { conversationId, userId }, callback = () => {}) {
	try {
		const conversation = await Conversation.findById(conversationId).populate('creator', 'name avatar')
		const result = await Message.updateMany(
			{
				conversationId,
			},
			{
				$addToSet: {
					hidden: userId,
				},
			},
			{
				new: true,
			},
		)

		switch (conversation.type) {
			case CONVERSATION_TYPE.group:
				socket.emit('deleteHistoryConversation', {
					...result,
					conversation: {
						...conversation._doc,
						lastMessage: null,
						senderId: null,
					},
				})
				break

			default:
				const friendId = conversation?.members.find(id => id !== userId)
				const friend = await User.findById(friendId)

				socket.emit('deleteHistoryConversation', {
					...result,
					conversation: {
						...conversation._doc,
						name: friend.name,
						avatar: friend.avatar,
						lastMessage: null,
						senderId: null,
					},
				})
		}
	} catch (error) {
		console.log(error)
		socket.emit('error', err)
	}
}

const joinGroup = function (socket, io, { _id }, callback = () => {}) {
	socket.join(_id)
}

const outGroup = async function (socket, io, { conversationId }, callback = () => {}) {
	try {
		const result = await Conversation.findByIdAndUpdate(
			conversationId,
			{
				$pull: {
					members: socket._id,
				},
			},
			{
				new: true,
			},
		)

		socket.emit('outGroup', result)
	} catch (error) {
		socket.emit('error', err)
	}
}

const getConversation = async function (socket, io, { conversationId, userId }, callback) {
	try {
		const conversation = await Conversation.findById(conversationId).populate('creator', 'name avatar')

		const lastMessage = await Message.findOne({
			conversationId: conversation._id,
			hidden: {
				$ne: userId,
			},
		})
			.sort({ createdAt: -1 })
			.limit(1)

		const imageMessages = await Message.find({
			conversationId: conversation._id,
			type: 'imageGroup',
		})

		const fileMessages = await Message.find({
			conversationId: conversation._id,
			type: 'file',
		})

		const linkMessages = await Message.find({
			conversationId: conversation._id._id,
			type: 'link',
			text: {
				$regex: URI_HTTP_REG,
			},
		})
		console.log(lastMessage)
		switch (conversation.type) {
			case CONVERSATION_TYPE.group:
				socket.emit('getConversation', {
					...conversation._doc,
					imageMessages,
					fileMessages,
					linkMessages,
					lastMessage: {
						type: lastMessage?._doc.type || 'text',
						text: getLastMessage(lastMessage?._doc.type, lastMessage?._doc.text),
					},
					senderId: lastMessage?._doc.senderId,
					createdAt: lastMessage?._doc.createdAt,
					updatedAt: lastMessage?._doc.updatedAt,
				})
				break

			default:
				const friendId = conversation?.members.find(id => id !== userId)
				const friend = await User.findById(friendId)

				socket.emit('getConversation', {
					...conversation._doc,
					name: friend.name,
					avatar: friend.avatar,
					imageMessages,
					fileMessages,
					linkMessages,
					lastMessage: {
						type: lastMessage?._doc.type || 'text',
						text: getLastMessage(lastMessage?._doc.type, lastMessage?._doc.text),
					},
					senderId: lastMessage?._doc.senderId,
					createdAt: lastMessage?._doc.createdAt,
					updatedAt: lastMessage?._doc.updatedAt,
				})
				break
		}
	} catch (err) {
		console.log(err)
		socket.emit('error', err)
	}
}

module.exports = { createGroup, joinGroup, deleteHistoryConversation, getConversation, outGroup }
