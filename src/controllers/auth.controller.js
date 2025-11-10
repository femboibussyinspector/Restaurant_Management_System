
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const asyncHandler = require('../utils/asyncHandler.js');
const jwt = require('jsonwebtoken');

// --- HARDCODED ADMIN CREDENTIALS ---
const ADMIN_EMAIL = "admin@restaurant.com";
const ADMIN_PASSWORD = "zxcvbnms118"; 
// -------------------------------------

// This is the only function in the file
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    // 1. Check if email and password match the hardcoded values
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        throw new ApiError(401, "Invalid admin credentials.");
    }

    // 2. If they match, generate an Admin Token (this is different from the Table Token)
    // We don't need to check a database
    const adminToken = jwt.sign(
        { 
            role: "admin",
            email: ADMIN_EMAIL
        },
        process.env.ACCESS_TOKEN_SECRET, // Make sure this is in your .env
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Make sure this is in your .env
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    return res
        .status(200)
        .cookie("adminAccessToken", adminToken, options) // Send a specific admin cookie
        .json(new ApiResponse(
            200, 
            { token: adminToken, email: ADMIN_EMAIL }, 
            "Admin logged in successfully."
        ));
});

// --- Export ONLY the login function ---
module.exports = {
    loginAdmin
};