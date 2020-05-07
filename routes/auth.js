const express = require("express");
const router = express.Router();


const {check,validationResult} = require("express-validator");

const {signOut,signUp,signIn,isSignedin} = require("../controller/auth");

//routes  (url,validations,function)


router.post("/signup", [
    check("name","min length 4").isLength({
        min: 4
    }),
    check("email","email required").isEmail(),
    check("password").isLength({
        min: 8
    })
], signUp);

router.post("/signIn", [
    check("email", "this field is required").isEmail(),
    check("password","password field is required").isLength({min:8})
],signIn)


router.get("/signout", signOut);


router.get("/testRoute",isSignedin, (req,res)=>{
    res.send(`protected route ${req.auth._id}`)
});



module.exports = router;