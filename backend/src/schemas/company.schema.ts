import { Schema, model, Types } from 'mongoose';

const CompanyLogoSchema = new Schema({ url: String, publicId: String });

export const CompanySchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  website: { type: String },
  address: { type: String },
  logo: { type: CompanyLogoSchema },
  createdAt: { type: Date, default: Date.now }
});

export const CompanyModel = model('Company', CompanySchema);
