import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import PendingFees from "./pages/PendingFees";
import Login from "./pages/Login";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [isAuth, setIsAuth] = useState(false);

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
    }
  }, []);

 
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setPage("dashboard");
  };


  if (!isAuth) {
    return <Login onLogin={() => setIsAuth(true)} />;
  }

 
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          FirstStep Admin Panel
        </h1>

        {/* NAV */}
        <div className="space-x-3">
          <button
            onClick={() => setPage("dashboard")}
            className={`px-4 py-1 rounded ${
              page === "dashboard"
                ? "bg-white text-indigo-600"
                : "bg-indigo-500"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setPage("students")}
            className={`px-4 py-1 rounded ${
              page === "students"
                ? "bg-white text-indigo-600"
                : "bg-indigo-500"
            }`}
          >
            Students
          </button>

          <button
            onClick={() => setPage("pendingFees")}
            className={`px-4 py-1 rounded ${
              page === "pendingFees"
                ? "bg-white text-indigo-600"
                : "bg-indigo-500"
            }`}
          >
            Pending Fees
          </button>

          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      {page === "dashboard" && <Dashboard />}
      {page === "students" && <Students />}
      {page === "pendingFees" && (
        <PendingFees onBack={() => setPage("dashboard")} />
      )}
    </div>
  );
}
