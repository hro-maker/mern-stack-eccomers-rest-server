const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatroomId: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Chatroom is required!",
    ref: "Chatroom",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Chatroom is required!",
    ref: "User",
  },
  date: {
    type: Date,
  },
  message: {
    type: String,
    required: "Message is required!",
  },
},{ timestamps: true });

module.exports = mongoose.model("Message", messageSchema);