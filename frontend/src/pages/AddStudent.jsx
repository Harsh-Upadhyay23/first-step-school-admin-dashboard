import { useState } from "react";
import { addStudent } from "../api/studentApi";

export default function AddStudent({ onBack, onSuccess }) {
  const [step, setStep] = useState("form"); // form | success
  const [savedData, setSavedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
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

  const [totalFees, setTotalFees] = useState("");
  const [initialPayment, setInitialPayment] = useState("");

  // =========================
  // SUBMIT ADMISSION
  // =========================
  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.age ||
      !form.gender ||
      !form.parent.mobile
    ) {
      alert("Name, Age, Gender and Mobile are required");
      return;
    }

    if (!totalFees || Number(totalFees) <= 0) {
      alert("Total Fees is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        age: Number(form.age),
        totalFees: Number(totalFees),
        initialPayment: Number(initialPayment || 0)
      };

      const res = await addStudent(payload);

      setSavedData({
        student: res.data.student,
        fee: res.data.fee
      });

      setStep("success");
      onSuccess();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Admission failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PRINT
  // =========================
  const handlePrint = () => {
    window.print();
  };

  // =========================
  // WHATSAPP
  // =========================
  const sendWhatsApp = () => {
    const { student, fee } = savedData;

    const message = `
🎓 *Admission Successful*

Student ID: ${student.studentId}
Roll No: ${student.rollNumber}

Name: ${student.name}
Class: ${student.class}
Age: ${student.age}
Gender: ${student.gender}
Session: ${student.session}

Father: ${student.parent.fatherName}
Mother: ${student.parent.motherName}
Mobile: ${student.parent.mobile}
Address: ${student.parent.address}

Total Fees: ₹${fee.totalFees}
Paid: ₹${fee.paidAmount}
Pending: ₹${fee.pendingAmount}

— FirstStep School
`;

    const phone = `91${student.parent.mobile}`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  // =========================
  // SUCCESS PAGE
  // =========================
  if (step === "success" && savedData) {
    const { student, fee } = savedData;

    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Admission Successful ✅
          </h1>

          <div className="space-y-1 text-sm">
            <p><b>Student ID:</b> {student.studentId}</p>
            <p><b>Roll No:</b> {student.rollNumber}</p>
            <p><b>Name:</b> {student.name}</p>
            <p><b>Class:</b> {student.class}</p>
            <p><b>Age:</b> {student.age}</p>
            <p><b>Gender:</b> {student.gender}</p>
            <p><b>Session:</b> {student.session}</p>

            <hr className="my-2" />

            <p><b>Father:</b> {student.parent.fatherName}</p>
            <p><b>Mother:</b> {student.parent.motherName}</p>
            <p><b>Mobile:</b> {student.parent.mobile}</p>
            <p><b>Address:</b> {student.parent.address}</p>

            <hr className="my-2" />

            <p><b>Total Fees:</b> ₹{fee.totalFees}</p>
            <p><b>Paid:</b> ₹{fee.paidAmount}</p>
            <p><b>Pending:</b> ₹{fee.pendingAmount}</p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handlePrint}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              🖨 Print
            </button>

            <button
              onClick={sendWhatsApp}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              📲 WhatsApp
            </button>

            <button
              onClick={onBack}
              className="border px-4 py-2 rounded"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // FORM PAGE
  // =========================
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">
        New Admission
      </h1>

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        {/* STUDENT */}
        <h2 className="font-semibold mb-2">Student Details</h2>

        <input
          placeholder="Student Name *"
          className="border p-2 w-full mb-3"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Age *"
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
          placeholder="Session"
          className="border p-2 w-full mb-4"
          value={form.session}
          onChange={(e) =>
            setForm({ ...form, session: e.target.value })
          }
        />

        {/* FEES */}
        <h2 className="font-semibold mb-2">Fees</h2>

        <input
          type="number"
          placeholder="Total Fees *"
          className="border p-2 w-full mb-3"
          value={totalFees}
          onChange={(e) => setTotalFees(e.target.value)}
        />

        <input
          type="number"
          placeholder="Initial Payment"
          className="border p-2 w-full mb-4"
          value={initialPayment}
          onChange={(e) =>
            setInitialPayment(e.target.value)
          }
        />

        {/* PARENT */}
        <h2 className="font-semibold mb-2">Parent Details</h2>

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
          placeholder="Mobile *"
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

        <textarea
          placeholder="Address"
          rows={3}
          className="border p-2 w-full mb-4"
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
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded"
          >
            {loading ? "Saving..." : "Submit"}
          </button>

          <button
            onClick={onBack}
            className="border px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
