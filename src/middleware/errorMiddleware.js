const { sendError } = require('../utils/apiResponse');

const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message    = err.message || 'Internal server error';

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message     = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    statusCode  = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message    = Object.values(err.errors).map(e => e.message).join(', ');
    statusCode = 400;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    message    = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  sendError(res, message, statusCode);
};

module.exports = { notFound, globalErrorHandler };