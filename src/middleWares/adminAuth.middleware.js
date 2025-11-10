
const ApiError = require('../utils/ApiError.js'); 
const asyncHandler = require('../utils/asyncHandler.js');
const jwt = require('jsonwebtoken');

const verifyAdminToken = asyncHandler(async (req, _, next) => {
    
    const token = req.cookies?.adminAccessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Admin access required: Token missing.");
    }

    // Wrap in try-catch to handle JWT verification failures (expired/invalid token)
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const { role } = decodedToken;

        if (role !== "admin") {
            throw new ApiError(403, "Forbidden: Invalid role for this action.");
        }

        // CRUCIAL: Attach the decoded token/info to the request object
        req.admin = decodedToken;
        
        next();

    } catch (error) {
        // This handles expired token or invalid signature
        throw new ApiError(401, error?.message || "Invalid Admin Access Token.");
    }
});

module.exports = {
    verifyAdminToken
};