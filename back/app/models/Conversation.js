const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Conversation = Schema(
    {
        members: {
            require: true,
            type: Array,
        },
        type: {
            require: true,
            type: String,
        },
        name: {
            type: String,
        },
        avatar: {
            type: String,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        admin: {
            own: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            inspector: {
                type: [Schema.Types.ObjectId],
                default: [],
            },
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Conversation', Conversation)
