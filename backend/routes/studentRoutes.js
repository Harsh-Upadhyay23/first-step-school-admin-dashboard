const express = require("express");
const router = express.Router();

const {
  addStudent,
  getAllStudents,
  getStudentsByClass,
  getStudentById,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");

// =========================
// ALL STUDENT ROUTES
// (ADMIN PROTECTED)
// =========================

// CREATE (Admission)
router.post("/", protect, addStudent);

// READ
router.get("/", protect, getAllStudents);
router.get("/class/:className", protect, getStudentsByClass);
router.get("/:id", protect, getStudentById);

// UPDATE
router.put("/:id", protect, updateStudent);

// DELETE
router.delete("/:id", protect, deleteStudent);

module.exports = router;
