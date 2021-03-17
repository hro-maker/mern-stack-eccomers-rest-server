const User = require("../models/user");
const jwt = require("jsonwebtoken");
const shortid= require('shortid')
const crypto = require('crypto')
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};
exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        message: "User already registered",
      });
    
    const { lastName, email, password } = req.body;
    const hash_password=await bcrypt.hash(password,10)
     
    const userobject={
      firstName:req.body.firstName,
      lastName,
      email,
      inside:false,
      hash_password,
      username: shortid.generate(),
    }
    if (req.file) {
      userobject.profilePicture =req.file.location;
    }
    console.log(userobject)
    const _user = new User(userobject);

    _user.save((error, data) => {
      if (error) {
        return res.status(400).json({
          message: error,
        });
      }

      if (data) {
        return res.status(201).json({
          message: "User created Successfully..!",
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  console.log(req.body)
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
  
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "user") {
        // const token = jwt.sign(
        //   { _id: user._id, role: user.role },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "1d" }
        // );
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName,profilePicture,inside } = user;
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email,inside, role, fullName ,profilePicture},
        });
      } else {
        return res.status(400).json({
          message: "Something went wronggggggggg",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};
exports.getalluser= async(req,res)=>{
  const allusers = await User.find({})
  res.status(200).json({
    allusers
  });
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'hrantmuradyan137@gmail.com', 
    pass: 'lyveokznvxckyhgc', 
  },
});
exports.forgot=(req,res)=>{
      crypto.randomBytes(32,async(err,buffer)=>{
           if(err){
             console.log(err)
           }
           const token=await bcrypt.hash(req.body.email,12)
           User.findOne({email:req.body.email}).then((user)=>{
              if(!user){
                return res.status(422).json({error:"user with that password dont found"})
              }
              user.ressetToken=token;
              user.save().then(result =>{
                try {
                  console.log("userrr",result)
                  transporter.sendMail({
                    to:user.email,
                    from:'shlyans-cart_admin@shlyans.com',
                    subject:'password reset',
                    html:`
                        <p> you requested for password reset</p>
                        <h1>click on this <a href="https://shlyanscart-app.herokuapp.com/resetPaassword/${token}">link</a>  for password reset</h1>
                    `
                  })
                  return res.status(200).json({message:"check your email"})
                } catch (error) {
                      res.status(200).json({message:error})
                }
                
              })
           })
      })
      
}
exports.newPassword=(req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.body.token
  console.log(sentToken)
  User.findOne({ressetToken:sentToken})
  .then(user=>{
      if(!user){
          return res.status(422).json({message:"Try again session expired"})
      }
      bcrypt.hash(newPassword,10).then(hashedpassword=>{
         user.hash_password = hashedpassword
         user.ressetToken = undefined
         user.save().then((saveduser)=>{
             res.json({message:"password updated success"})
         })
      })
  }).catch(err=>{
      console.log(err)
  })
}