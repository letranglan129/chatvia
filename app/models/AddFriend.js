const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddFriend = Schema({
	senderId: {
		type: String,
		require: true,
	},
	receiverId: {
		require: true,
		type: String,
	},
})

module.exports = mongoose.model('AddFriend', AddFriend);