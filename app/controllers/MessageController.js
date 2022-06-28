const Message = require('../models/Message')
const Conversation = require('../models/Conversation')
const { STATUS_NOTIFY } = require('../../contanst')

class MessageController {
    // @route	[GET] /message/:conversationId
    // @desc	Get message
    // @access	Private
    async getMessage(req, res) {
        try {
            const message = await Message.find({
                conversationId: req.params.conversationId,
            })
            res.status(200).json(message)
        } catch (err) {
            res.status(500).json(err)
        }
    }

    // @route	[POST] /message
    // @desc	Create message add to DB
    // @access	Private
    async createMessage(req, res) {
        const newMessage = new Message({
            conversationId: req.body.conversationId,
            text: req.body.text,
            senderId: req.body.senderId,
        })
        try {
            await newMessage.save()
            res.status(200).json(newMessage)
        } catch (err) {
            res.status(500).json(err)
        }
    }

    // @route	[GET] /message/lastmessage/:userId
    // @desc	Get list last message
    // @access	Private
    getLastMessage(req, res) {
        const userId = req.params.userId

        Conversation.find({ members: { $in: [userId] } })
            .then(conversations => {
                const messagePromise = conversations.map(conversation =>
                    Message.findOne({ conversationId: conversation._id })
                        .sort({ createdAt: -1 })
                        .limit(1)
                )

                return Promise.all(messagePromise)
            })
            .then(result => res.status(200).json(result))
            .catch(err => res.status(500).json(err))
    }

    async updateMessage(req, res) {
        await Message.updateMany(
            {},
            {
                status: STATUS_NOTIFY.seen,
            }
        )
        res.json('ok')
    }

    async deleteMessage(req, res) {
        const { id } = req.params
        await Message.deleteOne({ _id: id })
        res.status(200).json({ msg: 'ok' })
    }
}

module.exports = new MessageController()
