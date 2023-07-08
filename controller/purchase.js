const Razorpay = require("razorpay");
const Order = require('../model/orders');

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
    await Order.create({ orderid: order.id, status: "PENDING", uId:req.user.id})
   return res.status(201).json({ order, key_id: rzp.key_id, payment_id: rzp});
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err.message });
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
