import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmailLogModel } from '../schemas/email-log.schema';

@Controller('email')
export class EmailController {
  @UseGuards(JwtAuthGuard)
  @Get('logs')
  async logs(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return EmailLogModel.find({ userId }).sort({ createdAt: -1 }).lean().exec();
  }
}
