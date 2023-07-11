const Expense=require('../model/expense');
const User=require('../model/user')
const sequelize=require('../util/database')


exports.getUserLeaderBoard=async(req,res)=>{
    try{
        const users=await User.findAll();
        const expenses=await Expense.findAll();
        const userAggregateExpenses={}
        expenses.forEach((expense)=>{
           
            if(userAggregateExpenses[expense.uId]){
               
                userAggregateExpenses[expense.uId]+=expense.amount
            }else{
                userAggregateExpenses[expense.uId]=expense.amount
            }
        })
         console.log('17777777777777777777777', userAggregateExpenses)
        var userLeaderBoardDetails=[]
        users.forEach((user)=>{
            console.log('20-----------------------',userAggregateExpenses[user.id])
            userLeaderBoardDetails.push({
                name:user.name, totalCost:userAggregateExpenses[user.id] || 0
            
            })
        })
        console.log('23', userLeaderBoardDetails)
       
       const inSortedForm= userLeaderBoardDetails.sort((a,b)=>
        b.totalCost-a.totalCost 
       )
       console.log('31------------------------', inSortedForm)
        res.status(200).json(inSortedForm)

    }catch(err){
       console.log(err)
       res.status(500).json(err)
    }
}
