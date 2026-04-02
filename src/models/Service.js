const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    topic: { type: String, required: true },
    notes: { type: String },
  },
  { _id: true },
);

const CourseDetailsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    mode: { type: String, enum: ["online", "offline"], required: true },
    batch: { type: String },
    totalSessions: { type: Number, default: 0 },
    completedSessions: { type: Number, default: 0 },
  },
  { _id: false },
);

const ServiceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "online_course",
        "offline_course",
        "react_work_support",
        "interview_help",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed", "paused"],
      default: "ongoing",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    sessions: [SessionSchema],
    courseDetails: CourseDetailsSchema,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Service", ServiceSchema);
