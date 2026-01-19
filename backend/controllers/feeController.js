const Fee = require("../models/Fee");
const Payment = require("../models/Payment");
const Student = require("../models/Student");

/**
 * =====================================
 * GET FEES SUMMARY BY STUDENT
 * GET /api/fees/:studentId
 * =====================================
 */
exports.getFeesByStudent = async (req, res) => {
  try {
    const fee = await Fee.findOne({
      studentId: req.params.studentId
    });

    res.json(fee); // can be null (handled in frontend)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch fees"
    });
  }
};

/**
 * =====================================
 * ADD MANUAL PAYMENT
 * POST /api/fees/pay/:studentId
 * =====================================
 */
exports.addPayment = async (req, res) => {
  try {
    const { amount, remark, mode } = req.body;

    const fee = await Fee.findOne({
      studentId: req.params.studentId
    });

    if (!fee) {
      return res.status(400).json({
        message: "Fees record not found for this student"
      });
    }

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({
        message: "Invalid payment amount"
      });
    }

    // 1️⃣ SAVE PAYMENT HISTORY
    await Payment.create({
      studentId: req.params.studentId,
      amount: numAmount,
      mode: mode || "Cash",
      remark: remark || "Manual payment"
    });

    // 2️⃣ UPDATE FEES SUMMARY
    fee.paidAmount += numAmount;
    fee.pendingAmount = fee.totalFees - fee.paidAmount;
    fee.status =
      fee.pendingAmount === 0 ? "Paid" : "Partial";

    await fee.save();

    res.json(fee);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add payment"
    });
  }
};

/**
 * =====================================
 * ✅ PAYMENT HISTORY (FIXED)
 * GET /api/fees/history/:studentId
 * =====================================
 */
exports.getPaymentHistoryByStudent = async (req, res) => {
  try {
    const payments = await Payment.find({
      studentId: req.params.studentId
    })
      .sort({ createdAt: -1 }) // latest first
      .select("amount mode remark createdAt");

    // 🔥 VERY IMPORTANT FORMAT FIX
    const formatted = payments.map((p) => ({
      _id: p._id,
      amount: p.amount,
      mode: p.mode,
      remark: p.remark,
      date: p.createdAt // frontend expects `date`
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch payment history"
    });
  }
};

/**
 * =====================================
 * GET CLASS-WISE PENDING FEES
 * GET /api/fees/pending/:className
 * =====================================
 */
exports.getPendingFeesByClass = async (req, res) => {
  try {
    const students = await Student.find({
      class: req.params.className
    }).select("_id name class");

    const studentIds = students.map((s) => s._id);

    const fees = await Fee.find({
      studentId: { $in: studentIds },
      pendingAmount: { $gt: 0 }
    }).populate("studentId", "name class");

    const result = fees.map((f) => ({
      studentId: f.studentId._id,
      name: f.studentId.name,
      class: f.studentId.class,
      totalFees: f.totalFees,
      paidAmount: f.paidAmount,
      pendingAmount: f.pendingAmount,
      status: f.status
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pending fees"
    });
  }
};
