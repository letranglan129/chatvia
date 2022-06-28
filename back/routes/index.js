const userSite = require('./user')
const conversationSite = require('./conversation')
const messageSite = require('./message')
const { isAuth } = require('../app/middleware/authMiddleware')

function route(app) {
    app.use('/user', userSite)
    app.use('/conversation', isAuth, conversationSite)
    app.use('/message', messageSite)
    app.get('/', (req, res) => res.json('hello'))
}

module.exports = route
