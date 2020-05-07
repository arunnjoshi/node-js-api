const mongoose = require("mongoose"); 
const uuidv4 = require('uuid/v4');
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
    name :{
        type : String,  
        required : true,
        maxlength : 32,
        trim : true,
    },
    lastName : {
        type : String,
        required :true,
        trim : true,
    },

    email : {
        type : String ,
        trim : true, 
        unique  : true,
        required : true,
    },
    userInfo : {
        type : String,
        trim : true,
    },
    //TODO : comeback hera
    encry_password : {
        type : String,
        minlength : 8,
        required :true

    },

    salt : String,

    role : {
        type : Number,
        default : 0
    },

    purchases : {
        type : Array,
        default : []
    }

},{timestamps:true});

// vartiual fields
userSchema.virtual("password")
            .set(function(password){
                    this._password = password;
                    this.salt  = uuidv4();
                    this.encry_password = this.securedPassword(password)
            })
            .get(function(){
                return this._password;
            }); 

// method
userSchema.methods = {
    securedPassword : function(plainPassword){
        if(!plainPassword) return "";
        try
        {
            return crypto.createHmac('sha256', this.salt)
                    .update(plainPassword)
                    .digest('hex');
        }
        catch(err){
            return "";
        }
        
    },
    authincate : function (password) {
        return this.securedPassword(password) === this.encry_password;
      }
}
    
module.exports  = mongoose.model("User",userSchema);      