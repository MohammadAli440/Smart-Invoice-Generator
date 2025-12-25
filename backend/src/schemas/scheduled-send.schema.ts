import { Schema, model, Types } from 'mongoose';

export const ScheduledSendSchema = new Schema({
  invoiceId: { type: Types.ObjectId, ref: 'Invoice', required: true },
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  to: String,
  cc: [String],
  bcc: [String],
  subject: String,
  message: String,
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ['scheduled', 'pending', 'sent', 'failed', 'canceled'], default: 'scheduled' },
  attempts: { type: Number, default: 0 },
  lastError: String,
  createdAt: { type: Date, default: Date.now }
});

export const ScheduledSendModel = model('ScheduledSend', ScheduledSendSchema);
