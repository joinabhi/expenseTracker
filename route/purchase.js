const express=require('express');
const purchaseController=require('../controller/purchase');
const userController=require('../controller/user');
const userAuthentication=require('../middleware/auth');
const expenseController=require('../controller/expense')

const router=express.Router();

router.get('/premiummembership', userAuthentication.authenticate, purchaseController.purchasePremium);

router.post('/updatetransactionstatus',userAuthentication.authenticate, purchaseController.updateTransactionStatus);

// router.post('/userDetails',userController.userDetails)



module.exports=router;