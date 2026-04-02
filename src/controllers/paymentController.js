const Payment = require("../models/Payment");
const Student = require("../models/Student");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    const query = {};
    if (status && status !== "all") query.status = status;

    const payments = await Payment.find(query)
      .populate("studentId", "name phone email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Payment.countDocuments(query);

    sendSuccess(res, { payments, totalCount }, "Payments fetched");
  } catch (error) {
    sendError(res, "Failed to fetch payments", 500);
  }
};

const getPaymentsByStudent = async (req, res) => {
  try {
    const payments = await Payment.find({
      studentId: req.params.studentId,
    }).sort({ createdAt: -1 });
    sendSuccess(res, payments, "Payments fetched");
  } catch (error) {
    sendError(res, "Failed to fetch payments", 500);
  }
};

const createPayment = async (req, res) => {
  try {
    const { studentId, amount, paidAmount, mode, dueDate, note } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      sendError(res, "Student not found", 404);
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

    student.payments.push(payment._id);
    await student.save();

    sendSuccess(res, payment, "Payment created", 201);
  } catch (error) {
    sendError(res, "Failed to create payment", 500);
  }
};

const updatePayment = async (req, res) => {
  try {
    const { paidAmount, mode, dueDate, note } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      sendError(res, "Payment not found", 404);
      return;
    }

    if (paidAmount !== undefined) payment.paidAmount = paidAmount;
    if (mode) payment.mode = mode;
    if (dueDate) payment.dueDate = new Date(dueDate);
    if (note !== undefined) payment.note = note;

    await payment.save();
    sendSuccess(res, payment, "Payment updated");
  } catch (error) {
    sendError(res, "Failed to update payment", 500);
  }
};

const getPaymentSummary = async (req, res) => {
  try {
    const summary = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          totalPaid: { $sum: "$paidAmount" },
          totalBalance: { $sum: "$balanceAmount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$paidAmount" } } },
    ]);

    sendSuccess(
      res,
      {
        summary,
        totalRevenue: totalRevenue[0]?.total ?? 0,
      },
      "Payment summary fetched",
    );
  } catch (error) {
    sendError(res, "Failed to fetch payment summary", 500);
  }
};

module.exports = {
  getAllPayments,
  getPaymentsByStudent,
  createPayment,
  updatePayment,
  getPaymentSummary,
};
