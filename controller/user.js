const User=require('../model/user');

exports.addUser = async(req, res, next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password=req.body.password;

    const users=[]

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const data = await User.create({
        name:name,
        email:email,
        password:password
});
    users.push(data)
    res.status(201).json({UserDetails:data})
}