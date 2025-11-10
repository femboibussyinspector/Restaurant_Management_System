const { Router } = require('express');
const {
    createMenuItem,
    getAllMenuItems,
    getMenuItemById,
    deleteMenuItem,
    updateMenuItem // 1. Import the new controller
} = require('../controllers/menu.controller');

const { verifyAdminToken } = require('../middleWares/adminAuth.middleware.js');

const router = Router();

// --- Public Routes ---
router.route('/').get(getAllMenuItems);
router.route('/:id').get(getMenuItemById);

// --- Admin-Only Routes ---

router.route('/').post(verifyAdminToken, createMenuItem);

// 2. Add the new PUT route for updating
router.route('/:id').put(verifyAdminToken, updateMenuItem);

router.route('/:id').delete(verifyAdminToken, deleteMenuItem);

module.exports = router;