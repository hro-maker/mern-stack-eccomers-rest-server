const express = require('express');
const { uploadS3 } = require('../../common-middleware');
const { signup, signin, getalluser,forgot,newPassword } = require('../controller/auth');
const { requestvalidatorerror, validationRequest, validationsigninRequest } = require('../validator/auth');
const router = express.Router();




router.post('/signup',uploadS3.single('profilePicture'), signup);
router.post('/signin',validationsigninRequest,requestvalidatorerror,  signin);
router.get('/getalluser', getalluser);
router.post('/forget',forgot)
router.post('/reset',newPassword)
module.exports = router;
