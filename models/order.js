const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

//product cart scheme
const ProductCartSchema = new mongoose.Schema({
    product : {type:ObjectId,ref:"Product"},
    Name : String,
    count : Number,      
    price : Number,
});
const ProductCart = mongoose.model("ProductCart",ProductCartSchema);


//order scheme
const orderSchema =new mongoose.Schema({
    products : [ProductCartSchema],
    transactionId : {},
    amount : {type:Number},
    status:{
        type:String,
        default:"recieved",
        enum:["cancelled","delivered","shipped","processing","recieved"]
    },
    address: String,
    updated: Date,
    user : {
        type : ObjectId,
        ref  : "User"
    }
},{timestamps:true});
const Order = mongoose.model("Order",orderSchema);

//exports
module.exports = {Order,ProductCart};