const jwt=require('jsonwebtoken');
const User=require('../model/user');
require('dotenv').config()
exports.authenticate=(req, res, next)=>{
    try{
    const token=req.header('Authorization');
    console.log('7----------------0000000',token)
    const user=jwt.verify(token, process.env.SECRET_KEY);
    console.log('userId>>>>>>>>>>>>>', user.id)
    User.findByPk(user.id).then(user=>{
        req.user=user;
        // console.log('12 ka haal ba ho bhai gupta',req.user.id)
        next();
    })
    }
    catch(error){
        console.log(error)
        return res.status(401).json({success:false})
    }
}


