const mongoose = require("mongoose")
const { STATUS_NOTIFY } = require('../../contanst')
const Schema = mongoose.Schema

const Notification = Schema(
	{
		content: {
			require: true,
			type: String,
		},
		type: {
			require: true,
			type: String,
		},
		sender: {
			ref: 'User',
			type: String,
			require: true,
		},
		receiver: {
			ref: 'User',
			type: String,
			require: true,
		},
		status: {
			type: String,
			default: STATUS_NOTIFY.sent,
			require: true,
		},
	},
	{ timestamps: true },
)

module.exports = mongoose.model("Notification", Notification)
