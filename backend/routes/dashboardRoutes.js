const express = require("express");
const router = express.Router();

const {
  getDashboardSummary
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");

// =========================
// DASHBOARD ROUTES
// (ADMIN PROTECTED)
// =========================

/**
 * @desc   Dashboard summary
 * @route  GET /api/dashboard/summary
 */
router.get(
  "/summary",
  protect,
  getDashboardSummary
);

module.exports = router;
