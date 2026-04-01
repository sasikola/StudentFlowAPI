import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtHelper';
import { sendError } from '../utils/apiResponse';
import { AuthRequest } from '../types';

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'No token provided', 401);
      return;
    }

    const token   = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.admin = {
      id:    decoded.id,
      email: decoded.email,
      role:  decoded.role,
    };

    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token', 401);
  }
};

export const superAdminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.admin?.role !== 'superadmin') {
    sendError(res, 'Access denied. Super admin only.', 403);
    return;
  }
  next();
};