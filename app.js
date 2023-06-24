const express=require('express');
const app=express();
const cors=require('cors');

const bodyParser=require('body-parser');
const userRoute=require('./route/user');
const sequelize=require('./util/database');

app.use(cors())
app.use(bodyParser.json());
app.use('/', userRoute);


sequelize.sync().then(()=>{
  app.listen(9100,()=>{
    console.log(`your server is running on port 9100`)
  })
}).catch(error => console.log(error));