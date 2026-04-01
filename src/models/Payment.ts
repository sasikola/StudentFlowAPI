import mongoose, { Schema } from 'mongoose';
import { IPayment } from '../types';

const PaymentSchema = new Schema<IPayment>(
  {
    studentId: {
      type:     Schema.Types.ObjectId,
      ref:      'Student',
      required: true,
    },
    amount: {
      type:     Number,
      required: true,
      min:      0,
    },
    paidAmount: {
      type:    Number,
      default: 0,
      min:     0,
    },
    balanceAmount: {
      type:    Number,
      default: 0,
      min:     0,
    },
    paidDate: { type: Date },
    dueDate:  { type: Date },
    mode: {
      type:    String,
      enum:    ['cash', 'upi', 'bank_transfer'],
      default: 'cash',
    },
    status: {
      type:    String,
      enum:    ['paid', 'pending', 'partial'],
      default: 'pending',
    },
    note: { type: String },
  },
  { timestamps: true }
);

// Auto-calculate balance and status — Mongoose v9 style (no next)
PaymentSchema.pre('save', function () {
  this.balanceAmount = this.amount - this.paidAmount;

  if (this.paidAmount <= 0) {
    this.status = 'pending';
  } else if (this.paidAmount >= this.amount) {
    this.status        = 'paid';
    this.balanceAmount = 0;
    if (!this.paidDate) {
      this.paidDate = new Date();
    }
  } else {
    this.status = 'partial';
  }
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);