import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Fees({ studentId, onBack }) {
  const [fee, setFee] = useState(null);
  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("Cash");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [lastPayment, setLastPayment] = useState(null);

  // =========================
  // LOAD FEES + HISTORY + STUDENT
  // =========================
  const loadAll = async () => {
    try {
      setLoading(true);

      const [feeRes, historyRes, studentRes] = await Promise.all([
        api.get(`/fees/${studentId}`),
        api.get(`/fees/history/${studentId}`),
        api.get(`/students/${studentId}`)
      ]);

      setFee(feeRes.data);
      setHistory(historyRes.data || []);
      setStudent(studentRes.data);
      setError("");
    } catch (err) {
      setError("Failed to load fees data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [studentId]);

  // =========================
  // ADD PAYMENT
  // =========================
  const addPayment = async () => {
    setError("");

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError("Enter a valid payment amount");
      return;
    }

    try {
      await api.post(`/fees/pay/${studentId}`, {
        amount: numAmount,
        mode,
        remark: remark || "Fees payment"
      });

      setLastPayment({
        amount: numAmount,
        mode,
        remark: remark || "Fees payment"
      });

      setAmount("");
      setMode("Cash");
      setRemark("");

      loadAll();
    } catch (err) {
      setError("Payment failed");
    }
  };

  // =========================
  // SEND WHATSAPP MESSAGE
  // =========================
  const sendWhatsApp = () => {
    if (!student?.parent?.mobile) {
      alert("Parent mobile number not found");
      return;
    }

    const mobile = student.parent.mobile;

    const message = `
*FirstStep School*

Dear Parent,

This is to inform you that we have successfully received the following fee payment:

*Student Details*
Name       : ${student.name}
Class      : ${student.class}
Student ID : ${student.studentId}

*Payment Details*
Amount Paid : Rs. ${lastPayment.amount}
Payment Mode: ${lastPayment.mode}
Remark      : ${lastPayment.remark}

*Fee Summary*
Total Fees  : Rs. ${fee.totalFees}
Total Paid  : Rs. ${fee.paidAmount}
Pending     : Rs. ${fee.pendingAmount}

Thank you for your cooperation.
For any queries, please contact the school office.

Regards,
*FirstStep School*
    `.trim();

    const url = `https://wa.me/91${mobile}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // =========================
  // UI STATES
  // =========================
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!fee || !student) {
    return (
      <div className="p-6">
        <p className="text-red-600">Fees record not found</p>
        <button onClick={onBack} className="underline">
          Back
        </button>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Fees Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div>
          <div className="bg-white p-4 rounded shadow mb-4">
            <p>Total Fees: Rs. {fee.totalFees}</p>
            <p>Paid: Rs. {fee.paidAmount}</p>
            <p className="text-red-600 font-medium">
              Pending: Rs. {fee.pendingAmount}
            </p>
            <p>Status: <b>{fee.status}</b></p>
          </div>

          {/* ADD PAYMENT */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Add Payment</h2>

            <input
              type="number"
              placeholder="Amount"
              className="border p-2 w-full mb-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              className="border p-2 w-full mb-2"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Cheque</option>
            </select>

            <input
              placeholder="Remark"
              className="border p-2 w-full mb-3"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />

            {error && <p className="text-red-600 mb-2">{error}</p>}

            <button
              onClick={addPayment}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save Payment
            </button>

            {lastPayment && (
              <button
                onClick={sendWhatsApp}
                className="ml-3 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send WhatsApp
              </button>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Payment History</h2>

          {history.length === 0 ? (
            <p className="text-gray-500">No payments yet</p>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Mode</th>
                  <th className="border p-2">Remark</th>
                </tr>
              </thead>
              <tbody>
                {history.map((p) => (
                  <tr key={p._id}>
                    <td className="border p-2">
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                    <td className="border p-2 text-center">
                      Rs. {p.amount}
                    </td>
                    <td className="border p-2 text-center">
                      {p.mode}
                    </td>
                    <td className="border p-2">
                      {p.remark}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <button onClick={onBack} className="underline mt-6">
        Back
      </button>
    </div>
  );
}
