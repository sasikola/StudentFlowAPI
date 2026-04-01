import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any,
  message = 'Success',
  statusCode = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: any
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

export const sendPaginated = (
  res: Response,
  data: any[],
  totalCount: number,
  currentPage: number,
  limit: number,
  message = 'Success'
): Response => {
  return res.status(200).json({
    success:     true,
    message,
    data,
    pagination: {
      totalCount,
      currentPage,
      totalPages: Math.ceil(totalCount / limit),
      limit,
      hasNextPage: currentPage < Math.ceil(totalCount / limit),
      hasPrevPage: currentPage > 1,
    },
  });
};