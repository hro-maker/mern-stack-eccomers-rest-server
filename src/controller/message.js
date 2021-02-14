const Message = require('../models/message')

exports.getmessagesByChatroom=(req,res)=>{
    const chatroomId=req.body.chatroomId
    console.log(chatroomId)
    Message.find({chatroomId}).exec((error, messages) => {
        if (error) {
            return res.status(400).json({ error });
          }
          if(messages.length > 0){
            return  res.status(200).json({messages})
          }else{
            return  res.status(200).json({messages})
          }

    })
    
}