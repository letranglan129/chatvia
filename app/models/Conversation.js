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
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Conversation', Conversation)