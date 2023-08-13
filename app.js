const path=require('path')

const express=require('express');

const cors=require('cors');
// const helmet=require('helmet')
// const compression=require('compression')
// const morgan=require('morgan')
// const fs=require('fs')

const app=express();
const dotenv=require('dotenv');
dotenv.config();

const bodyParser=require('body-parser');
const userRoute=require('./route/user');
const expenceRoute=require('./route/expense');
const purchaseRoute=require('./route/purchase')
const premiumFeatureRoute=require('./route/premium')
const resetPasswordRoute=require('./route/resetpassword')
const userExpenseRoute=require('./route/expense')
const itemPagination=require('./route/expense')

const sequelize=require('./util/database');
const User = require('./model/user');
const Expense = require('./model/expense');
const Order=require('./model/orders');
const Forgotpassword=require('./model/forgotpassword')

// const accessLogStream=fs.createWriteStream(
//   path.join(__dirname, 'access.log'),
//   {flags:'a'}
// );
app.use(cors())
app.use(bodyParser.json());
// app.use(helmet());
// app.use(compression());
// app.use(morgan('combined',{stream:accessLogStream}))
app.use('/user', userRoute);
app.use('/expense', expenceRoute);
app.use('/purchase', purchaseRoute)
app.use('/premium',premiumFeatureRoute)
app.use('/password', resetPasswordRoute);
app.use('/userexpense', userExpenseRoute)
app.use('/expenses',itemPagination )


User.hasMany(Expense);
Expense.belongsTo(User)

User.hasMany(Order);
Order.belongsTo(User)

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User)


sequelize.sync().then(()=>{
  app.listen(9100,()=>{
    console.log(`your server is running on port 9100`)
  })
}).catch(error => console.log(error));