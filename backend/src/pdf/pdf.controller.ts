import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pdf')
export class PdfController {
  constructor(private readonly svc: PdfService) {}

  @UseGuards(JwtAuthGuard)
  @Get('invoice/:id')
  async invoicePdf(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.svc.generateInvoicePdfBuffer(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${id}.pdf"`);
    res.send(buffer);
  }
}
