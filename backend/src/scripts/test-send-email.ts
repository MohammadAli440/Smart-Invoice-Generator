import 'dotenv/config';
import mongoose from 'mongoose';
const nodemailer = require('nodemailer');
import { PdfService } from '../pdf/pdf.service';
import { EmailLogModel } from '../schemas/email-log.schema';
import { InvoiceModel } from '../schemas/invoice.schema';

async function main() {
  const mongo = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-invoice';
  await mongoose.connect(mongo);
  console.log('Connected to MongoDB');

  const invoiceId = process.env.INVOICE_ID || process.argv[2];
  let invoice: any;
  if (!invoiceId) {
    invoice = await InvoiceModel.findOne({}).sort({ createdAt: -1 }).lean().exec();
    if (!invoice) {
      console.error('No invoice found. Create an invoice first.');
      process.exit(1);
    }
  } else {
    invoice = await InvoiceModel.findById(invoiceId).lean().exec();
    if (!invoice) {
      console.error('Invoice not found for id', invoiceId);
      process.exit(1);
    }
  }

  console.log('Using invoice', invoice._id);

  // Generate PDF buffer using PdfService
  const pdfSvc = new PdfService();
  let pdfBuffer: Buffer | null = null;
  try {
    pdfBuffer = await pdfSvc.generateInvoicePdfBuffer(invoice._id);
    console.log('PDF buffer generated (size:', pdfBuffer.length, 'bytes)');
  } catch (err: any) {
    console.warn('PDF generation failed:', err?.message || err);
  }

  // Create test SMTP account (Ethereal)
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass }
  });

  const to = process.env.TEST_TO || invoice.client?.email || 'recipient@example.com';

  const mailOptions: any = {
    from: 'no-reply@smart-invoice.test',
    to,
    subject: `Test Invoice ${invoice.invoiceNumber}`,
    text: `Hello ${invoice.client?.name || ''},\n\nThis is a test email with invoice ${invoice.invoiceNumber} attached.`,
    attachments: []
  };

  if (pdfBuffer) {
    mailOptions.attachments.push({ filename: `invoice-${invoice.invoiceNumber}.pdf`, content: pdfBuffer });
  } else {
    mailOptions.attachments.push({ filename: `invoice-${invoice.invoiceNumber}.txt`, content: `Invoice ${invoice.invoiceNumber} - PDF generation failed, sending text fallback.` });
  }

  // send
  const log = await EmailLogModel.create({ invoiceId: invoice._id, userId: invoice.userId, to, subject: mailOptions.subject, body: mailOptions.text, attempts: 0 });
  try {
    const info = await transporter.sendMail(mailOptions);
    log.success = true;
    log.sentAt = new Date();
    log.attempts = 1;
    await log.save();
    console.log('Message sent. Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (err: any) {
    log.success = false;
    log.error = String(err?.message || err);
    log.attempts = (log.attempts || 0) + 1;
    await log.save();
    console.error('Send failed:', err?.message || err);
    process.exit(1);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});