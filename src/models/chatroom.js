const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String
  },
  chatroomname:{
    type:String
  }
});

module.exports = mongoose.model("Chatroom", chatroomSchema);