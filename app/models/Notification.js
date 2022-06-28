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
			id: {
				require: true,
				type: String,
			},
			name: {
				require: true,
				type: String,
			},
		},
		receiver: {
			require: true,
			type: Array,
		},
		status: {
			type: String,
			default: STATUS_NOTIFY.sent,
			require: true,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model("Notification", Notification)
