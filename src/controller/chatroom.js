const mongoose = require("mongoose");
const Chatroom = require('../models/chatroom');
const Messages = require('../models/message');

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
      // const lastchatrooms=await Chatroom.find({}, { sort: { createdAt: -1 } });
    //   const arr=[];
    //   chatrooms.forEach(async(element) => {
    //    const ar= await Messages.find({chatroomId:element._id})
    //  console.log("arrrrr",ar[ar.length-1].date)
    //   });
      // console.log("first",arr)
      // ,{ sort: { createdAt: -1 } }
      // chatroomId:element._id
  res.json(chatrooms);
};