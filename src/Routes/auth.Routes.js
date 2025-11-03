const { Router } = require("express");
const { protect } = require("../middleWares/auth.middleware");
const { registerUser, loginUser, logoutUser } = require("../controllers/auth.controller");

const router = Router();

// 🟢 Debug log to check if register route is hit
router.post("/register", (req, res, next) => {
  console.log("✅ /api/v1/auth/register route hit with body:", req.body);
  next();
}, registerUser);

router.post("/login", (req, res, next) => {
  console.log("✅ /api/v1/auth/login route hit with body:", req.body);
  next();
}, loginUser);

router.post("/logout", protect, logoutUser);

module.exports = router;
