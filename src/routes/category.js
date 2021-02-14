const express = require('express')
const { requireSignin, adminMiddleware,uploadS3 } = require('../../common-middleware')
const { addCategory, getCategories, updateCategories, deleteCategories } = require('../controller/category')
const router= express.Router()


router.post('/category/create',requireSignin,adminMiddleware,uploadS3.single('categoryImage'),addCategory)
router.get('/category/getcategory',getCategories)
router.post('/category/update',uploadS3.array('categoryImage'),updateCategories)
router.post('/category/delete',deleteCategories)
module.exports= router