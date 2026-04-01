import { Request, Response } from 'express';
import Admin from '../models/Admin';
import { generateToken } from '../utils/jwtHelper';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest } from '../types';

// @desc  Login admin
// @route POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find admin with password
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    // Generate token
    const token = generateToken({
      id:    admin._id.toString(),
      email: admin.email,
      role:  admin.role,
    });

    sendSuccess(res, {
      token,
      admin: {
        id:    admin._id,
        name:  admin.name,
        email: admin.email,
        role:  admin.role,
      },
    }, 'Login successful');
  } catch (error) {
    sendError(res, 'Login failed', 500);
  }
};

// @desc  Get admin profile
// @route GET /api/auth/profile
export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const admin = await Admin.findById(req.admin?.id);
    if (!admin) {
      sendError(res, 'Admin not found', 404);
      return;
    }
    sendSuccess(res, admin, 'Profile fetched');
  } catch (error) {
    sendError(res, 'Failed to fetch profile', 500);
  }
};

// @desc  Register admin (superadmin only / first time setup)
// @route POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      sendError(res, 'Email already registered', 400);
      return;
    }

    const admin = await Admin.create({ name, email, password, role });

    const token = generateToken({
      id:    admin._id.toString(),
      email: admin.email,
      role:  admin.role,
    });

    sendSuccess(res, {
      token,
      admin: {
        id:    admin._id,
        name:  admin.name,
        email: admin.email,
        role:  admin.role,
      },
    }, 'Admin registered', 201);
  } catch (error) {
    sendError(res, 'Registration failed', 500);
  }
};

// @desc  Logout (client-side token removal, just confirmation)
// @route POST /api/auth/logout
export const logout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  sendSuccess(res, null, 'Logged out successfully');
};