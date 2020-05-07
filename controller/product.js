const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
//models
const Product = require("../models/product")

exports.getProcuctbyId = (req,res,next,id)=>{
    Product
    .populate("category")
    .findById(id).exec((err,product)=>{
        if(err){
            return res.status(400).json({error:"not find product in db"});
        }
        res.product = product;
        next();
    })
}

//craete product
exports.createProduct = (req,res)=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({error:"not able to save image"});
        }
        // destructure the field
        const {name,description,price,category,stock} = fields;
        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock 
        )
        {
            return res.status(400).json({error :"all field are required"});
        }
        
        let product  = new Product(fields);
        
        //handel file here
        if(file.photo){
            if(file.photo.size > 3000000)
            {
                return res.status(400).json({error:"file size is to big"});
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to db
        // console.log(product);
        
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({err:"failed to save"});
            }
            return res.status(200).json(product);
        });
    });

}

//get product
exports.getProduct = (req,res)=>{
    req.product.photo = undefined;
    return res.status.json(req.product);    
}


exports.getAllProducts = (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit):8;
    let sortBy = req.query.sortBy ? req.query.sortBy:"_id";
    product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({error:"products not found"});
        }
        return res.status(200).json(products)
    })
}

exports.getAllUniqueCategories = (req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({error:"not category found"})
        }
        req.json(category);
    })
}
//update product
exports.updateProduct = ()=>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({error:"not able to save image"});
        }
        // destructure the field
        const {name,description,price,category,stock} = fields;
        //updation code 
        let product  = req.product;
        product = _.extend(product, fields);    
        //handel file here
        if(file.photo){
            if(file.photo.size > 3000000)
            {
                return res.status(400).json({error:"file size is to big"});
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to db
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({err:"failed to update"});
            }
            return res.status(200).json(product);
        });
    });

}


//delete  route
exports.removeProduct = (req,res)=>{
    let product = req.product;
    Product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({error:"failed to delete product"});
        }
        res.json({message:"deletion sucessfull",deletedProduct})
    });
}


//middalware
exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}


//update stock
exports.updateStokc = (req,res,next)=>{
    let myOperation = req.body.order.pros.map(prod =>{
        return {
            updateOne:{
                filter:{_id:pro._id},
                update:{$inc:{stock:-prod.count,sold:+prod.count}}
            }
        }
    });
    Product.bulkWrite(myOperation,{},(err,result)=>{
        if(err){
            return res.status(400).json({error:"bulk operation failed"});
        }
        next();
    });
    next();
}
