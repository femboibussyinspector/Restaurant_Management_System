const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItems',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: { // This is price * quantity
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    tableId: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'preparing','ready', 'served', 'paid'],
        default: 'pending'
    },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = {
    Order
};