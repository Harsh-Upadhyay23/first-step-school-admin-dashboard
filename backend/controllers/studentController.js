const Student = require("../models/Student");
const Fee = require("../models/Fee");
const Payment = require("../models/Payment");

/**
 * ======================================
 * ADD STUDENT (ADMISSION + FEES)
 * ======================================
 * POST /api/students
 */
exports.addStudent = async (req, res) => {
  try {
    const {
      totalFees,
      initialPayment,
      ...studentData
    } = req.body;

    // -------------------------
    // VALIDATION
    // -------------------------
    if (!totalFees || Number(totalFees) <= 0) {
      return res.status(400).json({
        message: "Total fees is required"
      });
    }

    // -------------------------
    // 1️⃣ CREATE STUDENT (IMPORTANT FIX)
    // -------------------------
    const student = new Student(studentData);
    await student.save(); // 🔥 pre-save hook WILL RUN

    // -------------------------
    // 2️⃣ HANDLE INITIAL PAYMENT
    // -------------------------
    let paidAmount = 0;
    const firstPayment = Number(initialPayment);

    if (firstPayment && firstPayment > 0) {
      paidAmount = firstPayment;

      await Payment.create({
        studentId: student._id,
        amount: paidAmount,
        remark: "Admission payment"
      });
    }

    // -------------------------
    // 3️⃣ CREATE FEES RECORD
    // -------------------------
    const total = Number(totalFees);

    const fee = await Fee.create({
      studentId: student._id,
      totalFees: total,
      paidAmount: paidAmount,
      pendingAmount: total - paidAmount,
      status:
        total - paidAmount === 0
          ? "Paid"
          : "Partial"
    });

    res.status(201).json({
      message: "Student admitted successfully",
      student,
      fee
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error.message
    });
  }
};

/**
 * ======================================
 * GET ALL STUDENTS
 * ======================================
 */
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({
      createdAt: -1
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students"
    });
  }
};

/**
 * ======================================
 * GET STUDENTS BY CLASS
 * ======================================
 */
exports.getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.find({
      class: req.params.className
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students"
    });
  }
};

/**
 * ======================================
 * GET STUDENT BY ID
 * ======================================
 */
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch student"
    });
  }
};

/**
 * ======================================
 * UPDATE STUDENT
 * ======================================
 */
exports.updateStudent = async (req, res) => {
  try {
    const student =
      await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

/**
 * ======================================
 * DELETE STUDENT (CASCADE)
 * ======================================
 */
exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    await Payment.deleteMany({ studentId });
    await Fee.deleteOne({ studentId });

    const student =
      await Student.findByIdAndDelete(
        studentId
      );

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json({
      message:
        "Student and related records deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
