const jwt = require("jsonwebtoken");

/**
 * @desc   Protect routes (Admin only)
 * @usage  Middleware for JWT protected routes
 */
exports.protect = (req, res, next) => {
  let token;

  // =========================
  // CHECK AUTH HEADER
  // =========================
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // =========================
  // TOKEN NOT FOUND
  // =========================
  if (!token) {
    return res.status(401).json({
      message: "Not authorized, token missing"
    });
  }

  try {
    // =========================
    // VERIFY TOKEN
    // =========================
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // =========================
    // ATTACH ADMIN INFO
    // =========================
    req.admin = decoded; // { role: "admin" }

    next(); // ✅ allow request
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, invalid token"
    });
  }
};
