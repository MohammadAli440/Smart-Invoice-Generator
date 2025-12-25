import { Schema, model, Types } from 'mongoose';

export const EmailLogSchema = new Schema({
  invoiceId: { type: Types.ObjectId, ref: 'Invoice' },
  userId: { type: Types.ObjectId, ref: 'User' },
  to: String,
  cc: [String],
  bcc: [String],
  subject: String,
  body: String,
  success: { type: Boolean, default: false },
  error: String,
  sentAt: Date,
  attempts: { type: Number, default: 0 },

  // Tracking fields
  openCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  firstOpenedAt: Date,
  lastOpenedAt: Date,
  // store simple link tracking info (id -> url, clicks)
  links: [
    {
      id: String,
      url: String,
      clicks: { type: Number, default: 0 }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

export const EmailLogModel = model('EmailLog', EmailLogSchema);
