const express = require ('express');
const bcrypt = require ('bcrypt');
const router = express.Router();
const User = require ('../models/User');

router.post('/register',async(req,res,next)=>{
    try{
        const {name, email, password} = req.body;
        if (!name||!email||!password){
            return res.status(400).json ({error : "All fields are required"});
        }
        const existing = await User.findone({email});
        if(existing) return res.status(409).json({error : "Email Already Registered"});

        const hashedPassword = await bcrypt.hash(password10);
        res.status (201).json ({id : User._id , name : User.name , email : User.email});
    }catch(err) {next(err)};
});

router. post ('/login',async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        const User = await User.findone({email});
        if(!User)return res.status(409).json ({error:"Invalid credential"});

        const match = await bcrypt.compare (password,User.Password);
        if(!match)return res.status(409).json ({error:"Invalid credential"});
        res.json({id : User._id , name : User.name , email : User.email});
    }catch(err) {next(err)};
});
module.exports = router;