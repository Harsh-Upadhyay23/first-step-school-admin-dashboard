const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// =====================
// LOAD ENV
// =====================
dotenv.config();

// =====================
// CONNECT DATABASE
// =====================
connectDB();

// =====================
// INIT APP
// =====================
const app = express();

// =====================
// MIDDLEWARE
// =====================

// CORS (Frontend only)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Body parser
app.use(express.json());

// =====================
// ROUTES
// =====================

// Auth (login)
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Protected feature routes
const studentRoutes = require("./routes/studentRoutes");
const feeRoutes = require("./routes/feeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/students", studentRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/dashboard", dashboardRoutes);

// =====================
// TEST ROUTE
// =====================
app.get("/", (req, res) => {
  res.send("FirstStep Backend Running");
});

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
