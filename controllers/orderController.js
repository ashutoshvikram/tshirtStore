const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const bigPromise = require("../middlewares/bigPromise");

exports.createOrder = bigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    tax,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    tax,
    taxAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id,
  });
  res.status(200).json({
    success: true,
    order,
  });
});

exports.getOneOrder = bigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new Error("no order id"));
  }

  res.status(200).json({
    success: true,
    order,
  });
});
exports.getLoggedInOrders = bigPromise(async (req, res, next) => {
  const order = await Order.find({ user: req.user._id });
  if (!order) {
    return next(new Error("no orders"));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.adminGetAllOrders = bigPromise(async (req, res, next) => {
  const orders = await Order.find({});

  return res.status(200).json({
    success: true,
    orders,
  });
});

exports.adminUpdateOrder = bigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order.status == "delivered") {
    return next(new Error("Order delivered!!"));
  }
  order.orderStatus = req.body.orderStatus;
  order.orderItems.forEach(async(prd)=>{
   await updateStock(prd.product,prd.quantity)
  })
  await order.save();
  return res.status(200).json({
    success: true,
    order,
  });
});

async function updateStock(prd, quantity) {
   
  const product =await Product.findById(prd._id);
  
  product.stock>0?product.stock=product.stock-quantity:Error('stock out')
  

  await product.save({validateBeforeSave:false})


}
