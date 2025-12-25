import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceModel } from '../schemas/invoice.schema';
import { CompanyModel } from '../schemas/company.schema';
import { ClientModel } from '../schemas/client.schema';

@Injectable()
export class InvoiceService {
  private generateInvoiceNumber() {
    return `INV-${Date.now()}`;
  }

  private calculateTotals(items: any[], tax = 0, discount = 0) {
    let subtotal = 0;
    const calculated = items.map((it, idx) => {
      const quantity = Number(it.quantity || 1);
      const price = Number(it.price || 0);
      const total = quantity * price;
      subtotal += total;
      return { no: idx + 1, description: it.description, quantity, price, total };
    });
    const total = subtotal + Number(tax || 0) - Number(discount || 0);
    return { items: calculated, subtotal, tax: Number(tax || 0), discount: Number(discount || 0), total };
  }

  async create(userId: string, data: any) {
    const company = await CompanyModel.findOne({ userId }).lean().exec();
    if (!company) throw new NotFoundException('Company profile required');
    const client = await ClientModel.findById(data.clientId).lean().exec();
    if (!client) throw new NotFoundException('Client not found');

    const invoiceNumber = this.generateInvoiceNumber();
    const { items, subtotal, tax, discount, total } = this.calculateTotals(data.items || [], data.tax, data.discount);

    const invoice = await InvoiceModel.create({
      userId,
      invoiceNumber,
      date: data.date || new Date(),
      dueDate: data.dueDate,
      company,
      client,
      items,
      subtotal,
      tax,
      discount,
      total,
      notes: data.notes
    });

    return invoice;
  }

  async list(userId: string) {
    return InvoiceModel.find({ userId }).lean().exec();
  }

  async get(userId: string, id: string) {
    const inv = await InvoiceModel.findOne({ userId, _id: id }).exec();
    if (!inv) throw new NotFoundException('Invoice not found');
    return inv;
  }

  async update(userId: string, id: string, data: any) {
    const inv = await InvoiceModel.findOne({ userId, _id: id }).exec();
    if (!inv) throw new NotFoundException('Invoice not found');
    if (data.items || data.tax || data.discount) {
      const { items, subtotal, tax, discount, total } = this.calculateTotals(data.items || inv.items, data.tax ?? inv.tax, data.discount ?? inv.discount);
      inv.items = items as any;
      inv.subtotal = subtotal;
      inv.tax = tax;
      inv.discount = discount;
      inv.total = total;
    }
    inv.notes = data.notes ?? inv.notes;
    if (data.status) inv.status = data.status;
    await inv.save();
    return inv;
  }

  async remove(userId: string, id: string) {
    const inv = await InvoiceModel.findOneAndDelete({ userId, _id: id }).exec();
    if (!inv) throw new NotFoundException('Invoice not found');
    return inv;
  }
}
