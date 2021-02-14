const Product = require("../models/product");
const slugify = require("slugify");
const Category = require("../models/category");
function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    //you update code here

    Product.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
}
exports.addcoment = (req, res) => {
  // let promiseArray = [];
  const coment = req.body.coment;
  const { userPicture, userName } = req.body;
  condition = { _id: req.body._id };
  const comentt = {
    userId: req.user._id,
    coment,
    date: new Date(),
    userPicture,
    userName,
  };
  update = {
    $push: {
      coments: comentt,
    },
  };
  Product.findOneAndUpdate(condition, update, { new: true }).exec(
    (error, prod) => {
      if (error) return res.status(400).json({ error });
      if (prod) {
        return res.status(201).json({ prod });
      }
    }
  );
};
exports.addreting = async (req, res) => {
  const { retinc } = req.body;
 
  const comentt = {
    userId: req.user._id,
    review: retinc,
  };
  let update = {
    $push: {
      reviews: comentt
    },
  };
  let condition= { _id: req.body._id }; 
  const productes = await Product.findOne({ _id: req.body._id });
  productes.reviews.forEach((element) => {
    if (element.userId == req.user._id) {
      condition = { _id: req.body._id, "reviews.userId":req.user._id};
    update = {
        $set: {
          "reviews.$": comentt,
        },
      };
      
    }else{
      condition = { _id: req.body._id };
         update = {
             $push: {
               reviews: comentt
             },
           };
           
    } 
   
  }
    
  
  );
  Product.findOneAndUpdate(condition, update, { new: true }).exec(
    (error, prod) => {
      if (error) return res.status(400).json({ error });
      if (prod) {
      
        return res.status(201).json({ prod });
      }
    }
  );

 
  
};
// Product.findOneAndUpdate(condition, update)
//       .then((result) => res.status(201).json({result}))
//       .catch((err) => res.status(400).json({err}));
// promiseArray.push(runUpdate(condition, update));

// Promise.all(promiseArray)
//       .then((response) => res.status(201).json({ response }))
//       .catch((error) => res.status(400).json({ error }));
exports.createProduct = (req, res) => {
  // res.status(200).json({file:req.files,body:req.body})
  const { name, price, description, category, quantity, createdBy } = req.body;
  let productPictures = [];
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.location };
    });
  }

  const product = new Product({
    name,
    slug: slugify(name),
    price,
    description,
    productPictures,
    quantity,
    category,
    createdBy: req.user._id,
  });
  product.save((error, product) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (product) {
      res.status(201).json({ product,files:req.files });
    }
  });
};
exports.geProductDetailsById = (req, res) => {
  const { productId } = req.params;
 
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
    
      if (error) {
        return res.status(400).json({ error });
      }
      if (product) {
        return res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "params required" });
  }
};
exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id type")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }

          if (category.type) {
            if (products.length > 0) {
              res.status(200).json({
                products,
                priceRange: {
                  under500: 500,
                  under1k: 1000,
                  under2k: 1500,
                  under3k: 3000,
                },
                productsByPrice: {
                  under500: products.filter((product) => product.price <= 500),
                  under1k: products.filter(
                    (product) => product.price > 500 && product.price <= 1000
                  ),
                  under2k: products.filter(
                    (product) => product.price > 1000 && product.price <= 3000
                  ),
                  under3k: products.filter((product) => product.price > 3000),
                },
              });
            }
          } else {
            res.status(200).json({ products });
          }
        });
      }
    });
};
exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select("_id name price quantity reviews slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};
exports.getAllproducts =async (req,res)=>{
  
  const products=await Product.find({})
  if(products){
    return res.status(200).json({products})
  }else{
    return res.status(400).json({message:"someting went wrong"})
  }
}