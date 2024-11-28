const express = require('express');
const {User} = require('../db/index.js');
const router = express.Router();
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authentication.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signUp",async (req,res)=>{
    const {username,password,firstName,lastName,DOB} = req.body;
    
    if(!username || !password || !firstName || !lastName ||!DOB)
        return res.status(400).send(`Please fill required fields`);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    try{
        User.create({
            email: username,
            password:hashedPassword,
            firstName,
            lastName,
            DOB:DOB
        });

        return res.status(200).json({
            message:'user created succesfully'
        });
    }catch(e){
        console.error(e);
        return res.status(400).json({
            message:'Fail to create user'
        });
    }
});

router.post("/signIn",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password)
        return res.status(400).send(`Please fill required fields`);
    
    const user = await User.findOne({
        email:username,
    });

    if(!user || !(await bcrypt.compare(password, user.password))){
        return res.status(400).send('Invalid credentials');
    }

    const accessToken = 'Bearer '+ jwt.sign({ username: user.email}, JWT_SECRET);
    res.json({ accessToken });
});

router.get("/",authenticateToken,async(req,res)=>{
    try{
        const userDetails = await User.findOne({
            email:req.user.username
        });
        return userDetails;
    }catch(e){
        return res.status(400).json({
            message:"Error while fetching the userdetails"
        });
    }
});

const userRouter = router;
module.exports = userRouter;