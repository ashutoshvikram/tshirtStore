const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({
name:{
    type:String,
    required:[true,'Please provide product name'],
    trim:true,
    maxLength:[120,'Product name should not be more than 120 chars'],
},
price:{
    type:Number,
    required:[true,'please provide product price'],
    maxLength:[6,'Product price should not be  more than 6 digits']
},
description:{
    type:String,
    required:[true,'please provide product description'],
},
photos:[
    {
        id :{
            type:String,
            required:true
        },
        secure_URL:{
            type:String,
            required:true
        }
    }
],
category:{
    type:String,
    required:[true,'please select category from short sleeves,long sleeves,sweat shirts ,hoodie '],
    enum:{
        values:[
            'short-sleeves',
            'long-sleeves',
            'hoodies'
        ],
        message:'please select category from short sleeves,long sleeves,sweat shirts and hoodie'
    }
},
brand:{
    type:String,
    required:[true,'please provide brand'],
},
ratings: {
    type: Number,
    default: 0,
  },
  stock:{
    type:Number,
    required:[true,'Please add stock number']
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{ versionKey: false })

module.exports=mongoose.model("Product",productSchema)