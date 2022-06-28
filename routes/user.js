const express = require('express')
const router = express.Router()
const UserController = require('../app/controllers/UserController')
const { isAuth } = require('../app/middleware/authMiddleware')

router.post("/login", UserController.login)
router.post("/register", UserController.createUser)
router.get("/logout", UserController.logout)
router.post("/refresh", UserController.refreshToken)
router.put('/update-info', isAuth, UserController.updateInfo)
router.get('/list-friend', isAuth, UserController.getListFriend)
router.get("/get-all", isAuth, UserController.getAllUser)
router.post("/search", isAuth, UserController.searchUser)
router.get("/:id", isAuth, UserController.getUser)

module.exports = router
