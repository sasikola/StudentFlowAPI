import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IAdmin } from '../types';

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: 6,
      select:    false,
    },
    role: {
      type:    String,
      enum:    ['admin', 'superadmin'],
      default: 'admin',
    },
  },
  { timestamps: true }
);

// Hash password before saving — Mongoose v9 style (no next)
AdminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt    = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IAdmin>('Admin', AdminSchema);