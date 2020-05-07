const express = require("express");
const router = express.Router();


//models
const {getUserById,getUser,updateUser,userPurchaseList} = require("../controller/user");
const {isSignedin,isAuthenticated} = require("../controller/auth");
//get user by id in url
router.param("userId",getUserById)
//get user
router.get("/user/:userId",[isSignedin,isAuthenticated],getUser);
//update user
router.put("/user/:userId",[isSignedin,isAuthenticated],updateUser);
//order populate
router.put("/orders/user/:userId",[isSignedin,isAuthenticated],userPurchaseList);

module.exports = router;