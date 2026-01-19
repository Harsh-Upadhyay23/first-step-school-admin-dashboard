const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    },
    totalFees: Number,
    paidAmount: {
      type: Number,
      default: 0
    },
    pendingAmount: Number,
    status: {
      type: String,
      default: "Pending" // Pending | Partial | Paid
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);
