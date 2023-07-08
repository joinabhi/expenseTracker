const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Expense=sequelize.define('e',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
},
  description:{
    type:Sequelize.STRING,
    allowNull:false
  },
  category:{
    type:Sequelize.STRING,
    allowNull:false
  },
  amount:{
    type:Sequelize.DOUBLE,
    allowNull:false
  }
 
});

module.exports=Expense;