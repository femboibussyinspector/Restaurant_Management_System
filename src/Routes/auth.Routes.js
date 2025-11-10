const { Router } = require('express');
const { loginAdmin } = require('../controllers/auth.controller.js');

const router = Router();

router.route("/login").post(loginAdmin); 

module.exports = router;