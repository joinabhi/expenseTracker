const Razorpay = require("razorpay");
const Order = require('../model/orders');
const jwt=require("jsonwebtoken");
const Expense=require('../model/expense');
const User=require('../model/user');
require('dotenv').config()

exports.purchasePremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: "rzp_test_sLb0DantiV2TJV",
      key_secret: "2yDu5uWLjckKdnyfwz3N4oaP"
    });

    const options = {
      amount: 50000, // amount in the smallest currency unit
      currency: "INR",
    };

    const order = await new Promise((resolve, reject) => {
      rzp.orders.create(options, (err, order) => {
        if (err) {
          reject(err);
        } else {
          resolve(order);
        }
      });
    });
    await Order.create({ orderid: order.id, status: "PENDING", id:req.user.userId})
   return res.status(201).json({ order, key_id: rzp.key_id, payment_id: rzp});
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err.message });
  }
};


exports.updateTransactionStatus = async (req, res) => {
  try {
    const {payment_id, order_id} = req.body;
   
    // console.log('41---------------------bhai', existingUser)
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
    const promise2 = req.user.update({ ispremiumuser: true });

    Promise.all([promise1, promise2]).then(() => {
    
      const token = jwt.sign(
        {userId:req.user.id, ispremiumuser:true },
        process.env.SECRET_KEY
      );
      console.log('New Token:', token);
      return res.status(202).json({ success: true, message: "Transaction Successful", token: token });
    }).catch(err => console.log(err));
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Something went wrong" });
  }
};

