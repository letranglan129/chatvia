const express = require("express")
const router = express.Router()
const ConversationController = require("../app/controllers/ConversationController")

router.get("/:userId", ConversationController.getConversations)
router.post("/get-conversation", ConversationController.getOneConversation)
router.get("/get-conversation/:id", ConversationController.getLastMessageByConversationId)
router.post("/", ConversationController.createConversation)

module.exports = router
