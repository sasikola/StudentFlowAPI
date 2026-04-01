import { Response } from 'express';
import Service from '../models/Service';
import Student from '../models/Student';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthRequest } from '../types';

// @desc  Get services by student
// @route GET /api/students/:studentId/services
export const getServicesByStudent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const services = await Service.find({ studentId: req.params.studentId })
      .sort({ createdAt: -1 });
    sendSuccess(res, services, 'Services fetched');
  } catch (error) {
    sendError(res, 'Failed to fetch services', 500);
  }
};

// @desc  Get single service
// @route GET /api/services/:id
export const getServiceById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const service = await Service.findById(req.params.id).populate('studentId');
    if (!service) {
      sendError(res, 'Service not found', 404);
      return;
    }
    sendSuccess(res, service, 'Service fetched');
  } catch (error) {
    sendError(res, 'Failed to fetch service', 500);
  }
};

// @desc  Create service
// @route POST /api/services
export const createService = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { studentId, type, startDate, courseDetails } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      sendError(res, 'Student not found', 404);
      return;
    }

    const service = await Service.create({
      studentId,
      type,
      status:    'ongoing',
      startDate: new Date(startDate),
      courseDetails,
    });

    // Link to student
    (student.services as any[]).push(service._id);
    await student.save();

    sendSuccess(res, service, 'Service created', 201);
  } catch (error) {
    sendError(res, 'Failed to create service', 500);
  }
};

// @desc  Update service
// @route PUT /api/services/:id
export const updateService = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status, endDate, courseDetails, sessions } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      sendError(res, 'Service not found', 404);
      return;
    }

    if (status)        service.status  = status;
    if (endDate)       service.endDate = new Date(endDate);
    if (courseDetails) service.courseDetails = courseDetails;
    if (sessions)      service.sessions = sessions;

    // Auto set endDate when completed
    if (status === 'completed' && !service.endDate) {
      service.endDate = new Date();
    }

    await service.save();
    sendSuccess(res, service, 'Service updated');
  } catch (error) {
    sendError(res, 'Failed to update service', 500);
  }
};

// @desc  Add session to service
// @route POST /api/services/:id/sessions
export const addSession = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { date, duration, topic, notes } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      sendError(res, 'Service not found', 404);
      return;
    }

    service.sessions = service.sessions ?? [];
    service.sessions.push({ date: new Date(date), duration, topic, notes });

    // Increment completed sessions for courses
    if (service.courseDetails) {
      service.courseDetails.completedSessions += 1;
    }

    await service.save();
    sendSuccess(res, service, 'Session added');
  } catch (error) {
    sendError(res, 'Failed to add session', 500);
  }
};