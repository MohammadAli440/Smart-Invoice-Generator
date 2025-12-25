import { Injectable } from '@nestjs/common';
import { ScheduledSendModel } from '../schemas/scheduled-send.schema';
import { Types } from 'mongoose';

@Injectable()
export class ScheduledService {
  async schedule(userId: string, invoiceId: string, data: any) {
    const doc = await ScheduledSendModel.create({
      userId: new Types.ObjectId(userId),
      invoiceId: new Types.ObjectId(invoiceId),
      to: data.to,
      cc: data.cc || [],
      bcc: data.bcc || [],
      subject: data.subject,
      message: data.message,
      scheduledAt: new Date(data.scheduledAt),
      status: 'scheduled'
    });
    return doc;
  }

  async listForUser(userId: string) {
    return ScheduledSendModel.find({ userId }).sort({ scheduledAt: 1 }).lean();
  }

  async cancel(userId: string, id: string) {
    const doc = await ScheduledSendModel.findOne({ _id: id, userId });
    if (!doc) throw new Error('Not found');
    doc.status = 'canceled';
    await doc.save();
    return doc;
  }

  // Run due scheduled sends (to be called by a worker)
  async runDue() {
    const now = new Date();
    const due = await ScheduledSendModel.find({ status: 'scheduled', scheduledAt: { $lte: now } }).limit(50);
    for (const job of due) {
      try {
        job.status = 'pending';
        await job.save();
        // Lazy import to avoid circular deps
        const { PdfService } = await import('../pdf/pdf.service');
        const { EmailService } = await import('../email/email.service');
        const pdfSvc = new PdfService();
        const emailSvc = new (EmailService as any)(pdfSvc);
        await emailSvc.sendInvoiceEmail(String(job.invoiceId), { to: job.to, cc: job.cc, bcc: job.bcc, subject: job.subject, text: job.message });
        job.status = 'sent';
        job.attempts = (job.attempts || 0) + 1;
        await job.save();
      } catch (err: any) {
        job.attempts = (job.attempts || 0) + 1;
        job.lastError = String(err?.message || err);
        job.status = job.attempts >= 3 ? 'failed' : 'scheduled';
        await job.save();
      }
    }
    return { processed: due.length };
  }
}
