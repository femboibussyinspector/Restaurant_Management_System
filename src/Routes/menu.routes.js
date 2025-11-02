const {Router} = require('express')
const{createMenuItem, getAllMenuItems,updateMenuItem, getMenuItemById, deleteMenuItem,} = require('../controllers/menu.controller')
const {protect, authorize} = require('../middleWares/auth.middleware');

const router = Router();


router.route('/').get(getAllMenuItems);
router.route('/:id').get(getMenuItemById);

//Protected Routes Only for Admins and employees//
router
.route('/').post(protect, authorize('admin','employee'), createMenuItem)
router
.route('/:id').post(protect, authorize('admin','employee'), createMenuItem)



//Admin only access//
router.route('/:id').delete(protect, authorize('admin',), deleteMenuItem)

module.exports = router;