const express = require('express');
const { Product } = require('../db');
const authenticateToken = require('../middleware/authentication');
const route = express.Router();
const redisClient = require('../config/redisClient');

route.get('/products/', async(req,res)=>{
    try{
        const {skipValue = 10, pageCount = 0} = req.query;
        const productList = await Product.find().skip(skipValue*pageCount).limit(20);

        console.log(productList)
        return res.status(200).json({
            productList
        });
    }catch(e){
        return res.status(400).json({
            message:'Error retriving the product list'
        });
    }
});

route.get('/topRated', async(req,res)=>{ // can also return null if no topRated product is present in redis cache
    try{
        const keys = await redisClient.keys('topRatedProducts:*');

        const productList = []; 
        for (const key of keys){ 
            const value = await redisClient.get(key); 
            productList.push(JSON.parse(value));
        }
        console.log(productList);
        return res.status(200).json({
            productList
        });
    }catch(e){
        return res.status(400).json({
            message:'Error getting top rated products'
        });
    }
});

route.get('/:productId', async(req,res)=>{
    try{
        const productId = req.params.productId;
        const productDetails =  await Product.findById({_id:productId});
        console.log(productDetails);
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
        
        if(!productName || !description || !price || !stock){
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

        return res.status(200).json({
            newProduct,
            message:'Succefully added the product in DB'
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
        const productId = req.params.productId;
        
        const updatedProduct = await Product.findOneAndUpdate(
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

const productRoute = route;
module.exports = productRoute;