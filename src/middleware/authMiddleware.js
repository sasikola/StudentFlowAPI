const { verifyToken }              = require('../utils/jwtHelper');
const { sendError }                = require('../utils/apiResponse');

const protect = (req, res, next) => {
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

const superAdminOnly = (req, res, next) => {
  if (req.admin?.role !== 'superadmin') {
    sendError(res, 'Access denied. Super admin only.', 403);
    return;
  }
  next();
};

module.exports = { protect, superAdminOnly };