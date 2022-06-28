const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = Schema(
	{
		name: {
			type: String,
			require: true,
			minLength: 6,
		},
		email: {
			type: String,
			require: true,
			minLength: 10,
		},
		password: {
			type: String,
			require: true,
		},
		avatar: {
			type: String,
		},
		birth: {
			type: Date,
		},
		phoneNumber: {
			type: Number,
		},
		friends: {
			type: Array,
		}
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('User', User)
