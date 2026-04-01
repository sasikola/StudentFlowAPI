import { Response } from 'express';
import Payment from '../models/Payment';
import Student from '../models/Student';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest } from '../types';

// @desc  Get all payments
// @route GET /api/payments
export const getAllPayments = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page   = parseInt(req.query.page   as string) || 1;
    const limit  = parseInt(req.query.limit  as string) || 20;
    const status = req.query.status as string;
    const skip   = (page - 1) * limit;

    const query: any = {};
    if (status && status !== 'all') query.status = status;

    const payments = await Payment.find(query)
      .populate('studentId', 'name phone email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Payment.countDocuments(query);

    sendSuccess(res, { payments, totalCount }, 'Payments fetched');
  } catch (error) {
    sendError(res, 'Failed to fetch payments', 500);
  }
};

// @desc  Get payments by student
// @route GET /api/students/:studentId/payments
export const getPaymentsByStudent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const payments = await Payment.find({
      studentId: req.params.studentId,
    }).sort({ createdAt: -1 });

    sendSuccess(res, payments, 'Payments fetched');
  } catch (error) {
    sendError(res, 'Failed to fetch payments', 500);
  }
};

// @desc  Create payment
// @route POST /api/payments
export const createPayment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { studentId, amount, paidAmount, mode, dueDate, note } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      sendError(res, 'Student not found', 404);
      return;
    }

    const payment = await Payment.create({
      studentId,
      amount,
      paidAmount: paidAmount ?? 0,
      mode,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      note,
    });

    // Link to student
    (student.payments as any[]).push(payment._id);
    await student.save();

    sendSuccess(res, payment, 'Payment created', 201);
  } catch (error) {
    sendError(res, 'Failed to create payment', 500);
  }
};

// @desc  Update payment
// @route PUT /api/payments/:id
export const updatePayment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { paidAmount, mode, dueDate, note } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      sendError(res, 'Payment not found', 404);
      return;
    }

    if (paidAmount !== undefined) payment.paidAmount = paidAmount;
    if (mode)                     payment.mode       = mode;
    if (dueDate)                  payment.dueDate    = new Date(dueDate);
    if (note !== undefined)       payment.note       = note;

    await payment.save();
    sendSuccess(res, payment, 'Payment updated');
  } catch (error) {
    sendError(res, 'Failed to update payment', 500);
  }
};

// @desc  Get payment summary
// @route GET /api/payments/summary
export const getPaymentSummary = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const summary = await Payment.aggregate([
      {
        $group: {
          _id:           '$status',
          totalAmount:   { $sum: '$amount' },
          totalPaid:     { $sum: '$paidAmount' },
          totalBalance:  { $sum: '$balanceAmount' },
          count:         { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]);

    sendSuccess(res, {
      summary,
      totalRevenue: totalRevenue[0]?.total ?? 0,
    }, 'Payment summary fetched');
  } catch (error) {
    sendError(res, 'Failed to fetch payment summary', 500);
  }
};