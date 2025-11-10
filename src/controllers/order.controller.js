const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const { Order } = require('../models/Order.js'); 
const MenuItem = require('../models/Menu.Items.js'); 

const placeOrder = asyncHandler(async (req, res) => {

    const io = req.app.get('io');
    const { items } = req.body;
    const tableId = req.tableId;

    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new ApiError(400, "Order items are required and must be an array.");
    }
    if (!tableId) {
        throw new ApiError(401, "Invalid session. Table ID not found.");
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItemId);
        if (!menuItem) {
            throw new ApiError(404, `Menu item with ID ${item.menuItemId} not found.`);
        }
        
        const price = menuItem.price * item.quantity;
        totalAmount += price;
        
        processedItems.push({
            menuItem: item.menuItemId,
            name: menuItem.name,
            quantity: item.quantity,
            price: price
        });
    }

    const newOrder = await Order.create({
        tableId: tableId,
        items: processedItems,
        totalAmount: totalAmount,
        status: 'pending'
    });

    if (!newOrder) {
        throw new ApiError(500, "Something went wrong while placing the order.");
    }
    
    // --- SOCKET.IO ACTION ---
    io.emit('newOrderPlaced', newOrder); 
    // ------------------------

    return res.status(201).json(
        new ApiResponse(201, newOrder, "Order placed successfully.")
    );
});

const getTableOrders = asyncHandler(async (req, res) => {
    const tableId = req.tableId;

    if (!tableId) {
        throw new ApiError(401, "Invalid session. Table ID not found.");
    }

    const orders = await Order.find({ tableId: tableId }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, orders, "Orders retrieved successfully.")
    );
});
const updateOrderStatus = asyncHandler(async (req, res) => {
    const io = req.app.get('io');
    const { orderId } = req.params;
    const { status } = req.body;
  
    if (!orderId) {
      throw new ApiError(400, "Order ID is required.");
    }
  
    if (!status) {
      throw new ApiError(400, "New status is required.");
    }
  
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found.");
    }
  
    order.status = status;
    const updatedOrder = await order.save();
  
    io.emit('orderStatusUpdated', updatedOrder);
  
    return res.status(200).json(
      new ApiResponse(200, updatedOrder, `Order status updated to ${status}.`)
    );
  });

  module.exports = {
    placeOrder,
    getTableOrders,
    updateOrderStatus
};