import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: auto logout on 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // window.location.reload(); // optional
    }
    return Promise.reject(error);
  }
);

export default api;
