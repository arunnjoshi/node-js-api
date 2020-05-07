const express = require("express");
const router = express.Router();

//import from other controller
const {isSignedin,isAuthenticated,isAdmin} = require("../controller/auth");
const {getUserById} = require("../controller/user");
const {getUserById,pushOrderInPurchaseList} = require("../controller/user");
const {updateStokc} = require("../controller/product");
// from order controller
const {createOrder,getOrderStatus,updateStatus} =require("../controller/order");

//parms
router.param("userId",getUserById); 
router.param("orderId",getOrderById);

//actual routes
//create order
router.post("/order/create/:orderId",[isSignedin,isAuthenticated,pushOrderInPurchaseList,updateStokc],createOrder);
//get all orders
router.post("/order/all",[isSignedin,isAuthenticated,isAdmin],getAllOrders);
//get and update status
router.get("/order/status/:userId",[isSignedin,isAuthenticated,isAdmin],getOrderStatus);
router.put("/order/:orderId/:userID",[isSignedin,isAuthenticated,isAdmin],updateStatus);
//exports
module.exports = router;

