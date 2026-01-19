import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PendingFees({ onBack }) {
  const [className, setClassName] = useState("Nursery");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // NEW STATES
  const [showInfo, setShowInfo] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  // =========================
  // LOAD PENDING FEES
  // =========================
  const loadPendingFees = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/fees/pending/${className}`
      );
      setData(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load pending fees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingFees();
  }, [className]);

  // =========================
  // LOAD STUDENT INFO
  // =========================
  const openStudentInfo = async (studentId) => {
    try {
      const res = await api.get(`/students/${studentId}`);
      setStudentInfo(res.data);
      setShowInfo(true);
    } catch (err) {
      alert("Failed to load student info");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">
        Class-wise Pending Fees
      </h1>

      {/* CLASS SELECT */}
      <div className="mb-4 max-w-xs">
        <select
          className="border p-2 w-full"
          value={className}
          onChange={(e) =>
            setClassName(e.target.value)
          }
        >
          <option>Playgroup</option>
          <option>Nursery</option>
          <option>Junior KG</option>
          <option>Senior KG</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && (
        <p className="text-red-600 mb-2">{error}</p>
      )}

      {/* TABLE */}
      {!loading && data.length > 0 && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-left">
                  Name
                </th>
                <th className="border p-2">
                  Class
                </th>
                <th className="border p-2">
                  Total
                </th>
                <th className="border p-2">
                  Paid
                </th>
                <th className="border p-2">
                  Pending
                </th>
                <th className="border p-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.studentId}>
                  <td className="border p-2">
                    {item.name}
                  </td>
                  <td className="border p-2 text-center">
                    {item.class}
                  </td>
                  <td className="border p-2 text-center">
                    ₹{item.totalFees}
                  </td>
                  <td className="border p-2 text-center">
                    ₹{item.paidAmount}
                  </td>
                  <td className="border p-2 text-center text-red-600 font-medium">
                    ₹{item.pendingAmount}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() =>
                        openStudentInfo(item.studentId)
                      }
                      className="text-indigo-600 underline"
                    >
                      Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && data.length === 0 && (
        <p className="text-gray-600">
          No pending fees for this class 🎉
        </p>
      )}

      <button onClick={onBack} className="underline mt-4">
        Back
      </button>

      {/* ========================= */}
      {/* STUDENT INFO MODAL */}
      {/* ========================= */}
      {showInfo && studentInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">
              Student Information
            </h2>

            <p><b>ID:</b> {studentInfo.studentId}</p>
            <p><b>Roll No:</b> {studentInfo.rollNumber}</p>
            <p><b>Name:</b> {studentInfo.name}</p>
            <p><b>Class:</b> {studentInfo.class}</p>
            <p><b>Age:</b> {studentInfo.age}</p>
            <p><b>Gender:</b> {studentInfo.gender}</p>
            <p><b>Session:</b> {studentInfo.session}</p>

            <hr className="my-3" />

            <p><b>Father:</b> {studentInfo.parent?.fatherName}</p>
            <p><b>Mother:</b> {studentInfo.parent?.motherName}</p>
            <p><b>Mobile:</b> {studentInfo.parent?.mobile}</p>
            <p><b>Address:</b> {studentInfo.parent?.address}</p>

            <button
              onClick={() => setShowInfo(false)}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
