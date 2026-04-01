import mongoose, { Schema } from 'mongoose';
import { IService } from '../types';

const SessionSchema = new Schema({
  date:     { type: Date,   required: true },
  duration: { type: Number, required: true },
  topic:    { type: String, required: true },
  notes:    { type: String },
}, { _id: true });

const CourseDetailsSchema = new Schema({
  title:             { type: String, required: true },
  mode:              { type: String, enum: ['online', 'offline'], required: true },
  batch:             { type: String },
  totalSessions:     { type: Number, required: true, default: 0 },
  completedSessions: { type: Number, required: true, default: 0 },
}, { _id: false });

const ServiceSchema = new Schema<IService>(
  {
    studentId: {
      type:     Schema.Types.ObjectId,
      ref:      'Student',
      required: true,
    },
    type: {
      type:     String,
      enum:     ['online_course', 'offline_course', 'react_work_support', 'interview_help'],
      required: true,
    },
    status: {
      type:    String,
      enum:    ['ongoing', 'completed', 'paused'],
      default: 'ongoing',
    },
    startDate:     { type: Date, required: true },
    endDate:       { type: Date },
    sessions:      [SessionSchema],
    courseDetails: CourseDetailsSchema,
  },
  { timestamps: true }
);

export default mongoose.model<IService>('Service', ServiceSchema);