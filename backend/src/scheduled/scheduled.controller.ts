import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScheduledService } from './scheduled.service';

@Controller('scheduled')
export class ScheduledController {
  constructor(private readonly svc: ScheduledService) {}

  @UseGuards(JwtAuthGuard)
  @Post('invoice/:id')
  async schedule(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.schedule(userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.listForUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async cancel(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.cancel(userId, id);
  }
}
