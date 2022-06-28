const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const User = require('../models/User')
const { CONVERSATION_TYPE } = require('../../contanst')
const { getLastMessage } = require('../../ulti')

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
            }).populate('creator', 'name avatar')

            const conversationPromise = conversation?.map(async item => {
                const lastMessage = await Message.findOne({
                    conversationId: item._id,
                })
                    .sort({ createdAt: -1 })
                    .limit(1)
                switch (item.type) {
                    case CONVERSATION_TYPE.group:
                        return Promise.resolve({
                            ...item._doc,
                            lastMessage: {
                                type: lastMessage?._doc.type || 'text',
                                text: getLastMessage(
                                    lastMessage?._doc.type,
                                    lastMessage?._doc.text
                                ),
                            },
                            senderId: lastMessage?._doc.senderId,
                            createdAt: lastMessage?._doc.createdAt,
                            updatedAt: lastMessage?._doc.updatedAt,
                        })

                    default:
                        const friendId = item?.members.find(
                            id => id !== req.user?._id.toString()
                        )
                        const friend = await User.findById(friendId)

                        return Promise.resolve({
                            ...item._doc,
                            name: friend.name,
                            avatar: friend.avatar,
                            lastMessage: {
                                type: lastMessage?._doc.type || 'text',
                                text: getLastMessage(
                                    lastMessage?._doc.type,
                                    lastMessage?._doc.text
                                ),
                            },
                            senderId: lastMessage?._doc.senderId,
                            createdAt: lastMessage?._doc.createdAt,
                            updatedAt: lastMessage?._doc.updatedAt,
                        })
                }
            })

            Promise.all(conversationPromise).then(data =>
                res.status(200).json(data)
            )
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
            })

            const friendInfo = conversation?.members.find(
                id => id !== user?._id.toString()
            )
            const friend = await User.findById(friendInfo)
            const lastMessage = await Message.findOne({
                conversationId: conversation._id,
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
                        text: getLastMessage(
                            lastMessage?._doc.type,
                            lastMessage?._doc.text
                        ),
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
            const lastMessage = await Message.findOne({ conversationId: id })
                .sort({ createdAt: -1 })
                .limit(1)
            res.status(200).json(lastMessage)
        } catch (err) {
            res.status(500).json(err)
        }
    }

    async getMembers(req, res) {
        try {
            const { members } = req.body
            const data = await User.find({ _id: { $in: members } })
            res.status(200).json(data)
        } catch (error) {}
    }
}

module.exports = new ConversationController()
