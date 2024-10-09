const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req,res,next) =>{
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];

        if(!token) return res.status(401).json({
            message:"no token found"
        });

        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        console.log(user);
        next();
    }catch(e){
        return res.status(403).json({
            message: "Invalid token"
        });
    }
};

module.exports = authenticateToken;