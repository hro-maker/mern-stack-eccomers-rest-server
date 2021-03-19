const app = require("express")();
const server = require("http").createServer(app);
const jwt = require("jsonwebtoken");
const Message = require("./models/message");
const User = require("./models/user");
const io = require("socket.io")(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload._id;
    next();
  } catch (err) {
    console.log("error", err);
  }
});
io.on("connection",  (socket) => {
  console.log("Connected: ", socket.userId);
 

  socket.on("disconnect", () => {
    console.log("Connected: ", socket.userId);
    
    console.log("Disconnected: " + socket.userId);
  });
  socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("a user joined chatrom:", chatroomId);
  });
  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("user leavd room");
    io.to(chatroomId).emit("adminMessage", {
      message: "user lived chat ",
      userId: socket.userId,
    });
  });

  socket.on("typing", async ({ chatroomId, user }) => {
    const username=await User.findOne({_id:user})
    io.to(chatroomId).emit("adminMessaage", {
            user,
            message:`${username.firstName} is typing message`
    })
  })
  socket.on("untyping", ({ chatroomId}) => {
    io.to(chatroomId).emit("adminMessaage", {
            user:null,
            message:''
    })
  })
  // untyping
  socket.on("chatroomMessage", async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });
      const newmessage = new Message({
        chatroomId,
        userId: socket.userId,
        message,
        date: new Date(),
      });
      io.to(chatroomId).emit("newMessage", {
        message,
        name: user.firstName,
        userId: socket.userId,
        date: new Date(),
      });
      await newmessage.save();
    }
  });
});

module.exports = {
  app,
  server,
};
