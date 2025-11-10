const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const jwt = require('jsonwebtoken');
const { TableSession } = require('../models/TableSession.js');
const Table = require('../models/Table.js');

const generateTableToken = (tableId) => {
    return jwt.sign(
        { tableId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

const startTableSession = asyncHandler(async (req, res) => {
    const { tableId } = req.body;

    if (!tableId || tableId.trim() === "") {
        throw new ApiError(400, "Table ID is required.");
    }

    const normalizedTableId = tableId.toUpperCase().trim();

    const existingSession = await TableSession.findOne({ tableId: normalizedTableId });
    if (existingSession) {
        throw new ApiError(409, `Table ${normalizedTableId} is already in session.`);
    }

    let table = await Table.findOne({ tableNumber: normalizedTableId });

    if (!table) {
        table = await Table.create({
            tableNumber: normalizedTableId,
            capacity: 4, 
            status: "available"
        });
    }

    const token = generateTableToken(normalizedTableId);

    const newSession = await TableSession.create({
        tableId: normalizedTableId,
        sessionToken: token
    });
    
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    return res
        .status(200)
        .cookie("tableToken", token, options)
        .json(new ApiResponse(200, { tableId: newSession.tableId, token }, `Session started for Table ${normalizedTableId}`));
});

const endTableSession = asyncHandler(async (req, res) => {
    const { tableId } = req.body; 

    if (!tableId || tableId.trim() === "") {
        throw new ApiError(400, "Table ID is required.");
    }

    const normalizedTableId = tableId.toUpperCase().trim();
    
    const result = await TableSession.deleteOne({ tableId: normalizedTableId });

    if (result.deletedCount === 0) {
         throw new ApiError(404, `No active session found for Table ${normalizedTableId}.`);
    }

    const options = { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production' 
    };
    
    return res
        .status(200)
        .clearCookie("tableToken", options)
        .json(new ApiResponse(200, {}, `Session ended for Table ${normalizedTableId}`));
});

module.exports = {
    startTableSession,
    endTableSession
};