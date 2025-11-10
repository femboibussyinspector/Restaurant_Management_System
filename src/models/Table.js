const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    capacity: {
        type: Number,
        required: true,
        default: 4,
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'occupied', 'reserved', 'cleaning'],
        default: 'available',
    },
}, { timestamps: true });

const Table = mongoose.model("Table", tableSchema);

module.exports = Table;