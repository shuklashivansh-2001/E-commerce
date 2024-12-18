const mongoose = require('mongoose');
require('dotenv').config();

const mongoDBURL = process.env.DB_URL;
console.log(mongoDBURL);
mongoose.connect(mongoDBURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true    
})
.then(()=>{
    console.log('Connected to MongoDB successfully');
})
.catch(err =>{
    console.error('MongoDB connection error:', err);
});

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    DOB:{
        type: Date,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,  // Regex to validate email format
    },
    password:{
        type: String,
        required: true
    },
    isActive:{
        type: Boolean,
        required:true,
        default: true,
    },
    createdAt:{
        type: Date,
        required:true,
        default: Date.now,
    },
    address:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Address'
    }],
    contacts:[{
        type: String,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please fill a valid phone number'], 
    }]
});

const addressSchema = new mongoose.Schema({
    street:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    state:{
        type: String,
        required: true,
        enum: [],
        message: `{VALUE} is not a valid state`
    },
    postalCode:{
        type: String,
        required:true,
        match: /^[0-9]{5}(-[0-9]{4})?$/
    },
    country:{
        type: String,
        required: true
    }
});

const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true,
        trim: true, // Removes leading and trailing whitespace
        maxlength: 100
    },
    description:{
        type: String,
        maxlength: 500
    },
    price:{
        type: String,
        required: true
    },
    stock:{
        type:Number,
        required: true,
        min: [0, 'stock cannot be negative'],
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now  // Automatically set the creation date
    },
    updatedAt: {
        type: Date
    },
    returnTime:{// return in days
        type: Number,
        required: true,
        min : [0],
        default: 0
    },
    warranty:{
        type: Number,
        required: true,
        min: [0],
        default: 0
    },
    guarantee:{
        type: Number,
        required: true,
        min: [0],
        default: 0
    },
    ratingAndReview:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Rating'
    }]
});

const productRatingAndReviewSchema = new mongoose.Schema({
    rating:{
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0
    },
    comment:{
        type: String,
        maxlength: 500
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        required: true,
    },
    updatedAt:{
        type:Date,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

const User = mongoose.model('User', userSchema);
const Address = mongoose.model('address', addressSchema);
const Product = mongoose.model('Product', productSchema);
const Review = mongoose.model('Rating', productRatingAndReviewSchema);

module.exports = {
    User,
    Address,
    Product,
    Review
}