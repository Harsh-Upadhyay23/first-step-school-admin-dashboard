const jwt = require("jsonwebtoken");

/**
 * @desc   Admin login (Single Fixed Admin)
 * @route  POST /api/auth/login
 */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

  
    const ADMIN_EMAIL = "admin@firststep.com";
    const ADMIN_PASSWORD = "firststep@1234";

    if (
      email !== ADMIN_EMAIL ||
      password !== ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

  
    const token = jwt.sign(
      {
        role: "admin",
        email: ADMIN_EMAIL
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // =========================
    // RESPONSE
    // =========================
    res.json({
      message: "Login successful",
      token,
      admin: {
        name: "FirstStep Admin",
        email: ADMIN_EMAIL
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error during login"
    });
  }
};
