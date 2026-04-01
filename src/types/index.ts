import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ── Auth ────────────────────────────────────────────────────
export interface IAdmin extends Document {
  name:      string;
  email:     string;
  password:  string;
  role:      'admin' | 'superadmin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ── Service ─────────────────────────────────────────────────
export interface ISession {
  date:     Date;
  duration: number;
  topic:    string;
  notes?:   string;
}

export interface ICourseDetails {
  title:             string;
  mode:              'online' | 'offline';
  batch?:            string;
  totalSessions:     number;
  completedSessions: number;
}

export interface IService extends Document {
  studentId:      Types.ObjectId;
  type:           'online_course' | 'offline_course' | 'react_work_support' | 'interview_help';
  status:         'ongoing' | 'completed' | 'paused';
  startDate:      Date;
  endDate?:       Date;
  sessions?:      ISession[];
  courseDetails?: ICourseDetails;
  createdAt:      Date;
  updatedAt:      Date;
}

// ── Payment ─────────────────────────────────────────────────
export interface IPayment extends Document {
  studentId:     Types.ObjectId;
  amount:        number;
  paidAmount:    number;
  balanceAmount: number;
  paidDate?:     Date;
  dueDate?:      Date;
  mode:          'cash' | 'upi' | 'bank_transfer';
  status:        'paid' | 'pending' | 'partial';
  note?:         string;
  createdAt:     Date;
  updatedAt:     Date;
}

// ── Student ─────────────────────────────────────────────────
export interface IStudent extends Document {
  name:          string;
  phone:         string;
  email?:        string;
  profilePhoto?: string;
  enrolledDate:  Date;
  status:        'active' | 'completed' | 'dropped';
  services:      Types.ObjectId[] | IService[];
  payments:      Types.ObjectId[] | IPayment[];
  notes?:        string;
  createdAt:     Date;
  updatedAt:     Date;
}

// ── Extended Request ────────────────────────────────────────
export interface AuthRequest extends Request {
  admin?: {
    id:    string;
    email: string;
    role:  string;
  };
}