const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const User=sequelize.define('user',{
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
    },
    totalExpense:{
      type:Sequelize.INTEGER,
      defaultValue:0
    },
    ispremiumuser: {
        type: Sequelize.STRING, // Use STRING type instead of BOOLEAN
        defaultValue: 'false', // Set default value as a string
        get() {
          const rawValue = this.getDataValue('ispremiumuser');
          return rawValue === 'true'; // Convert string to boolean
        },
        set(value) {
          const convertedValue = value ? 'true' : 'false'; // Convert boolean to string
          this.setDataValue('ispremiumuser', convertedValue);
        }
      }
    
});

module.exports=User;