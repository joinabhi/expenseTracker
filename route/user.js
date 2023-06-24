const express=require('express');
const userController=require('../controller/user');
const router=express.Router()

router.post('/user/add-signUp', userController.addUser);

module.exports=router;