import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
    message    = Object.values(err.errors).map((e: any) => e.message).join(', ');
    statusCode = 400;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    message    = `Invalid ${err.path}: ${err.value}`;
    statusCode = 400;
  }

  sendError(res, message, statusCode);
};