const express = require("express");
const router = express.Router();

//imports from files
const {getCategoryById,createCatrgory,getCategory,getAllCategories,updateCategory,removeCategory} = require("../controller/catrgory");
const {isAdmin,isAuthenticated,isSignedin} = require("../controller/auth");
const {getUserById} = require("../controller/user");


//parm
router.param("userId",getUserById);
router.param("categoryId",getCategoryById);


//create route
router.post("/category/create/:userId",[isSignedin,isAuthenticated,isAdmin],createCatrgory);
//read routes
router.get("/category/:categoryId",getCategory);
router.get("/categories",getAllCategories);
//update route
router.put("/category/:categoryId/:userId",[isSignedin,isAuthenticated,isAdmin],updateCategory);
//delete route
router.delete("/category/:categoryId/:userId",[isSignedin,isAuthenticated,isAdmin],removeCategory);



//exports for app.js
module.exports = router;
