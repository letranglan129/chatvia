const handleUser = require('./handleUser')

function handleSocket(io) {
    io.sockets.on('connection', socket => {
        // User open app
        socket.on('joinApp', function (...args) {
            handleUser.joinApp(socket, io, ...args)
        })

        // User send message
        socket.on('chatMessage', function (...args) {
            handleUser.chatMessage(socket, io, ...args)
        })

        // // Listen client send notification to server and save notification to database
        // // Server send notification to all users
        socket.on('handleUser', function (...args) {
            handleUser.handleNotify(socket, io, ...args)
        })

        // // Get notitication by userId
        socket.on('getNotify', function (...args) {
            handleUser.getNotify(socket, io, ...args)
        })

        socket.on('readedNotify', function (...args) {
            handleUser.readedNotify(socket, io, ...args)
        })

        socket.on('getUnreadMessage', function (...args) {
            handleUser.getUnreadMessage(socket, io, ...args)
        })

        socket.on('setReadedConversation', function (...args) {
            handleUser.setReadedConversation(socket, io, ...args)
        })

        socket.on('set-message-emoji', function(...args) {
            handleUser.setMessageEmoji(socket, io, ...args)
        })

        // User leave app
        socket.on('disconnect', function (...args) {
            handleUser.disconnect(socket, io, ...args)
        })
    })
}

module.exports = handleSocket
