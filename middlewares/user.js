const User=require("../models/user")
const bigPromise=require("../middlewares/bigPromise")
const CustomError=require("../utils/customError")
const jwt=require("jsonwebtoken")

exports.isLoggedIn=bigPromise(async (req,res,next)=>{
const token=req.cookies.token || req.header("Authorization").replace("Bearer ","")

if (!token)
{
    return next (new CustomError("Login first to access this page",401))
}

const decoded=jwt.verify(token,process.env.JWT_SECRET)

req.user=await User.findById(decoded.id)
next()
});

exports.customRole=(...roles)=>{
//TODO:learn this concept of include and next callback
    return (req,res,next)=>{
    if (!roles.includes(req.user.role))
    {
        return next(new CustomError("You are not authorised",402))
    }
    next()
}
}