import api from "./axios";

// =========================
// DASHBOARD SUMMARY API
// =========================
export const getDashboardSummary = () => {
  return api.get("/dashboard/summary");
};
