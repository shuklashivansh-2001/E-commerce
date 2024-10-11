const express = require('express');
const { Product } = require('../db');
const authenticateToken = require('../middleware/authentication');
const route = express.Router();

route.get('/', async(req,res)=>{
    try{
        const skipValue  = req.body.skipValue || 10;
        const productList = await Product.find().skip(skipValue).limit(20);

        return res.status(200).json({
            productList
        });
    }catch(e){
        return res.status(400).json({
            message:'Error retriving the product list'
        });
    }
});

route.get('/:productId', async(req,res)=>{
    try{
        const productId = req.param.productId;
        const productDetails =  await Product.findById(productId);

        return res.status(200).json({
            productDetails
        });

    }catch(e){
        console.error(e);
        return res.status(400).json({
            message:'Error fetching product details'
        });
    }
});


route.post('/create', authenticateToken, async(req,res)=>{
    try{
        const {productName,description,price,stock,returnTime,warranty,guarantee} = req.body;
        
        if(!productName || !description || !price || !stock || !returnTime || !warranty || !guarantee){
            return res.status(400).json({
                message:"please fill all the necesaary details"
            });
        }
        const newProduct = await Product.create({
            productName,
            description,
            price,
            stock,
            returnTime,
            warranty,
            guarantee
        });

    }catch(e){
        console.error(e);
        return res.status(400).json({
            message:'Error while creating the product'
        });    
    }
});

route.post('/update/:productId',authenticateToken, async(req,res)=>{
    try{
        const productDetails = req.body;
        
        const updatedProduct = Product.findOneAndUpdate(
            {_id:productId},
            {$set:productDetails},
            {new:true}
        );

        return res.status(200).json({
            updatedProduct,
            message:"successfully updated product details"
        });

    }catch(e){
        console.error(e);
        return res.status(400).json({
            message:'Error while updating the product details'
        });   
    }
});