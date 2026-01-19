const express = require("express");
const router = express.Router();

const {
  getFeesByStudent,
  addPayment,
  getPendingFeesByClass,
  getPaymentHistoryByStudent
} = require("../controllers/feeController");

const { protect } = require("../middleware/authMiddleware");

// =========================
// FEES ROUTES (ADMIN ONLY)
// =========================

/**
 * @desc   Get class-wise pending fees
 * @route  GET /api/fees/pending/:className
 */
router.get(
  "/pending/:className",
  protect,
  getPendingFeesByClass
);

/**
 * @desc   Get payment history of a student
 * @route  GET /api/fees/history/:studentId
 */
router.get(
  "/history/:studentId",
  protect,
  getPaymentHistoryByStudent
);

/**
 * @desc   Get fees summary by student
 * @route  GET /api/fees/:studentId
 */
router.get(
  "/:studentId",
  protect,
  getFeesByStudent
);

/**
 * @desc   Add payment
 * @route  POST /api/fees/pay/:studentId
 */
router.post(
  "/pay/:studentId",
  protect,
  addPayment
);

module.exports = router;
