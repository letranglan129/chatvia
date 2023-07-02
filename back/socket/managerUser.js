const UserModel = require('../app/models/User')

class User {
	constructor() {
		this.users = []
	}

	userJoin(userId, socketId, roomId) {
		const user = { userId, socketId, roomId }
		!this.users.some(user => user.userId === userId && user.roomId === roomId) && this.users.push(user)
		return user
	}

	getCurrentUser(userId, roomId) {
		return this.users.find(user => user.userId === userId && user.roomId === roomId)
	}

	userLeave(socketId) {
		return this.users.filter(user => user.socketId !== socketId)
	}

	getUserById(userId) {
		return this.users.find(user => user.userId === userId)
	}

	getRoomUsers(roomId) {
		return this.users.filter(user => user.roomId === roomId)
	}
	sendToSocketId(io, socketId, nameEvent, data) {
		io.to(socketId).emit(nameEvent, data)
	}
	getUserIds() {
		return [...new Set(this.users.map(user => user.userId))]
	}
	async getUserIdsInListFriend(userId) {
		const me = await UserModel.findById(userId)
		return [...new Set(this.users.filter(user => me.friends.includes(user.userId)).map(user => user.userId))]
	}
}

const usersOnline = new User()

module.exports = usersOnline
