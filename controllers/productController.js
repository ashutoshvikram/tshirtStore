const Product = require("../models/product");
const bigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const WhereClause = require("../utils/whereClause");
const product = require("../models/product");

const cloudinary = require("cloudinary").v2;

exports.addProduct = bigPromise(async (req, res, next) => {
  let imagesArray = [];
  if (!req.files) {
    return next(new CustomError("images are required", 404));
  }
  if (req.files) {
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );
      imagesArray.push({
        id: result.public_id,
        secure_URL: result.secure_url,
      });
    }
  }
  req.body.photos = imagesArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
});

exports.getAllProducts = bigPromise(async (req, res, next) => {
  const resultPerPage = 6;
  const totalCountProduct = await Product.countDocuments();

  const productObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();
  let products = await productObj.base;
  const filteredProductNumber = products.length;

  productObj.pager(resultPerPage);
  products = await productObj.base.clone();

  // console.log(products);
  return res.status(200).json({
    success: true,
    products,
    filteredProductNumber,
    totalCountProduct,
  });
});

exports.addReview = bigPromise(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user?._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const alreadyReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }
  //Adjust ratings
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });
  return res.status(200).json({
    success: true,
    product,
  });
});
exports.deleteReview = bigPromise(async (req, res, next) => {
    const {productId}=req.query
    
    const product = Product.findById(productId);
  const reviews = product.reviews.filter(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  const numberOfReviews=review.length


  //Adjust ratings
  const ratings =
    reviews.reduce((acc, item) => item.rating + acc, 0) /
    reviews.length;

  await Product.findByIdAndUpdate(productId,{
    reviews,
    numberOfReviews,
    ratings
  },{
    new:true,
    runValidators:true
  })
  return res.status(200).json({
    success: true,
    product,
  });
});

exports.getOneProduct = bigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new CustomError("No product found", 401));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//Admin routes
exports.adminGetAllProducts = bigPromise(async (req, res, next) => {
  const products = await Product.find({});

  res.status(200).json({
    success: true,
    products,
  });
});

exports.adminUpdateOneProduct = bigPromise(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  let imagesArray = [];
  if (!product) {
    return next(new CustomError("No product found", 401));
  }

  if (req.files) {
    //destroy the existing images
    for (let index = 0; index < product.photos.length; index++) {
      const res = await cloudinary.uploader.destroy(product.photos[index].id);
    }

    //upload and saved the images
    for (let index = 0; index < req.files.photos.length; index++) {
      let result = await cloudinary.uploader.upload(
        req.files.photos[index].tempFilePath,
        {
          folder: "products",
        }
      );
      imagesArray.push({
        id: result.public_id,
        secure_URL: result.secure_url,
      });
    }

    req.body.photos = imagesArray;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

exports.adminDeleteOneProduct = bigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new CustomError("No product found", 401));
  }
  //destroy the existing images
  for (let index = 0; index < product.photos.length; index++) {
    const res = await cloudinary.uploader.destroy(product.photos[index].id);
  }

  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product Deleted !!!",
  });
});
