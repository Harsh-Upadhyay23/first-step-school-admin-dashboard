const express = require("express");
const router = express.Router();

const {
  loginAdmin
} = require("../controllers/authController");

/**
 * @desc   Admin login
 * @route  POST /api/auth/login
 */
router.post("/login", loginAdmin);

module.exports = router;
