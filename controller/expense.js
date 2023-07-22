const { NUMBER } = require('sequelize');
const Expense=require('../model/expense');
const User=require('../model/user')
const sequelize=require('../util/database')

const UserService=require('../service/userservice')
const S3Service=require('../service/s3service')

exports.addExpense = async (req, res, next) => {
    let transaction = null; // Define the transaction variable outside the try block
    try {
        transaction = await sequelize.transaction(); // Assign the transaction object to the variable
        const description = req.body.description;
        const category = req.body.category;
        const amount = req.body.amount;
        const data = await Expense.create({
            description: description,
            category: category,
            amount: amount,
            userId: req.user.id
        }, {
            transaction: transaction
        });
        console.log('169696969------------------', req, res)
        totalExpense = Number(req.user.totalExpense) + Number(amount);
        console.log('171234567890098765432123456------------------------', totalExpense)
        await User.update({ totalExpense: totalExpense }, { where: {id: req.user.id}, transaction: transaction })
        await transaction.commit();
        res.status(201).json({ expenseDetails: data })
    } catch (error) {
        if (transaction !== null) {
            await transaction.rollback(); // Perform rollback only if transaction is defined
        }
        console.log(error)
        res.status(500).json({ message: "something went wrong"})
    }
}

exports.getExpense = async(req, res, next)=>{
    try{
        console.log('21((((((((((((((((()))))))))))))', req.user.id )
       
        const expenses=await Expense.findAll({where:{userId:req.user.id}});
        res.status(200).json({allExpenses:expenses})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"something went wrong"})
}
}
    

exports.expensePagination=async(req, res, next)=>{
    try{
         const allExpenses= await Expense.findAll({where:{userId:req.user.id}})
         res.status(200).json({allExpenses:allExpenses})
        }catch(err){
        console.log(err)
    }
 }

exports.userExpenseDownload=async(req, res, next)=>{
    try{
        const expenses=await UserService.getExpenses(req);
        console.log(expenses);
        const stringifiedExpenses=JSON.stringify(expenses)
        const userId=req.user.id
        const filename=`Expense${userId}/${new Date()}.txt`;
        const fileUrl=await S3Service.uploadToS3(stringifiedExpenses, filename);
        res.status(200).json({fileUrl, success:true})
    }catch(err){
        console.log(err)
        res.status(500).json({fileUrl:'', success:false})
    }

}


exports.deleteExpense = async(req, res, next)=>{
    const expenseId=req.params.id;
    try{
        await Expense.destroy({where:{id:expenseId, userId:req.user.id}})
        res.status(200).json({message:'expense deleted successfully'})
    }
    catch(error){
        res.status(500).json({error:error})
    }
}