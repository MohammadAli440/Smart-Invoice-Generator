import { Schema, model, Types } from 'mongoose';

const ItemSchema = new Schema({
  no: Number,
  description: String,
  quantity: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
});

export const InvoiceSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  dueDate: Date,
  company: { type: Schema.Types.Mixed, required: true }, // snapshot
  client: { type: Schema.Types.Mixed, required: true }, // snapshot
  items: { type: [ItemSchema], default: [] },
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Sent', 'Paid'], default: 'Draft' },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

export const InvoiceModel = model('Invoice', InvoiceSchema);
