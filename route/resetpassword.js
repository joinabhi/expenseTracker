const express=require('express');
const resetPasswordController=require('../controller/resetpassword')
const router=express.Router();

router.get('/updatepassword/:resetpasswordid', resetPasswordController.updatepassword)

router.get('/updatepassword/:id', resetPasswordController.resetpassword);

router.post('/forgotpassword', resetPasswordController.forgotpassword);

module.exports=router;
