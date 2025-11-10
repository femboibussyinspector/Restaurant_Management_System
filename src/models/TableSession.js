const mongoose = require('mongoose');

const tableSessionSchema = new mongoose.Schema({
    tableId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
    },
    sessionToken: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        default: Date.now,
        expires: '24h',
    },
}, { timestamps: true });

const TableSession = mongoose.model("TableSession", tableSessionSchema);

module.exports = {
    TableSession
};