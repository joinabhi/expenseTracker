const express=require('express');
const premiumController=require('../controller/premium');
const userAuthentication=require('../middleware/auth')
const router=express.Router();

router.get('/showleaderboard', userAuthentication.authenticate, premiumController.getUserLeaderBoard);

module.exports=router;