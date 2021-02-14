const mongoose = require("mongoose");
const Chatroom = require('../models/chatroom');

exports.createChatroom = async (req, res) => {
  const { name,chatroomname } = req.body;
  const chatroomExists = await Chatroom.findOne({ name });
  if (chatroomExists){
      return res.status(200).json({chatroomExists})
  }else{
    const chatroom = new Chatroom({
        name,
        chatroomname
      });
    const chatrom=  await chatroom.save();
    
      res.status(201).json({
        chatrom,
      });
  }

  
};

exports.getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find({});

  res.json(chatrooms);
};