const Table = require('../models/Table.js');
const { TableSession } = require('../models/TableSession.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const asyncHandler = require('../utils/asyncHandler.js');

const getAllTables = asyncHandler(async (req, res) => {
    const tables = await Table.find({}).sort({ tableNumber: 1 }).lean();
    
    const activeSessions = await TableSession.find({}).select('tableId -_id');
    
    const activeTableIds = new Set(activeSessions.map(session => session.tableId));

    const tablesWithSessionStatus = tables.map(table => ({
        ...table,
        isInSession: activeTableIds.has(table.tableNumber)
    }));

    return res
        .status(200)
        .json(new ApiResponse(
            200, 
            tablesWithSessionStatus, 
            "Tables retrieved successfully"
        ));
});
const updateTableStatus = asyncHandler(async (req, res) => {
    const { tableId } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new ApiError(400, "Status is required.");
    }

    const table = await Table.findById(tableId);

    if (!table) {
        throw new ApiError(404, "Table not found.");
    }

    table.status = status;
    await table.save();

    return res
        .status(200)
        .json(new ApiResponse(
            200, 
            table, 
            "Table status updated successfully"
        ));
});

module.exports = {
    getAllTables,
    updateTableStatus
};