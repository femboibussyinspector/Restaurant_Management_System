const ApiError = require('../utils/ApiError.js');
const asyncHandler = require('../utils/asyncHandler.js');
const jwt = require('jsonwebtoken');
const { TableSession } = require('../models/TableSession.js');

const verifyTableToken = asyncHandler(async (req, _, next) => {
    
    const token = req.cookies?.tableToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized request: No token provided.");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const { tableId } = decodedToken;
    if (!tableId) {
        throw new ApiError(401, "Invalid token: Payload missing table ID.");
    }

    const session = await TableSession.findOne({ tableId, sessionToken: token });

    if (!session) {
        throw new ApiError(401, "Session has expired or was terminated.");
    }

    req.tableId = session.tableId; 
    
    next();
});

module.exports = {
    verifyTableToken
};