const Sequelize=require('sequelize');
const sequelize=new Sequelize('first_table', 'root', 'Abhishek@#123',{
    dialect:'mysql',
    host:'localhost'
});
module.exports=sequelize;