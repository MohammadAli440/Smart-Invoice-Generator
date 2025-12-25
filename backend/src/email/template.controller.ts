import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EmailTemplateModel } from '../schemas/email-template.schema';

@Controller('templates')
export class TemplateController {
  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Request() req:any) {
    const userId = req.user?.userId || req.user?.sub;
    return EmailTemplateModel.find({ userId }).sort({ createdAt: -1 }).lean().exec();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req:any, @Body() body:any) {
    const userId = req.user?.userId || req.user?.sub;
    return EmailTemplateModel.create({ userId, name: body.name, body: body.body });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req:any, @Param('id') id:string){
    const userId = req.user?.userId || req.user?.sub;
    return EmailTemplateModel.findOneAndDelete({ _id: id, userId }).exec();
  }
}
