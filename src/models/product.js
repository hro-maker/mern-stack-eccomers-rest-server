const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    offer: { type: Number },
    productPictures: [{ img: { type: String } }],
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        review:Number
      },
    ],
    coments: [
      { 
        userPicture:{
        type:String
          },
          userName:{
            type:String
          },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        likes:[
            {
                userId:{
                  type:mongoose.Schema.Types.ObjectId,
                  ref:"User"
                }
            }
        ],
        coment: String,
        date: {
          type: Date,
        }
      },
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category",required:true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User",required:true },
    updatedAt: Date,
  },{ timestamps: true });

module.exports = mongoose.model("products", productSchema);
