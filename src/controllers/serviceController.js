const Service = require("../models/Service");
const Student = require("../models/Student");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const getServicesByStudent = async (req, res) => {
  try {
    const services = await Service.find({
      studentId: req.params.studentId,
    }).sort({ createdAt: -1 });
    sendSuccess(res, services, "Services fetched");
  } catch (error) {
    sendError(res, "Failed to fetch services", 500);
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("studentId");
    if (!service) {
      sendError(res, "Service not found", 404);
      return;
    }
    sendSuccess(res, service, "Service fetched");
  } catch (error) {
    sendError(res, "Failed to fetch service", 500);
  }
};

const createService = async (req, res) => {
  try {
    const { studentId, type, startDate, courseDetails } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      sendError(res, "Student not found", 404);
      return;
    }

    const service = await Service.create({
      studentId,
      type,
      status: "ongoing",
      startDate: new Date(startDate),
      courseDetails,
    });

    student.services.push(service._id);
    await student.save();

    sendSuccess(res, service, "Service created", 201);
  } catch (error) {
    sendError(res, "Failed to create service", 500);
  }
};

const updateService = async (req, res) => {
  try {
    const { status, endDate, courseDetails, sessions } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      sendError(res, "Service not found", 404);
      return;
    }

    if (status) service.status = status;
    if (endDate) service.endDate = new Date(endDate);
    if (courseDetails) service.courseDetails = courseDetails;
    if (sessions) service.sessions = sessions;

    if (status === "completed" && !service.endDate) {
      service.endDate = new Date();
    }

    await service.save();
    sendSuccess(res, service, "Service updated");
  } catch (error) {
    sendError(res, "Failed to update service", 500);
  }
};

const addSession = async (req, res) => {
  try {
    const { date, duration, topic, notes } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      sendError(res, "Service not found", 404);
      return;
    }

    if (!service.sessions) service.sessions = [];
    service.sessions.push({ date: new Date(date), duration, topic, notes });

    if (service.courseDetails) {
      service.courseDetails.completedSessions += 1;
    }

    await service.save();
    sendSuccess(res, service, "Session added");
  } catch (error) {
    sendError(res, "Failed to add session", 500);
  }
};

module.exports = {
  getServicesByStudent,
  getServiceById,
  createService,
  updateService,
  addSession,
};
