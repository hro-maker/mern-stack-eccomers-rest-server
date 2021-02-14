const express = require('express');
const { requireSignin } = require('../../../common-middleware');
const { signup, signin, signout } = require('../../controller/admin/auth');
const { requestvalidatorerror, validationRequest, validationsigninRequest } = require('../../validator/auth');
const router = express.Router();
router.post('/admin/signup',validationRequest,requestvalidatorerror, signup);
router.post('/admin/signin',validationsigninRequest,requestvalidatorerror, signin);
router.post('/admin/signout',signout);


module.exports = router;
