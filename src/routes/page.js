const express = require('express');
const { requireSignin, adminMiddleware ,uploadS3} = require('../../common-middleware');
const { createPage, getPage } = require('../controller/admin/page');
const upload=require('../../common-middleware/multer')

const router = express.Router();
router.post('/page/create',requireSignin,adminMiddleware, upload.fields([
    {name: 'banners'},
    {name: 'products'}
]) ,createPage);
router.get('/page/:category/:type',getPage)


module.exports = router;