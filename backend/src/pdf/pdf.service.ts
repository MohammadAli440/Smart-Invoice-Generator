import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { InvoiceModel } from '../schemas/invoice.schema';

@Injectable()
export class PdfService {
  private invoiceToHtml(inv: any) {
    const itemsHtml = inv.items.map((it: any) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd">${it.no}</td>
        <td style="padding:8px;border:1px solid #ddd">${it.description}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">${it.quantity}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">${it.price.toFixed(2)}</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:right">${it.total.toFixed(2)}</td>
      </tr>`).join('\n');

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, Helvetica, sans-serif; color: #111 }
            .header { display:flex; justify-content:space-between; align-items:center }
            .table { width:100%; border-collapse: collapse; margin-top:16px }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h2>${inv.company.name}</h2>
              <div>${inv.company.address || ''}</div>
              <div>${inv.company.email || ''}</div>
            </div>
            <div style="text-align:right">
              <h3>Invoice</h3>
              <div><strong>#${inv.invoiceNumber}</strong></div>
              <div>${new Date(inv.date).toLocaleDateString()}</div>
            </div>
          </div>

          <div style="margin-top:16px">
            <strong>Bill To:</strong>
            <div>${inv.client.name} ${inv.client.businessName ? `(${inv.client.businessName})` : ''}</div>
            <div>${inv.client.email || ''}</div>
            <div>${inv.client.address || ''}</div>
          </div>

          <table class="table" style="border:1px solid #ddd">
            <thead>
              <tr>
                <th style="padding:8px;border:1px solid #ddd">#</th>
                <th style="padding:8px;border:1px solid #ddd">Description</th>
                <th style="padding:8px;border:1px solid #ddd">Qty</th>
                <th style="padding:8px;border:1px solid #ddd">Price</th>
                <th style="padding:8px;border:1px solid #ddd">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top:16px; text-align:right">
            <div>Subtotal: ${inv.subtotal.toFixed(2)}</div>
            <div>Tax: ${inv.tax.toFixed(2)}</div>
            <div>Discount: ${inv.discount.toFixed(2)}</div>
            <div style="font-weight:bold; font-size:1.2em">Total: ₹${inv.total.toFixed(2)}</div>
          </div>

          <div style="margin-top:40px">Thank you for your business.</div>
        </body>
      </html>
    `;
    return html;
  }

  async generateInvoicePdfBuffer(invoiceId: string) {
    const inv = await InvoiceModel.findById(invoiceId).lean().exec();
    if (!inv) throw new Error('Invoice not found');
    const html = this.invoiceToHtml(inv);
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '10mm', right: '10mm' } });
      return pdf;
    } finally {
      await browser.close();
    }
  }
}
