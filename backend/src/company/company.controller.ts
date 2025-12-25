import { Body, Controller, Get, Post, Request, UseGuards, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyService } from './company.service';
import { CompanyDto } from './dto/company.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL || '');

@Controller('company')
export class CompanyController {
  constructor(private readonly svc: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@Request() req: any) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.getByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async upsert(@Request() req: any, @Body() body: CompanyDto) {
    const userId = req.user?.userId || req.user?.sub;
    return this.svc.upsert(userId, body);
  }

  // Upload company logo (multipart/form-data with field 'file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('logo')
  async uploadLogo(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    const userId = req.user?.userId || req.user?.sub;
    if (!file) throw new Error('No file uploaded');

    // upload via stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: process.env.CLOUDINARY_FOLDER || 'smart-invoice' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      stream.end(file.buffer);
    });

    const logo = { url: uploadResult.secure_url, publicId: uploadResult.public_id };
    const company = await this.svc.upsert(userId, { logo });
    return { logo };
  }
}
