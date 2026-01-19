import { useState, useEffect } from "react";
import { getStudentById, updateStudent } from "../api/studentApi";

export default function EditStudent({ studentId, onBack, onSuccess }) {
  const [form, setForm] = useState({
    studentId: "",
    rollNumber: "",
    name: "",
    age: "",
    class: "Nursery",
    gender: "Male",
    session: "2024-25",
    parent: {
      fatherName: "",
      motherName: "",
      mobile: "",
      address: ""
    }
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD STUDENT DATA
  // =========================
  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await getStudentById(studentId);
        const data = res.data;

        setForm({
          studentId: data.studentId || "",
          rollNumber: data.rollNumber || "",
          name: data.name || "",
          age: data.age || "",
          class: data.class || "Nursery",
          gender: data.gender || "Male",
          session: data.session || "2024-25",
          parent: {
            fatherName: data.parent?.fatherName || "",
            motherName: data.parent?.motherName || "",
            mobile: data.parent?.mobile || "",
            address: data.parent?.address || ""
          }
        });
      } catch (err) {
        alert("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [studentId]);

  // =========================
  // UPDATE STUDENT
  // =========================
  const handleUpdate = async () => {
    if (!form.name || !form.age || !form.parent.mobile) {
      alert("Name, Age and Mobile are required");
      return;
    }

    try {
      await updateStudent(studentId, form);
      alert("Student updated successfully");
      onSuccess();
      onBack();
    } catch (err) {
      alert(
        err?.response?.data?.message || "Update failed"
      );
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">
        Edit Student
      </h1>

      <div className="bg-white p-4 rounded shadow max-w-xl">

        {/* READ ONLY IDS */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            value={form.studentId}
            disabled
            className="border p-2 bg-gray-100"
            placeholder="Student ID"
          />
          <input
            value={form.rollNumber}
            disabled
            className="border p-2 bg-gray-100"
            placeholder="Roll No"
          />
        </div>

        {/* BASIC INFO */}
        <input
          placeholder="Student Name"
          className="border p-2 w-full mb-3"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Age"
          className="border p-2 w-full mb-3"
          value={form.age}
          onChange={(e) =>
            setForm({ ...form, age: e.target.value })
          }
        />

        <select
          className="border p-2 w-full mb-3"
          value={form.class}
          onChange={(e) =>
            setForm({ ...form, class: e.target.value })
          }
        >
          <option>Playgroup</option>
          <option>Nursery</option>
          <option>Junior KG</option>
          <option>Senior KG</option>
        </select>

        <select
          className="border p-2 w-full mb-3"
          value={form.gender}
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value })
          }
        >
          <option>Male</option>
          <option>Female</option>
        </select>

        <input
          placeholder="Session (eg: 2024-25)"
          className="border p-2 w-full mb-3"
          value={form.session}
          onChange={(e) =>
            setForm({ ...form, session: e.target.value })
          }
        />

        {/* PARENT DETAILS */}
        <input
          placeholder="Father Name"
          className="border p-2 w-full mb-3"
          value={form.parent.fatherName}
          onChange={(e) =>
            setForm({
              ...form,
              parent: {
                ...form.parent,
                fatherName: e.target.value
              }
            })
          }
        />

        <input
          placeholder="Mother Name"
          className="border p-2 w-full mb-3"
          value={form.parent.motherName}
          onChange={(e) =>
            setForm({
              ...form,
              parent: {
                ...form.parent,
                motherName: e.target.value
              }
            })
          }
        />

        <input
          placeholder="Mobile"
          className="border p-2 w-full mb-3"
          value={form.parent.mobile}
          onChange={(e) =>
            setForm({
              ...form,
              parent: {
                ...form.parent,
                mobile: e.target.value
              }
            })
          }
        />

        <input
          placeholder="Address"
          className="border p-2 w-full mb-3"
          value={form.parent.address}
          onChange={(e) =>
            setForm({
              ...form,
              parent: {
                ...form.parent,
                address: e.target.value
              }
            })
          }
        />

        <div className="flex gap-3">
          <button
            onClick={handleUpdate}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>

          <button
            onClick={onBack}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
