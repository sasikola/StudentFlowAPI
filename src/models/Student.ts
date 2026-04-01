import mongoose, { Schema } from 'mongoose';
import { IStudent } from '../types';

const StudentSchema = new Schema<IStudent>(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    phone: {
      type:     String,
      required: [true, 'Phone is required'],
      unique:   true,
      trim:     true,
    },
    email: {
      type:      String,
      lowercase: true,
      trim:      true,
    },
    profilePhoto: { type: String },
    enrolledDate: {
      type:    Date,
      default: Date.now,
    },
    status: {
      type:    String,
      enum:    ['active', 'completed', 'dropped'],
      default: 'active',
    },
    services: [{
      type: Schema.Types.ObjectId,
      ref:  'Service',
    }],
    payments: [{
      type: Schema.Types.ObjectId,
      ref:  'Payment',
    }],
    notes: { type: String },
  },
  { timestamps: true }
);

// Index for search
StudentSchema.index({ name: 'text', phone: 'text', email: 'text' });

export default mongoose.model<IStudent>('Student', StudentSchema);