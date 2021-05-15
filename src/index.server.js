const express = require("express");
const env = require("dotenv");
const path = require('path')
const cors= require('cors')
const mongoose = require("mongoose");
const {app, server} =require('./app')
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))

//routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes= require('./routes/category')
const productRoutes=require('./routes/product')
const cartRoutes=require('./routes/cart')
const initialData=require('./routes/admin/initialData')
const pageRoutes =require('./routes/page')
const adressRoutes =require('./routes/addres')
const orderRoutes =require('./routes/order')
const adminorderRoutes =require('./routes/admin/order')
const chatroomsrouts =require('./routes/chatroom')
const messagerouts =require('./routes/message')
env.config();
//database
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.4dhzu.mongodb.net/${process.env.MONGO_DB_DTBASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(() => {
    console.log("Database connected");
  });
  let ALLOWED_ORIGINS = ["https://shlyanscart-app.herokuapp.com","https://shlyanscart-admin-app.herokuapp.com" ];
  console.log("hello")
app.use((req, res, next) => {
    let origin = req.headers.origin;
    if(!ALLOWED_ORIGINS.includes(origin)){
      return res.status(404).json({message:"origin dont allow"})
    }
    next();
})
app.use(cors())
app.use(express.json({ extented: true }));
app.use('/public',express.static(path.join(__dirname,'uploads')))
//routes
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialData);
app.use("/api", pageRoutes);
app.use("/api", adressRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminorderRoutes);
app.use("/api", chatroomsrouts);
app.use("/api", messagerouts);
app.use(express.json({extended: true}));
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
