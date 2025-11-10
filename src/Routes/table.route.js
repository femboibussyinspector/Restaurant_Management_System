const { Router } = require('express');
const { 
    getAllTables, 
    updateTableStatus 
} = require('../controllers/Table.controller.js');
const { verifyAdminToken } = require('../middleWares/adminAuth.middleware.js');

const router = Router();

// --- Admin-Only Routes ---
router.use(verifyAdminToken);

router.route('/').get(getAllTables);
router.route('/:tableId/status').patch(updateTableStatus);

module.exports = router;