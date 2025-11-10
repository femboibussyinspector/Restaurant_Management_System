// src/Routes/order.Routes.js

const { Router } = require('express');
const { verifyTableToken } = require('../middleWares/tableAuth.middleware.js');
const { verifyAdminToken } = require('../middleWares/adminAuth.middleware.js'); 
const { 
    placeOrder,
    updateOrderStatus 
} = require('../controllers/order.controller.js');

const router = Router();

router.route('/create').post(verifyTableToken, placeOrder);



router.route('/:orderId/status').patch(/*verifyAdminToken*/ updateOrderStatus);
module.exports = router;