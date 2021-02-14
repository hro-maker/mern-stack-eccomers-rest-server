const User = require("../models/user");
const jwt = require("jsonwebtoken");
const shortid= require('shortid')
const bcrypt = require('bcrypt');
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
  // .exec();
  res.status(200).json({
    allusers
  });
}