import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly svc: InvoiceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() body: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.create(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.list(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.get(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/email-logs')
  async emailLogs(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.userId || req.user?.sub;
    // rudimentary owner check
    const inv = await this.svc.get(userId, id);
    const { EmailLogModel } = await import('../schemas/email-log.schema');
    return EmailLogModel.find({ invoiceId: id }).sort({ createdAt: -1 }).lean().exec();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.update(userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.remove(userId, id);
  }

  // Send invoice via email (generates PDF and emails to `to`)
  @UseGuards(JwtAuthGuard)
  @Post(':id/send')
  async sendInvoice(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    const userId = req.user?.userId || req.user?.sub;
    // Basic verification that invoice exists and belongs to user
    const invoice = await this.svc.get(userId, id);
    // Lazy import to avoid circular dependency
    const { EmailService } = await import('../email/email.service');
    const { PdfService } = await import('../pdf/pdf.service');
    // Note: In Nest you'd inject EmailService; for this simple implementation, instantiate services
    const pdfSvc = new PdfService();
    const emailSvc = new (EmailService as any)(pdfSvc);
    const to = body.to || invoice.client.email;
    const cc = body.cc || [];
    const bcc = body.bcc || [];
    const subject = body.subject || `Invoice from ${invoice.company.name}`;
    await emailSvc.sendInvoiceEmail(id, { to, cc, bcc, subject, text: body.message });
    invoice.status = 'Sent';
    await (invoice as any).save();
    return { success: true };
  }
}
