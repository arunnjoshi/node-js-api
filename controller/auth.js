const User = require("../models/user")
const {check,validationResult} = require("express-validator")
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");


//signup
exports.signUp = (req, res) => {
    // console.log("REQ BODY", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            err: errors.array()[0]
        });
    }


    const user = new User(req.body);
    user.save((err, user) => {
        // console.log(`console log ${err}  ${user}`);
        if (err) {
            return res.status(400).json({
                err: "not able to save user in db"
            });
        }
        return res.json({
            id: user._id,
            name: user.name,
            email: user.email,
        });
    });
}

//signIn
exports.signIn = (req, res) => {
    console.log(req.body);
    
    const {email,password} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            err: errors.array()[0]
        });
    }

    User.findOne({email}, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: "error occoured"
            })
        }
        if(!user)
        {   
            return res.status(400).json({error: "User does not exist"});
        }
        if (!user.authincate(password)) {
            return res.status(401).json({error: "email and password does not match"});
        }
        //create token
        const token = jwt.sign({
            _id: user._id
        }, process.env.SECRET);
        //put token in cookie
        res.cookie("token", token,{expire:new Date+10});
        //send res to frontend
        const {_id,name,role,email} = user;
        return res.json({token,user: {_id,name,email,role}});
    });


};

//sign out
exports.signOut = (req, res) => {
    res.ckearCookie("token");
    res.json({
        "message": "User Sign out sucessfully"
    });
}


//protected routes or middalware 

exports.isSignedin = expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth"
});


//custom middelware
exports.isAuthenticated = (req,res,next)=>{
    let check = req.profile && req.auth && req.auth._id == req.profile._id;
    if(!check)
    {
     return res.status(403).json({err:"access Denied"});
    }
    next();

}


exports.isAdmin = (req,res,next)=>{
    if(req.profile.role === 0)
    {
        return res.status(403).json({err:"access Denied"});
    }
    next();
}