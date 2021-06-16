const express = require('express');
const { signup, signin, getalluser,forgot,newPassword } = require('../controller/auth');
const { requestvalidatorerror, validationRequest, validationsigninRequest } = require('../validator/auth');
const router = express.Router();
const upload=require('../../common-middleware/multer')

router.post('/signup',upload.single('profilePicture'), signup);
router.post('/signin',validationsigninRequest,requestvalidatorerror,  signin);
router.get('/getalluser', getalluser);
router.post('/forget',forgot)
router.post('/reset',newPassword)
module.exports = router;
