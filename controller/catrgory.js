const Category =require("../models/category");


//middelware
exports.getCategoryById = (req,res,next,id)=>{

    Category.findById(id).exec((err,cate)=>{
        if(err){
            return res.status(400).json({"error":"category not found in db"});
        }
        req.category = cate;
        next();
    });
}


//create category
exports.createCatrgory = (req,res)=>{
    const category = new Category(req.body);
    
    category.save((err,cate)=>{
        console.log(err);
        if(err){
            return res.status(400).json({error:"not able to save category"}); 
        }
        return res.json(cate);
    });
}

//get one category
exports.getCategory =(req,res)=>{
    return res.json(req.category);
}
//get all category
exports.getAllCategories =(req,res)=>{
    Category.find().exec((err,cate)=>{
        if(err){
            return res.status(400).json({error:"somthing went wrong"});
        }
        return res.status(200).json(cate)
    });
}

//update category
exports.updateCategory = (req,res)=>{
    const category = req.category;
    category.name = req.body.name;
    category.save((err,updatedCate)=>{
        if(err){
            return res.status(400).json({error:"fail to update category"});
        }
        return res.status(200).json(updatedCate);
    });
}

//delete category
exports.removeCategory = (req,res)=>{
    const category = req.category;
    Category.remove((err,deletedCategory)=>{
        if(err){
            return res.status(400).json({error:""});
        }
        return res.status(200).json({message:`sucessfully deleted`});
    });
}
