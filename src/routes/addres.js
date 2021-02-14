const express = require('express');
const { requireSignin, userMiddleware, adminMiddleware } = require('../../common-middleware');
const { addAddress, getAddress} = require('../controller/addres');
const router = express.Router();


router.post('/user/address/create', requireSignin, userMiddleware, addAddress);
router.post('/user/getaddress', requireSignin, userMiddleware, getAddress);


module.exports = router;