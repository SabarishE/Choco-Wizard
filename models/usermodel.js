const mongoose = require('mongoose');

const UserSchema= new mongoose.Schema({

    name:{type:String,required:true},
    email:{type:String,required:true},
    passwordHash:{type:String},
    admin:{type:Boolean,default:false}
    
})

const User = mongoose.model("user",UserSchema);

module.exports=User;
