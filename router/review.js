const express = require('express');
const { Review, Product } = require('../db');
const authenticateToken = require('../middleware/authentication');
const route = express.Router();


route.get('/:productId',async(req,res)=>{
    try{
        const skipValue = req.body.skipValue || 10;
        const pageCount = req.body.pageCount || 0;
        const productId = req.params.productId;
        const reviewIdList = await Product.findOne({_id:productId}).select('ratingAndReview').skip(skipValue*pageCount).limit(10);
        console.log(reviewIdList.ratingAndReview);
        const reviewList = await Review.find({
            _id:{ $in:reviewIdList.ratingAndReview}
        });

        return res.status(200).json({
            reviewList,
            message:'Review list extraction successful'
        });

    }catch(e){
        console.error(e);
        return res.status(400).json({
            message:'Fail to fetch Reviews'
        });
    }

});

route.post('/:productId',authenticateToken,async(req,res)=>{
    try{
        const user = req.userId;
        const {rating,comment} = req.body;
        const productId = req.params.productId;

        const newReview = await Review.create({
            rating,
            comment,
            user
        });

        await Product.findOneAndUpdate(
            {_id:productId},
            {$push:{ratingAndReview:newReview._id}},
            {new:true}
        );

        return res.status(200).json({
            newReview,
            message:'Review Posted successfully'
        });

    }catch(e){
        console.error(e);
        return res.status(400).json({
            message:'Error in posting the review'
        });
    }
});

route.post('/update/:reviewId', authenticateToken, async(req,res)=>{
    try{
        const userId = req.userId;
        const {rating,comment} = req.body;
        const reviewId = req.params.reviewId;

        const review = await Review.findOne({_id:reviewId});
        if(String(userId)!=String(review.user)){
            return res.status(404).json({
                message:'attempt unauthorized review update'
            });
        }
        
        const updatedReview =await Review.findOneAndUpdate(
            {_id:reviewId},
            {$set:{rating,comment}},
            {new:true}
        );

        return res.status(200).json({
            updatedReview,
            message:'successfully updated the review'
        });
        
    }catch(e){
        console.error(e);
        return res.status(200).json({
            message:'Error updating the review'
        });
    }
});

const reviewRoute = route;
module.exports = reviewRoute;