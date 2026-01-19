import { useEffect, useState } from "react";
import {
  getAllStudents,
  getStudentsByClass,
  deleteStudent
} from "../api/studentApi";

import AddStudent from "./AddStudent";
import EditStudent from "./EditStudent";
import Fees from "./Fees";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedClass, setSelectedClass] = useState("All");
  const [search, setSearch] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [feesStudentId, setFeesStudentId] = useState(null);

  // =========================
  // LOAD STUDENTS
  // =========================
  const loadStudents = async (cls = "All") => {
    setLoading(true);
    try {
      const res =
        cls === "All"
          ? await getAllStudents()
          : await getStudentsByClass(cls);

      setStudents(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // =========================
  // SEARCH FILTER (NAME / MOBILE / ID)
  // =========================
  useEffect(() => {
    const q = search.toLowerCase();

    const result = students.filter((stu) => {
      return (
        stu.name.toLowerCase().includes(q) ||
        stu.parent?.mobile?.includes(q) ||
        String(stu.studentId || "").includes(q)
      );
    });

    setFiltered(result);
  }, [search, students]);

  // =========================
  // DELETE STUDENT
  // =========================
  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!ok) return;

    await deleteStudent(id);
    loadStudents(selectedClass);
  };

  // =========================
  // CONDITIONAL VIEWS
  // =========================
  if (showAddForm) {
    return (
      <AddStudent
        onBack={() => setShowAddForm(false)}
        onSuccess={() => loadStudents(selectedClass)}
      />
    );
  }

  if (editStudentId) {
    return (
      <EditStudent
        studentId={editStudentId}
        onBack={() => setEditStudentId(null)}
        onSuccess={() => loadStudents(selectedClass)}
      />
    );
  }

  if (feesStudentId) {
    return (
      <Fees
        studentId={feesStudentId}
        onBack={() => setFeesStudentId(null)}
      />
    );
  }

  // =========================
  // MAIN LIST
  // =========================
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">
          Students
        </h1>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          + New Admission
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedClass}
          onChange={(e) => {
            const cls = e.target.value;
            setSelectedClass(cls);
            loadStudents(cls);
          }}
          className="border p-2 rounded"
        >
          <option value="All">All Classes</option>
          <option value="Playgroup">Playgroup</option>
          <option value="Nursery">Nursery</option>
          <option value="Junior KG">Junior KG</option>
          <option value="Senior KG">Senior KG</option>
        </select>

        <input
          type="text"
          placeholder="Search by ID / name / mobile..."
          className="border p-2 rounded flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-600">Loading students...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No students found</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Student ID</th>
                <th className="text-left">Roll No</th>
                <th className="text-left">Name</th>
                <th className="text-left">Class</th>
                <th className="text-left">Age</th>
                <th className="text-left">Mobile</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((stu) => (
                <tr key={stu._id} className="border-t">
                  <td className="p-3 font-mono">
                    {stu.studentId || "-"}
                  </td>
                  <td>{stu.rollNumber || "-"}</td>
                  <td className="font-medium">{stu.name}</td>
                  <td>{stu.class}</td>
                  <td>{stu.age}</td>
                  <td>{stu.parent?.mobile}</td>
                  <td className="space-x-3">
                    <button
                      onClick={() =>
                        setEditStudentId(stu._id)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setFeesStudentId(stu._id)
                      }
                      className="text-green-600 hover:underline"
                    >
                      Fees
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(stu._id)
                      }
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
