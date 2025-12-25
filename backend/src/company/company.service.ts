import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyModel } from '../schemas/company.schema';

@Injectable()
export class CompanyService {
  async getByUser(userId: string) {
    return CompanyModel.findOne({ userId }).lean().exec();
  }

  async upsert(userId: string, data: any) {
    const existing = await CompanyModel.findOne({ userId }).exec();
    if (existing) {
      Object.assign(existing, data);
      await existing.save();
      return existing;
    }
    return CompanyModel.create({ userId, ...data });
  }

  async setLogo(userId: string, logo: { url: string; publicId: string }) {
    const existing = await CompanyModel.findOne({ userId }).exec();
    if (existing) {
      existing.logo = logo as any;
      await existing.save();
      return existing;
    }
    return CompanyModel.create({ userId, logo });
  }
}
