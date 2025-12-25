import { Schema, model } from 'mongoose';

export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  refreshTokenHash: { type: String },
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

export const UserModel = model('User', UserSchema);
