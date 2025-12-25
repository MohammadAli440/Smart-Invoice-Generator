import { Schema, model, Types } from 'mongoose';

export const ClientSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  businessName: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const ClientModel = model('Client', ClientSchema);
