const express = require('express');
const MessageController = require('../app/controllers/MessageController');
const router = express.Router()
const { isAuth } = require('../app/middleware/authMiddleware');

router.get("/update-message", MessageController.updateMessage)
router.get("/lastmessage/:userId", isAuth, MessageController.getLastMessage)
router.get("/:conversationId", isAuth, MessageController.getMessage)
router.delete('/:id', isAuth, MessageController.deleteMessage)
router.post("/", isAuth, MessageController.createMessage)

module.exports = router
