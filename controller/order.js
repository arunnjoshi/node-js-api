

const {Order,ProductCart} = require("../models/order");

//parms
exports.getOrderById = (req,res,next,id)=>{
    Order.findById(id)
    .populate("products.product","name price")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({error:"no order found"});
        }
        req.order = order;
        next();
    });
}


//create
exports.createOrder = (req,res)=>{
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err,order)=>{
        if(err){
            return res.status(400).json({error:"failed to save order in db"});
        }
        return res.status(200).json(order);
    })
}


//read
//get all orders
exports.getAllOrders = (req,res)=>{
    
    Order.
    find()
    .populate("user","name _id").
    exec((err,orders)=>{
        if(err){
            return res.status(400).json({error:"error while processing request"});
        }
        return res.status(200).json(orders);
    });
} 

exports.getOrderStatus = (req,res)=>{
    return res.json(Order.schema.path("status").enumValues);
}

//update
exports.updateStatus = (req,res)=>{
    Order.update(
        {_id:req.body.orderId},
        {$set:{status:req.body.status}},
        (err,order)=>{
            if(err){
                return res.status(400).json({error:"canot update order status"});
            }
            return res.status(200).json(order);
        }
        );
}
