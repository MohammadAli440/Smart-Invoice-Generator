import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EmailLogModel } from '../schemas/email-log.schema';
import { PdfService } from '../pdf/pdf.service';
import { InvoiceModel } from '../schemas/invoice.schema';

@Injectable()
export class EmailService {
  private smtpHost = process.env.SMTP_HOST;
  private smtpPort = Number(process.env.SMTP_PORT || 587);
  private smtpUser = process.env.SMTP_USER;
  private smtpPass = process.env.SMTP_PASS;
  private appUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`;

  constructor(private readonly pdfSvc: PdfService) {}

  private transporter() {
    return nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpPort === 465,
      auth: this.smtpUser ? { user: this.smtpUser, pass: this.smtpPass } : undefined
    });
  }

  // opts.html is optional; if provided we'll rewrite links and append tracking pixel
  async sendInvoiceEmail(invoiceId: string, opts: { to: string; cc?: string[]; bcc?: string[]; subject?: string; text?: string; html?: string }) {
    // try to fetch invoice to attach userId
    const invoice = await InvoiceModel.findById(invoiceId).lean().exec();
    const userId = invoice?.userId;

    const log = await EmailLogModel.create({ invoiceId, userId, to: opts.to, cc: opts.cc, bcc: opts.bcc, subject: opts.subject, body: opts.text, attempts: 0 });

    const transporter = this.transporter();
    const buffer = await this.pdfSvc.generateInvoicePdfBuffer(invoiceId);

    // prepare html: rewrite links to go through redirect endpoint and append tracking pixel
    let html = opts.html || (opts.text ? `<p>${String(opts.text).replace(/\n/g, '<br/>')}</p>` : '<p>Please find the attached invoice.</p>');

    // rewrite links to include tracking redirect
    try {
      html = String(html).replace(/href=\"(https?:\/\/[^"]+)\"/gi, (m: string, url: string) => {
        const enc = encodeURIComponent(url);
        return `href=\"${this.appUrl}/api/email/redirect?logId=${log._id}&url=${enc}\"`;
      });
    } catch (err) {
      // ignore
    }

    // append tracking pixel
    html += `<img src=\"${this.appUrl}/api/email/open/${log._id}.png\" alt=\"\" width=\"1\" height=\"1\" style=\"display:none\"/>`;

    const mailOptions = {
      from: process.env.SMTP_FROM || (this.smtpUser ?? 'no-reply@example.com'),
      to: opts.to,
      cc: opts.cc,
      bcc: opts.bcc,
      subject: opts.subject || `Invoice from ${process.env.COMPANY_NAME || 'Your Company'}`,
      text: opts.text || 'Please find the attached invoice.',
      html,
      attachments: [{ filename: `invoice-${invoiceId}.pdf`, content: buffer }]
    } as any;

    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        attempts++;
        await transporter.sendMail(mailOptions);
        log.success = true;
        log.sentAt = new Date();
        log.attempts = attempts;
        await log.save();
        return { success: true };
      } catch (err: any) {
        log.attempts = attempts;
        log.error = String(err?.message || err);
        await log.save();
        if (attempts >= maxAttempts) throw err;
        // wait before retrying
        await new Promise((res) => setTimeout(res, 1000 * attempts));
      }
    }
    return { success: false };
  }
}
