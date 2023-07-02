const handleUser = require('./handleUser')
const handleGroup = require('./handleGroup')

function handleSocket(io) {
	io.on('connection', socket => {
		
		// User open app
		socket.on('joinApp', function (...args) {
			socket._id = args[0].userId
			console.log('/joinApp/', ...args)
			handleUser.joinApp(socket, io, ...args)
		})

		// User send message
		socket.on('chatMessage', function (...args) {
			console.log('/chatMessage/', ...args)
			handleUser.chatMessage(socket, io, ...args)
		})

		// Listen client send notification to server and save notification to database
		// Server send notification to all users
		socket.on('handleUser', function (...args) {
			console.log('/handleUser/', ...args)
			handleUser.handleNotify(socket, io, ...args)
		})

		// // Get notitication by userId
		socket.on('getNotify', function (...args) {
			console.log('/getNotify/', ...args)
			handleUser.getNotify(socket, io, ...args)
		})

		socket.on('readedNotify', function (...args) {
			console.log('/readedNotify/', ...args)
			handleUser.readedNotify(socket, io, ...args)
		})

		socket.on('getUnreadMessage', function (...args) {
			console.log('/getUnreadMessage/', ...args)
			handleUser.getUnreadMessage(socket, io, ...args)
		})

		socket.on('setReadedConversation', function (...args) {
			console.log('/setReadedConversation/', ...args)
			handleUser.setReadedConversation(socket, io, ...args)
		})

		socket.on('setMessageEmoji', function (...args) {
			console.log('/setMessageEmoji/', ...args)
			handleUser.setMessageEmoji(socket, io, ...args)
		})

		socket.on('createGroup', function (...args) {
			console.log('/createGroup/', ...args)
			handleGroup.createGroup(socket, io, ...args)
		})

		socket.on('deleteHistoryConversation', function (...args) {
			console.log('/deleteHistoryConversation/', ...args)
			handleGroup.deleteHistoryConversation(socket, io, ...args)
		})

		socket.on('getConversation', function (...args) {
			console.log('/getConversation/', ...args)
			handleGroup.getConversation(socket, io, ...args)
		})

		socket.on('joinGroup', function (...args) {
			console.log('/join-group/', ...args)
			handleGroup.joinGroup(socket, io, ...args)
		})

		socket.on('outGroup', function (...args) {
			console.log('/outGroup/', ...args)
			handleGroup.outGroup(socket, io, ...args)
		})

		socket.on('getUserOnline', function (...args) {
			console.log('/getUserOnline/', ...args)
			handleUser.getOnline(socket, io, ...args)
		})

		// User leave app
		socket.on('disconnect', function (...args) {
			console.log('/disconnect/', ...args)
			handleUser.disconnect(socket, io, ...args)
		})
	})
}

module.exports = handleSocket
