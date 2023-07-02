const User=require('../model/user');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require('dotenv').config()

const signUp=async(req, res)=>{
  //Existing user check
  const {name, email, password}=req.body;
  try{
    const existingUser=await User.findOne({where:{email}});
    if(existingUser){
      return res.status(400).json({message:"user already exists"});
    }
    //hashedPassword
    const hashedPassword=await bcrypt.hash(password, 10)
    //user Creation
    const result=await User.create({
          name:name,
          email:email,
          password:hashedPassword
    })
    //generate token
    const token=jwt.sign({email:email, id:result.id}, process.env.SECRET_KEY)
    return res.status(201).json({user:result, message:"Registration Successful", token:token})
   
  }catch(error){
    console.log(error);
    res.status(500).json({message:"something went wrong"})
  }
}


const signIn=async(req, res)=>{
  const {email, password}=req.body;
  try{
  const existingUser=await User.findOne({where:{email}});
  if(!existingUser){
    return res.status(404).json({message:"user not found"})
  }
  const matchPassword=await bcrypt.compare(password, existingUser.password)
  if(!matchPassword){
    return res.status(400).json({message:"Invalid Credential"})
  }
  const token=jwt.sign({email:existingUser.email, id:existingUser.id}, process.env.SECRET_KEY);
  console.log("45================+++", token )
  res.status(201).json({user:existingUser, message:"user logged in successfully", token:token});
  }catch(error){
    console.log(error);
    res.status(500).json({message:"something went wrong"})
  }
}

module.exports={signUp, signIn}

