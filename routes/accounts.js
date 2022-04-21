const express =require("express");
const bcrypt =require("bcryptjs");
const jwt = require('jsonwebtoken');

const User =require("../models/usermodel.js");

const userRouter=express.Router();

// -------signup of a new user------- 

userRouter.post("/signup",async(req,res)=>{

    try{
    const adduser=req.body ;
   console.log("signup alert!!!",adduser);

   let emailcheck =await User.findOne({email:adduser.email});
   if(emailcheck) {
       return res.status(400).send({msg:"email already exists"})
   }
    const salt=await bcrypt.genSalt(10);
    const passwordHash =await bcrypt.hash(adduser.password,salt);
  
    console.log(`password hash for the password'${adduser.password}'is >>> ${passwordHash}`)
   

        const newuser = new User({

            name:adduser.name,
            email:adduser.email,
            passwordHash,
        });
        
            await newuser.save();
            res.status(200).send({msg:"signup success",flag:true});
    
}
catch(err){
    res.send(err);
    console.log("error in signup!!!",err)
}
})


// -------- login of existing user ---------

userRouter.post("/login",async(req,res)=>{

    try{
        console.log("login alert !!!")
        const userLoggingIn= await User.findOne({email:req.body.email});
     
        if(!userLoggingIn){
            return res.status(400).send({msg:"invalid credentials"});
        }
    
        const isMatch=await bcrypt.compare(req.body.password,userLoggingIn.passwordHash);

       
        if(!isMatch)
        {
            res.send({msg:"invalid credentials"});
            console.log("---- invalid credentials----");
           res.status(500);
           return res.send({msg:"invalid credentials",flag:false})
          
        }
        const token=jwt.sign({id:userLoggingIn._id},"mysecretkey");
  
        res.send({name:userLoggingIn.name,email:userLoggingIn.email,token,admin:userLoggingIn.admin,message:"login success",flag:true});
        console.log("---- successful login----");
    }
      
      catch(err)
      {
        res.status(500);
        res.send({err:err.message,flag:false});
        console.log("Error in finding the user!!!",err);
      }

})


module.exports=userRouter;