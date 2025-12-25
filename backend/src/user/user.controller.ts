import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly svc: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async me(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.getById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req: any, @Body() body: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.update(userId, body);
  }
}
