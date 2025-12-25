import { Schema, model, Types } from 'mongoose';

export const EmailTemplateSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User' },
  name: String,
  body: String,
  createdAt: { type: Date, default: Date.now }
});

export const EmailTemplateModel = model('EmailTemplate', EmailTemplateSchema);
