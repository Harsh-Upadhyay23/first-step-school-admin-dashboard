import api from "./axios";

// =========================
// STUDENT APIs (PROTECTED)
// =========================

// 1️⃣ Add new student (Admission)
export const addStudent = (data) => {
  return api.post("/students", data);
};

// 2️⃣ Get all students
export const getAllStudents = () => {
  return api.get("/students");
};

// 3️⃣ Get students by class
export const getStudentsByClass = (className) => {
  return api.get(`/students/class/${className}`);
};

// 4️⃣ Get single student by ID
export const getStudentById = (id) => {
  return api.get(`/students/${id}`);
};

// 5️⃣ Update student
export const updateStudent = (id, data) => {
  return api.put(`/students/${id}`, data);
};

// 6️⃣ Delete student
export const deleteStudent = (id) => {
  return api.delete(`/students/${id}`);
};
