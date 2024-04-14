const express = require("express");
const {
  getAllProducts,
  addProduct,
  adminGetAllProducts,
  getOneProduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
  addReview,
  deleteReview,
} = require("../controllers/productController");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/user");

//User route
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getOneProduct);

router.route("/review").put(isLoggedIn,addReview).delete(isLoggedIn,deleteReview);

//Admin route
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);
router
  .route("/admin/products")
  .get(isLoggedIn, customRole("admin"), adminGetAllProducts);
router
  .route("/admin/update/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateOneProduct);
  router
  .route("/admin/update/:id")
  .delete(isLoggedIn, customRole("admin"), adminDeleteOneProduct);
module.exports = router;
