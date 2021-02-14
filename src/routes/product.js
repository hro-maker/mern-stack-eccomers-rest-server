const express = require('express')
const { requireSignin, adminMiddleware ,uploadS3} = require('../../common-middleware')
const { createProduct, getProductsBySlug, geProductDetailsById, deleteProductById, getProducts, addcoment, addreting, getAllproducts } = require('../controller/product')

const router= express.Router()

router.post('/product/create',requireSignin,adminMiddleware,uploadS3.array('productPictures'), createProduct)

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