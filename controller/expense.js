const { NUMBER } = require('sequelize');
const Expense=require('../model/expense');
const User=require('../model/user')

exports.addExpense = async(req, res, next)=>{
    try{ 
        const description = req.body.description;
        const category = req.body.category;
        const amount = req.body.amount;
        const data = await Expense.create({
            description:description,
            category:category,
            amount:amount,
            userId:req.user.id
        });
        totalExpense=Number(req.user.totalExpense)+Number(amount);
        console.log('171234567890098765432123456------------------------',totalExpense)
        User.update({totalExpense:totalExpense},{where:{userId:req.user.id}})
        res.status(201).json({expenseDetails:data})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"something went"})
    }
}
exports.getExpense = async(req, res, next)=>{
    try{
        console.log('21((((((((((((((((()))))))))))))', req.user.id )
        // console.log("2333333333333333333333333333333333333", user)
        const expenses=await Expense.findAll({where:{userId:req.user.id}});
        
    //    const expenses= req.user.allExpenses();
        console.log('22', expenses)
        res.status(200).json({allExpenses:expenses})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"something went wrong"})
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