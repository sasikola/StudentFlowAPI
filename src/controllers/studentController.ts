import { Response } from 'express';
import Student from '../models/Student';
import Service from '../models/Service';
import Payment from '../models/Payment';
import { sendSuccess, sendError, sendPaginated } from '../utils/apiResponse';
import { AuthRequest } from '../types';

// @desc  Get all students
// @route GET /api/students
export const getStudents = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page    = parseInt(req.query.page    as string) || 1;
    const limit   = parseInt(req.query.limit   as string) || 20;
    const search  = req.query.search  as string;
    const status  = req.query.status  as string;
    const service = req.query.service as string;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    let students = await Student.find(query)
      .populate({
        path:  'services',
        model: 'Service',
        ...(service && service !== 'all' ? { match: { type: service } } : {}),
      })
      .populate('payments')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter by service type if provided
    if (service && service !== 'all') {
      students = students.filter(s =>
        (s.services as any[]).some((sv: any) => sv?.type === service)
      );
    }

    const totalCount = await Student.countDocuments(query);

    sendPaginated(res, students, totalCount, page, limit, 'Students fetched');
  } catch (error) {
    sendError(res, 'Failed to fetch students', 500);
  }
};

// @desc  Get single student
// @route GET /api/students/:id
export const getStudentById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('services')
      .populate('payments');

    if (!student) {
      sendError(res, 'Student not found', 404);
      return;
    }

    sendSuccess(res, student, 'Student fetched');
  } catch (error) {
    sendError(res, 'Failed to fetch student', 500);
  }
};

// @desc  Create student
// @route POST /api/students
export const createStudent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      phone,
      email,
      serviceType,
      feeAmount,
      paymentMode,
      startDate,
      notes,
    } = req.body;

    // Check duplicate phone
    const existing = await Student.findOne({ phone });
    if (existing) {
      sendError(res, 'A student with this phone number already exists', 400);
      return;
    }

    // Create student
    const student = await Student.create({
      name,
      phone,
      email,
      notes,
      enrolledDate: new Date(),
      status:       'active',
    });

    // Create service
    const serviceData: any = {
      studentId: student._id,
      type:      serviceType,
      status:    'ongoing',
      startDate: new Date(startDate),
    };

    if (serviceType === 'online_course' || serviceType === 'offline_course') {
      serviceData.courseDetails = {
        title:             `${serviceType === 'online_course' ? 'Online' : 'Offline'} Course`,
        mode:              serviceType === 'online_course' ? 'online' : 'offline',
        totalSessions:     0,
        completedSessions: 0,
      };
    }

    const service = await Service.create(serviceData);

    // Create payment
    const payment = await Payment.create({
      studentId:   student._id,
      amount:      feeAmount,
      paidAmount:  0,
      mode:        paymentMode,
      status:      'pending',
      dueDate:     new Date(startDate),
    });

    // Link service and payment to student
    student.services = [service._id] as any;
    student.payments = [payment._id] as any;
    await student.save();

    // Return populated student
    const populated = await Student.findById(student._id)
      .populate('services')
      .populate('payments');

    sendSuccess(res, populated, 'Student created successfully', 201);
  } catch (error) {
    sendError(res, 'Failed to create student', 500);
  }
};

// @desc  Update student
// @route PUT /api/students/:id
export const updateStudent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      phone,
      email,
      status,
      notes,
      serviceType,
      startDate,
      feeAmount,
      paymentMode,
    } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      sendError(res, 'Student not found', 404);
      return;
    }

    // Check duplicate phone (exclude current)
    if (phone && phone !== student.phone) {
      const existing = await Student.findOne({ phone });
      if (existing) {
        sendError(res, 'Phone number already in use', 400);
        return;
      }
    }

    // Update student fields
    if (name)   student.name   = name;
    if (phone)  student.phone  = phone;
    if (email)  student.email  = email;
    if (status) student.status = status;
    if (notes !== undefined) student.notes = notes;

    await student.save();

    // Update latest service if serviceType changed
    if (serviceType) {
      await Service.findOneAndUpdate(
        { studentId: student._id },
        { type: serviceType, ...(startDate && { startDate: new Date(startDate) }) },
        { sort: { createdAt: -1 } }
      );
    }

    // Update latest payment if fee changed
    if (feeAmount || paymentMode) {
      await Payment.findOneAndUpdate(
        { studentId: student._id },
        {
          ...(feeAmount    && { amount: feeAmount }),
          ...(paymentMode  && { mode: paymentMode }),
        },
        { sort: { createdAt: -1 } }
      );
    }

    const updated = await Student.findById(student._id)
      .populate('services')
      .populate('payments');

    sendSuccess(res, updated, 'Student updated successfully');
  } catch (error) {
    sendError(res, 'Failed to update student', 500);
  }
};

// @desc  Delete student
// @route DELETE /api/students/:id
export const deleteStudent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      sendError(res, 'Student not found', 404);
      return;
    }

    // Delete related services and payments
    await Service.deleteMany({ studentId: student._id });
    await Payment.deleteMany({ studentId: student._id });
    await Student.findByIdAndDelete(req.params.id);

    sendSuccess(res, null, 'Student deleted successfully');
  } catch (error) {
    sendError(res, 'Failed to delete student', 500);
  }
};