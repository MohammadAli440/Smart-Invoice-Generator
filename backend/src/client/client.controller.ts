import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientDto } from './dto/client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('clients')
export class ClientController {
  constructor(private readonly svc: ClientService) {}

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
  @Post()
  async create(@Request() req: any, @Body() body: ClientDto) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.create(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() body: ClientDto) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.update(userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.remove(userId, id);
  }
}
