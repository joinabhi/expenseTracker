const express=require('express');
const expenseController=require('../controller/expense');
const userAuthentication=require('../middleware/auth')
const router=express.Router();

router.post('/add-expense',userAuthentication.authenticate, expenseController.addExpense);

router.get('/get-expense', userAuthentication.authenticate, expenseController.getExpense);

router.delete('/delete-expense/:id',userAuthentication.authenticate, expenseController.deleteExpense);

module.exports=router;