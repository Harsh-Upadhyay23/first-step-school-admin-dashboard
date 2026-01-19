const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    },
    amount: Number,
    mode: {
      type: String,
      default: "Cash" // Cash | UPI | Cheque (manual label)
    },
    remark: String,
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
