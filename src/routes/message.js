const { getmessagesByChatroom } = require("../controller/message");

const router = require("express").Router();
router.post('/message/get',getmessagesByChatroom)


module.exports = router;