const express = require('express')
const router = express.Router()
const AuthController = require('../app/controllers/AuthController')
const {isAuth} = require('../app/middleware/authMiddleware')

router.post('/login', AuthController.login)
router.post('/register', AuthController.createUser)
router.post('/refresh', AuthController.refreshToken)
router.get('/logout', AuthController.logout)
router.get('/get', isAuth, AuthController.getAllUser)
router.post('/search', isAuth, AuthController.searchUser)

module.exports = router