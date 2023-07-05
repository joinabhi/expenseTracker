const Razorpay = require("razorpay");
const Order = require('../model/orders');
require('dotenv').config()


exports.purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        
        const amount = 2000;
        const order = await rzp.orders.create({ amount, currency: "INR" });
        console.log("14 in purchase.js controller", order)

        req.user.createOrder({ orderid: order.id, status: "PENDING" })
            .then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            })
            .catch(err => {
                throw new Error(err);
            });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "something went wrong", error: err });
    }
};


exports.updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });
        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' })
        const promise2 = req.user.update({ ispremiumuser: true })

        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({ success: true, message: "Transaction Successful" })
        }).catch(err => console.log(err))
    } catch (err) {
        console.log(err)
        res.status(403).json({ error: err, message: "something went wrong" })
    }
}
