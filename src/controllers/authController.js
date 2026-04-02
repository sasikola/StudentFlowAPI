const Admin = require("../models/Admin");
const { generateToken } = require("../utils/jwtHelper");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc  Login admin
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });

    sendSuccess(
      res,
      {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      "Login successful",
    );
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Login failed", 500);
  }
};

// @desc  Get admin profile
// @route GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin?.id);
    if (!admin) {
      sendError(res, "Admin not found", 404);
      return;
    }
    sendSuccess(res, admin, "Profile fetched");
  } catch (error) {
    sendError(res, "Failed to fetch profile", 500);
  }
};

// @desc  Register admin
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      sendError(res, "Email already registered", 400);
      return;
    }

    const admin = await Admin.create({ name, email, password, role });

    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });

    sendSuccess(
      res,
      {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      "Admin registered",
      201,
    );
  } catch (error) {
    console.error("Register error:", error);
    sendError(res, "Registration failed", 500);
  }
};

// @desc  Logout
// @route POST /api/auth/logout
const logout = (req, res) => {
  sendSuccess(res, null, "Logged out successfully");
};

module.exports = { login, register, getProfile, logout };
