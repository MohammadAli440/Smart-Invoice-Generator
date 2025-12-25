import { Injectable, NotFoundException } from '@nestjs/common';
import { UserModel } from '../schemas/user.schema';

@Injectable()
export class UserService {
  async getById(id: string) {
    const u = await UserModel.findById(id).lean().exec();
    if (!u) throw new NotFoundException('User not found');
    // hide sensitive
    delete (u as any).passwordHash;
    delete (u as any).refreshTokenHash;
    return u;
  }

  async update(id: string, data: any) {
    const u = await UserModel.findById(id).exec();
    if (!u) throw new NotFoundException('User not found');
    if (data.name) u.name = data.name;
    if (data.email) u.email = data.email;
    await u.save();
    const result = u.toObject();
    delete (result as any).passwordHash;
    delete (result as any).refreshTokenHash;
    return result;
  }
}
