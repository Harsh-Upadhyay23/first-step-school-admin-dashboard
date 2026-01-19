const mongoose = require("mongoose");

/**
 * ============================
 * COUNTER SCHEMA
 * ============================
 */
const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  seq: {
    type: Number,
    default: 1000
  }
});

const Counter = mongoose.model("Counter", counterSchema);

/**
 * ============================
 * STUDENT SCHEMA
 * ============================
 */
const studentSchema = new mongoose.Schema(
  {
    // 🔢 Auto 4-digit Student ID
    studentId: {
      type: Number,
      unique: true
    },

    // 🆔 Roll Number
    rollNumber: {
      type: String
    },

    name: {
      type: String,
      required: true
    },

    class: {
      type: String,
      required: true
    },

    age: {
      type: Number,
      required: true
    },

    gender: {
      type: String,
      required: true
    },

    session: {
      type: String,
      required: true
    },

    parent: {
      fatherName: String,
      motherName: String,
      mobile: {
        type: String,
        required: true
      },
      address: String
    },

    admissionDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

/**
 * ============================
 * PRE SAVE HOOK
 * (NO next() ❌)
 * ============================
 */
studentSchema.pre("save", async function () {
  if (!this.isNew) return;

  // 🔢 Student ID
  const studentCounter = await Counter.findOneAndUpdate(
    { name: "studentId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.studentId = studentCounter.seq;

  // 🆔 Roll Number (class wise)
  const rollCounter = await Counter.findOneAndUpdate(
    { name: `roll_${this.class}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.rollNumber = `${this.class.replace(
    /\s/g,
    ""
  )}-${rollCounter.seq}`;
});

module.exports = mongoose.model("Student", studentSchema);
