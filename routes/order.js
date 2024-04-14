const express = require("express");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/user");
const { createOrder, getOneOrder, getLoggedInOrders, adminGetAllOrders, adminUpdateOrder } = require("../controllers/orderController");



router.route("/order/create").post(isLoggedIn,createOrder)
router.route("/order/:id").get(isLoggedIn,getOneOrder)
router.route("/myorders/").get(isLoggedIn,getLoggedInOrders)

//ADMIN ROUTES
router.route("/admin/orders/").get(isLoggedIn,customRole('admin'),adminGetAllOrders)
router.route("/admin/order/:id").put(isLoggedIn,customRole('admin'),adminUpdateOrder)

module.exports=router