const express = require('express')
const { requireSignin, adminMiddleware ,uploadS3} = require('../../common-middleware')
const { createProduct, getProductsBySlug, geProductDetailsById, deleteProductById, getProducts, addcoment, addreting, getAllproducts,removecoment,likecoment } = require('../controller/product')
const upload=require('../../common-middleware/multer')
const router= express.Router()
// ,uploadS3.array('productPictures')
router.post('/product/create',requireSignin,adminMiddleware,upload.array('productPictures'),createProduct)

router.delete(
  "/product/deleteProductById",
  requireSignin,
  adminMiddleware,
  deleteProductById
);
router.post(
  "/product/getProducts",
  requireSignin,
  adminMiddleware,
  getProducts
);
router.post(
  "/product/addcoment",
  requireSignin,
  addcoment
);
router.post(
  "/product/likecoment",
  requireSignin,
  likecoment
);
router.post(
  "/product/removecoment",
  requireSignin,
  removecoment
);
router.post(
  "/product/addretinc",
  requireSignin,
  addreting
);
router.get(
  "/product/getall",
  getAllproducts
);
router.get('/product/:productId',geProductDetailsById)
router.get('/products/:slug',getProductsBySlug)

// router.get('/category/getcategory',getCategories)
module.exports= router