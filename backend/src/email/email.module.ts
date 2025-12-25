import { Module } from '@nestjs/common';
import { PdfModule } from '../pdf/pdf.module';
import { EmailService } from './email.service';
import { TrackingController } from './tracking.controller';
import { EmailController } from './email.controller';
import { TemplateController } from './template.controller';

@Module({
  imports: [PdfModule],
  controllers: [TrackingController, EmailController, TemplateController],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
