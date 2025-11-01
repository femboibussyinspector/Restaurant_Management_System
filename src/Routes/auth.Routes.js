console.log('--- [auth.routes.js] FILE IS LOADING ---');

const { Router } = require('express');

// USE YOUR FILE PATHS
const { protect } = require('../middleWares/auth.middleware');

let registerUser, loginUser, logoutUser;

try {
  // We are wrapping this in a try...catch to find the silent error
  const controller = require('../controllers/auth.controller');
  
  registerUser = controller.registerUser;
  loginUser = controller.loginUser;
  logoutUser = controller.logoutUser;

  if (!registerUser || !loginUser || !logoutUser) {
    throw new Error('One or more controller functions are undefined. The import failed.');
  }

  console.log('--- [auth.routes.js] SUCCESSFULLY IMPORTED CONTROLLER ---');
} catch (error) {
  // This is what we're looking for. This will show us the REAL error.
  console.error('--- [auth.routes.js] FAILED TO IMPORT CONTROLLER! ---');
  console.error(error);
  
  // Create dummy functions so the server doesn't crash on startup
  registerUser = (req, res) => res.status(500).json({ error: 'Controller import failed. Check terminal.' });
  loginUser = (req, res) => res.status(500).json({ error: 'Controller import failed. Check terminal.' });
  logoutUser = (req, res) => res.status(500).json({ error: 'Controller import failed. Check terminal.' });
}

const router = Router();

//Public Routes//
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

//Secured Routes//
router.route('/logout').post(protect, logoutUser);

module.exports = router;

