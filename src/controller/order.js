const Order =require('../models/order')
const Cart =require('../models/cart')
const Address =require('../models/atress')
const nodemailer = require("nodemailer");
const user = require('../models/user');

exports.addOrder = (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'hrantmuradyan137@gmail.com', 
          pass: 'lyveokznvxckyhgc', 
        },
      });

    Cart.deleteOne({ user: req.user._id }).exec(async(error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        req.body.user = req.user._id;
        req.body.orderStatus = [
          {
            type: "ordered",
            date: new Date(),
            isCompleted: true,
          },
          {
            type: "packed",
            isCompleted: false,
          },
          {
            type: "shipped",
            isCompleted: false,
          },
          {
            type: "delivered",
            isCompleted: false,
          },
        ];
        const order = new Order(req.body);
        const em= await user.findOne({_id:req.user._id})

        transporter.sendMail({
          to:em.email,
          from:'shlyans-cart_admin@shlyans.com',
          subject:'order new product',
          html:`
              <p>  Shlyanscart  admin</p>
              <h1>thenk you for use oure shop</h1>
          `
        })
        order.save((error, order) => {
          if (error) return res.status(400).json({ error });
          if (order) {
            
            console.log(req.user.email)
            
           return res.status(201).json({ order });
          }
        });
      }
    });
  };
  
  exports.getOrders = (req, res) => {
    Order.find({ user: req.user._id })
      .select("_id paymentStatus paymentType orderStatus items")
      .populate("items.productId", "_id name productPictures")
      .exec((error, orders) => {
        if (error) return res.status(400).json({ error });
        if (orders) {
          res.status(200).json({ orders });
        }
      });
  };
  
  exports.getOrder = (req, res) => {
    Order.findOne({ _id: req.body.orderId })
      .populate("items.productId", "_id name productPictures")
      .lean()
      .exec((error, order) => {
        if (error) return res.status(400).json({ error });
        if (order) {
          Address.findOne({
            user: req.user._id,
          }).exec((error, address) => {
            if (error) return res.status(400).json({ error });
            order.address = address.address.find(
              (adr) => adr._id.toString() == order.addressId.toString()
            );
            res.status(200).json({
              order,
            });
          });
        }
      });
  };