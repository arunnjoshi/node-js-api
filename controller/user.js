const User = require("../models/user");
const Order = require("../models/order")

exports.getUserById = (req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({error:"no user find in db"});    
        }
        req.profile = user;
        next();
    })
}   


exports.getUser = (req,res)=>{
    req.profile.salt=undefined;
    req.profile.encry_password=undefined;
    req.profile.createdAt=undefined;
    req.profile.updatedAt=undefined;
    return res.json(req.profile);
}



exports.updateUser = (req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err || !user){
                return res.status(400).json({"error":"update in db not sucessfull"});
            }
            user.encry_password=undefined;
            user.salt=undefined;
            return res.json(user);
        });
}


exports.userPurchaseList = (req,res)=>{
    Order.find({user:req.profile._id}).
    populate("user","_id name")
    .exec((err,orders)=>{
        if(err){    
            return res.status(400).json({error:"no order in this account"});
        }
        return res.json(orders);
    })
}

//middelware
exports.pushOrderInPurchaseList = (req,res,next)=>{
    let purchases=[];
    req.body.order.products.foreach(product=>{
        purchases.push({id:product._id,name:product.name,
            description:product.description,
            category:product.category,
            quntity:product.quntity,
            amount:req.body.order.amount,
            transactionId:req.body.order.transactionId
        });
    });
    
    //store in db
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new:true},
        (err,purchases)=>{
            if(err){
                return res.status(400).json({error:"unable to save purchase list"})
            }
        }
    );
    next();
}