const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const User=sequelize.define('gauri',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        allowNull:false
       },
   password:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=User;