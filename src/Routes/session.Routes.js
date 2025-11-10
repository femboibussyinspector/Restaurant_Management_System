const { Router } = require('express');
const { 
    startTableSession, 
    endTableSession 
} = require('../controllers/session.controller.js');

const router = Router();

router.route("/start").post(startTableSession);
router.route("/end").post(endTableSession);

module.exports = router;