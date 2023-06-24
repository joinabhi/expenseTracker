const User=require('../model/user');

exports.addUser = async(req, res, next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password=req.body.password;
    const data = await User.create({
        name:name,
        email:email,
        password:password
});
    res.status(201).json({UserDetails:data})
}