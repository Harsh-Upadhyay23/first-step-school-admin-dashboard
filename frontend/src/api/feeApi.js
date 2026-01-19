import axios from "axios";

const BASE = "http://localhost:5000/api/fees";

export const initFees = (data) =>
  axios.post(`${BASE}/init`, data);

export const getFeesByStudent = (studentId) =>
  axios.get(`${BASE}/${studentId}`);

export const addPayment = (studentId, data) =>
  axios.post(`${BASE}/pay/${studentId}`, data);
