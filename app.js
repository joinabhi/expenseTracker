const express=require('express');
const app=express();
const cors=require('cors');


const bodyParser=require('body-parser');
const userRoute=require('./route/user');
const expenceRoute=require('./route/expense');
const purchaseRoute=require('./route/purchase')

const sequelize=require('./util/database');
const User = require('./model/user');
const Expense = require('./model/expense');
const Order=require('./model/orders');

app.use(cors())
app.use(bodyParser.json());
app.use('/user', userRoute);
app.use('/expense', expenceRoute);
app.use('/purchase', purchaseRoute )

User.hasMany(Expense);
Expense.belongsTo(User)

User.hasMany(Order);
Order.belongsTo(User)


sequelize.sync().then(()=>{
  app.listen(9100,()=>{
    console.log(`your server is running on port 9100`)
  })
}).catch(error => console.log(error));