import { useEffect, useState } from "react";
import { getDashboardSummary } from "../api/dashboardApi";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardSummary()
      .then((res) => {
        setData(res.data);
        setError("");
      })
      .catch((err) => {
        setError(
          err?.response?.data?.message ||
            "Failed to load dashboard data"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-lg font-medium">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">
        Dashboard
      </h1>

      {/* STUDENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card title="Total Students" value={data.students.total} />
        <Card title="Playgroup" value={data.students.playgroup} />
        <Card title="Nursery" value={data.students.nursery} />
        <Card title="Junior KG" value={data.students.juniorKg} />
        <Card title="Senior KG" value={data.students.seniorKg} />
      </div>

      {/* FEES CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          title="Fees Collected"
          value={`₹ ${data.fees.collected}`}
        />
        <Card
          title="Fees Pending"
          value={`₹ ${data.fees.pending}`}
        />
      </div>
    </div>
  );
}

// =========================
// REUSABLE CARD
// =========================
function Card({ title, value }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
