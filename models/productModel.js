const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
  name:{
    type: String,
    required:true,

  },
  description:{
    type:String,
    required:true
  },
  richdescription:{
    type:String,
    default:''
  },
  image:{
    data:Buffer,
    contentType:String
  },
  imagePath: { type: String }, // Add imagePath field
  images:[{
    type:String
  }],
  price:{
    type:Number,
    default:0
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:true
  },
  countInStock:{
    type:Number,
    required:true,
    min:0,
    max:255
  },
  rating:{
    type:Number,
    default:0
  },
  numReviews:{
    type:Number,
    default:0,
  },
  isFeatured:{
    type:Boolean,
    default:false,
  },
  dateCreated:{
    type:Date,
    default:Date.now
  },


})

const Product=mongoose.model('Product',productSchema)
module.exports={Product};