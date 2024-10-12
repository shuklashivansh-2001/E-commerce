const express = require('express');
const authenticateToken = require('../middleware/authentication');
const { User, Address } = require('../db');
const router = express.Router();


router.get("/",authenticateToken,async(req,res)=>{
    try{
        const userDetails = await User.findOne({
            email:req.user.username
        });
        return res.status(200).json({
            userDetails
        });
    }catch(e){
        console.error(e);
        return res.status(400).json({
            message:"Error while fetching the userdetails"
        });
    }
});

router.post('/',authenticateToken,async(req,res)=>{
    try{
        const userData = req.body;
        const updatedUser = await User.findOneAndUpdate(
            {email:req.user.username},
            {$set:userData},
            {new:true}
        );

        return res.status(200).json({
            updatedUser
        });
    }catch(e){
        console.error(e);
    }
});

router.post('/insertAddress',authenticateToken,async (req,res)=>{
    try{
        const { street,city,postalCode,state,country} = req.body;

        const newAddress = await Address.create({
            street,
            city,
            postalCode,
            state,
            country
        });

        const updatedUser = await User.findOneAndUpdate(
            {email:req.user.username},
            {$push:{address:newAddress._id}}
        );

        return res.status(200).json({
            message:'Address added successfully'
        });

    }catch(e){
        console.error(e);

        return res.status(400).json({
            message:'fail to insert Address'
        });
    }
})

const profileRouter = router;
module.exports = profileRouter;