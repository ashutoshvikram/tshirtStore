const bigPromise = require("../middlewares/bigPromise");
const Razorpay = require("razorpay");
exports.sendRazorpayKey = bigPromise((req, res, next) => {
  res.status(200).json({
    razorpay_key: process.env.RAZORPAY_KEY,
  });
});

exports.captureRazorpayPayment = bigPromise(async (req, res, next) => {
  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  var options = {
    amount: req.body.amount, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };
   instance.orders.create(options, function (err, order) {
    console.log(order);
    return res.status(200).json({
        success: true,
        order
      });
  });

  
});
