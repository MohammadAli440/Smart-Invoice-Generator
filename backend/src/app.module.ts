import { Module } from '@nestjs/common';
import { AppController, AppService } from './app.index';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { ClientModule } from './client/client.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PdfModule } from './pdf/pdf.module';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { ScheduledModule } from './scheduled/scheduled.module';

@Module({
  imports: [AuthModule, CompanyModule, ClientModule, InvoiceModule, PdfModule, EmailModule, UserModule, ScheduledModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
