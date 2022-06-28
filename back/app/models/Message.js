const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = Schema(
    {
        conversationId: {
            require: true,
            type: String,
        },
        senderId: {
            require: true,
            ref: 'User',
            type: String,
        },
        text: {
            type: String,
        },
        file: {
            name: {
                type: String,
            },
            type: {
                type: String,
            },
            size: {
                type: Number,
            },
            link: {
                type: String,
            },
        },
        status: {
            require: true,
            type: String,
            default: 'UNREAD',
        },
        type: {
            require: true,
            type: String,
            default: 'text',
        },
        imageGroup: {
            type: [String],

        },
        emoji: {
            type: Object,
        },
        viewer: {
            type: Array,
            require: true,
            default: [],
            
        },
        name: {
            type: String
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Message', Message)
