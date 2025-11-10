const jwt = require('jsonwebtoken');
const User = require('../models/User')
const {ApiError} = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')

/**Middleware t protect Routes */

const protect = asyncHandler(async(req,res, next)=>{
    let token;
    //Get token from either Cookie
    if (req.cookies.accessToken){
        token = req.cookies.accessToken;
    }
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
          
            token = req.headers.authorization.split(' ')[1];
        }

    // Checking if token exists//
    if(!token){
        throw new ApiError(401, "Not authorized, no tokken provided")
    }    
    try{
        //Token verification//
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        // Find user from token ID//
        const user = await User.findById(decoded._id).select('-password -refreshToken');
    if(!user){
        throw new ApiError(404, "User Not Found")
    }
    req.user = user;
    next();
}catch (error){
    console.error("JWT Verification Error:", error.message);
    throw new ApiError(401, "Not authorized, token is invalid or expired");
}
});


const authorize = (...roles)=>{
    return (req, res, next) => {
            // Role based Access Control checking
        if (!roles.includes(req.user.role)){
            throw new ApiError(403,
                `Role '${req.user.role}' is not authorized to access this route`
            );
        }
    next();
    }
}
module.exports = {
    protect, authorize,
};