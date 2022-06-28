const Conversation = require('../app/models/Conversation')
const usersOnline = require('./managerUser')
const mongoose = require('mongoose')

const createGroup = async function (socket, io, data, callback = () => {}) {
    const newGroup = await Conversation.create({
        ...data,
        creator: new mongoose.Types.ObjectId(data.creator),
    })

    data?.members.forEach(userId => {
        const user = usersOnline.getUserById(userId)
        if (user) {
            io.to(user.socketId).emit('join-new-group', newGroup)
        }
    })
}

const joinGroup = function (socket, io, { _id }, callback = () => {}) {
    socket.join(_id)
}

module.exports = { createGroup, joinGroup }
