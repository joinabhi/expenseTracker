const express=require('express');
const userController=require('../controller/user');
const router=express.Router()

router.post('/user/add-signUp', userController.signUp);

router.post('/user/add-signIn', userController.signIn);

module.exports=router;