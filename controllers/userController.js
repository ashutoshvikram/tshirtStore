const User = require("../models/user");
const bigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary").v2;
const emailHelper = require("../utils/emailHelper");
const crypto = require("crypto");
const { log } = require("console");

exports.signup = bigPromise(async (req, res, next) => {
  let result;
  if (req.files) {
    let file = req.files.photo;
    result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "pictures",
      width: "150",
    });
  }

  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    console.log("ashutosh");
    return next(new CustomError("Name Email Password required", 400));
  }

  const users = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(users, res);
});

//Login field

exports.login = bigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new CustomError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(
      new CustomError("Email and password does not match or exist", 400)
    );
  }

  const result = await user.validatePassword(password);

  if (!result) {
    return next(new CustomError("Email and password does not match"));
  }
  cookieToken(user, res);
});

exports.logout = bigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

exports.forgotpassword = bigPromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError("Email not registered", 400));
  }
  const token = user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });
  const myURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${token}`;

  const message = `Copy paste this link in your URL ${myURL}`;
  try {
    await emailHelper({
      to: email, // list of receivers
      subject: "Reset password", // Subject line
      text: message, // plain text body
      myURL,
    });
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new CustomError(err.message, 500));
  }
});
exports.passwordReset = bigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encryToken = crypto.createHash("sha-256").update(token).digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: encryToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });
  if (!user) {
    return next(new CustomError(encryToken, 400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError("Password and confirm password does not match", 400)
    );
  }
  user.password = req.body.password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();
  //Send the JSON response or token

  cookieToken(user, res);
});

exports.getLoggedInUserDetails = bigPromise(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePassword = bigPromise(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("+password");

  const isCorrectOldPassword = await user.validatePassword(
    req.body.oldPassword
  );

  if (!isCorrectOldPassword)
    return next(new CustomError("Password does not match", 400));

  user.password = req.body.password;

  await user.save();
  cookieToken(user, res);
});

exports.updateUserDetails = bigPromise(async (req, res, next) => {

const newData={
  name:req.body.name,
  email:req.body.email
}
if (req.files?.photo)
{
  const user=await User.findById(req.user.id)
  const imageID=user.photo.id
  const resp=await cloudinary.uploader.destroy(imageID)

  let file = req.files.photo;
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "pictures",
      width: "150",
    });

    newData.photo= {
      id: result.public_id,
      secure_url: result.secure_url,
    }
}
  const user=await User.findByIdAndUpdate(req.user.id,newData,{
  new:true,
  runValidators:true,
  useFindAndModify:false
})
res.status(200).json({
  success:true,
  message:"Details updated"
})
});

exports.adminAllUser = bigPromise(async (req, res, next) => {
const users=await User.find()
res.status(200).json({
  success:true,
  users})
})


exports.adminUpdateOneUserDetails = bigPromise(async (req, res, next) => {
  
const newData={
  name:req.body.name,
  email:req.body.email,
  role:req.body.role
}

  const user=await User.findByIdAndUpdate(req.params.id,newData,{
  new:true,
  runValidators:true,
  useFindAndModify:false
})
res.status(200).json({
  success:true,
  message:"Details updated"
})
})

exports.adminDeleteOneUserDetails = bigPromise(async (req, res, next) => {
  const user=await User.findById(req.params.id)
  if (!user)
  {
    return next(new CustomError("No user found",401))
  }
  const imageID=user.photo.id
  const resp=await cloudinary.uploader.destroy(imageID)
  
  const a=await user.deleteOne()
  console.log(a)
  res.status(200).json({
    success:true,
    message:"User deleted"
  })
  })