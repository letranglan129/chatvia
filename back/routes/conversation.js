const express = require("express")
const router = express.Router()
const ConversationController = require("../app/controllers/ConversationController")

router.post('/get-members', ConversationController.getMembers)
router.post("/get-conversation", ConversationController.getOneConversation)
router.get("/get-conversation/:id", ConversationController.getLastMessageByConversationId)
router.get("/:userId", ConversationController.getConversations)
router.post("/", ConversationController.createConversation)

module.exports = router
