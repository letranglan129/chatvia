const cors = require('cors')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
var cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 5000
const db = require('./db/config')
const route = require('./routes')

// Connect to MongooseDB
db.connect()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// Route
route(app)

require('./socket')(io)

server.listen(port, () => console.log(`http://localhost:${port}`))
