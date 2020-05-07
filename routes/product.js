const express = require("express");
const router = express.Router();

// import from  controller
const {isSignedin,isAdmin,isAuthenticated} = require("../controller/auth");
const {getUserById} = require("../controller/user");
const {getProcuctbyId,createProduct,getProduct,photo,updateProduct,removeProduct,getAllProducts,getAllUniqueCategories} = require("../controller/product");

//parms 
router.param("userId",getUserById);
router.param("getProductById",getProcuctbyId)


//actual routes
// create routes
router.post("/product/create/:userId",[isSignedin,isAuthenticated,isAdmin],createProduct);

//get routes
router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);

//update routes
router.put("/product/:proudctId/:userId",[isSignedin,isAuthenticated,isAdmin],updateProduct )

//delete route
router.delete("/product/:proudctId/:userId",[isSignedin,isAuthenticated,isAdmin],removeProduct)

//listing route
router.get("/products",getAllProducts);
router.get("/products/categories",getAllUniqueCategories);

//export for use
module.exports = router;