const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const User = require('../models/User')
const { CONVERSATION_TYPE, URI_HTTP_REG } = require('../../contanst')
const { getLastMessage } = require('../../ulti')
const AddFriend = require('../models/AddFriend')

class ConversationController {
	// @route	[POST] /conversation
	// @desc	Create conversation
	// @access	Private
	async createConversation(req, res) {
		const newConversation = new Conversation({
			members: [req.body?.senderId, req.body?.receiverId],
		})

		try {
			await newConversation.save()
			res.status(200).json(newConversation)
		} catch (err) {
			res.status(500).json(err)
		}
	}

	// @route	[GET]  /conversation/:userId
	// @desc	Get list conversation by userId
	// @access	Private
	async getConversations(req, res) {
		try {
			const conversation = await Conversation.find({
				members: { $in: [req.params.userId] },
			})
				.populate('creator', 'name avatar')
				.populate('members', 'name avatar')

			const conversationPromise = conversation?.map(async item => {
				const lastMessage = await Message.findOne({
					conversationId: item._id,
					hidden: {
						$ne: req.user._id.toString(),
					},
				})
					.sort({ updatedAt: -1 })
					.limit(1)

				const imageMessages = await Message.find({
					conversationId: item._id,
					type: 'imageGroup',
				})

				const fileMessages = await Message.find({
					conversationId: item._id,
					type: 'file',
				})

				const linkMessages = await Message.find({
					conversationId: item._id,
					type: 'link',
					text: {
						$regex: URI_HTTP_REG,
					},
				})

				switch (item.type) {
					case CONVERSATION_TYPE.group:
						return Promise.resolve({
							...item._doc,
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

					default:
						const friendId = item?.members.find(
							member => member._id.toString() !== req.user?._id.toString(),
						)
						const friend = await User.findById(friendId)

						return Promise.resolve({
							...item._doc,
							name: friend.name,
							avatar: friend.avatar,
							receiverId: friend._id,
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
				}
			})

			Promise.all(conversationPromise).then(data => res.status(200).json(data))
		} catch (err) {
			res.status(500).json(err)
		}
	}

	async getOneConversation(req, res) {
		try {
			const { friendId } = req.body
			const user = req.user

			const conversation = await Conversation.findOne({
				members: { $all: [user._id.toString(), friendId] },
				type: CONVERSATION_TYPE.personal,
			}).populate('members')

			const friendInfo = conversation?.members.find(members => members._id.toString() !== user?._id.toString())
			const friend = await User.findById(friendInfo)
			const lastMessage = await Message.findOne({
				conversationId: conversation._id,
				hidden: {
					$ne: req.user._id.toString(),
				},
			})
				.sort({ createdAt: -1 })
				.limit(1)

			conversation &&
				res.status(200).json({
					...conversation._doc,
					name: friend.name,
					avatar: friend.avatar,
					lastMessage: {
						type: lastMessage?._doc.type || 'text',
						text: getLastMessage(lastMessage?._doc.type, lastMessage?._doc.text),
					},
					createdAt: lastMessage?._doc.createdAt,
					updatedAt: lastMessage?._doc.updatedAt,
				})
		} catch (err) {
			res.status(400).json(err)
		}
	}

	async getLastMessageByConversationId(req, res) {
		try {
			const { id } = req.params
			const lastMessage = await Message.findOne({
				conversationId: id,
				hidden: {
					$ne: req.user._id.toString(),
				},
			})
				.sort({ createdAt: -1 })
				.limit(1)
			res.status(200).json(lastMessage)
		} catch (err) {
			res.status(500).json(err)
		}
	}

	async getMembers(req, res) {
		try {
			const { conversationId } = req.body
			const user = req.user
			const conversations = await Conversation.findById(conversationId).populate('members')

			const result = conversations.members.map(async member => {
				const conversation = await Conversation.findOne({
					members: {
						$all: [member._id.toString(), req.user._id.toString()],
					},
					type: 'PERSONAL',
				})
					.populate('creator', 'name avatar')
					.populate('members', 'name avatar')

				const lastMessage = await Message.findOne({
					conversationId: conversation._id,
					hidden: {
						$ne: req.user._id.toString(),
					},
				})
					.sort({ updatedAt: -1 })
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
					conversationId: conversation._id,
					type: 'link',
					text: {
						$regex: URI_HTTP_REG,
					},
				})

				const friendId = conversation?.members.find(
					member => member._id.toString() !== req.user?._id.toString(),
				)
				const friend = await User.findById(friendId)

				const addFriendInfo = await AddFriend.findOne({
					$or: [
						{
							senderId: req.user?._id.toString(),
							receiverId: member._id.toString(),
						},
						{
							senderId: member._id.toString(),
							receiverId: req.user?._id.toString(),
						},
					],
				})

				return {
					conversation: {
						...conversation._doc,
						name: friend.name,
						avatar: friend.avatar,
						receiverId: friend._id,
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
					},
					...member._doc,
					addFriendInfo,
				}
			})
			Promise.all(result)
				.then(data => res.status(200).json(data))
				.catch(err => {
					throw new Error(err)
				})
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = new ConversationController()
