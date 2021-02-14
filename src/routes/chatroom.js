
const { createChatroom, getAllChatrooms } = require('../controller/chatroom')
const router = require("express").Router();
router.post('/createchatroom/chat',createChatroom)
router.get('/getAllchatrooms',getAllChatrooms)

module.exports = router;