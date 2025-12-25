import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientModel } from '../schemas/client.schema';

@Injectable()
export class ClientService {
  async list(userId: string) {
    return ClientModel.find({ userId }).lean().exec();
  }

  async get(userId: string, id: string) {
    const c = await ClientModel.findOne({ userId, _id: id }).exec();
    if (!c) throw new NotFoundException('Client not found');
    return c;
  }

  async create(userId: string, data: any) {
    return ClientModel.create({ userId, ...data });
  }

  async update(userId: string, id: string, data: any) {
    const c = await ClientModel.findOne({ userId, _id: id }).exec();
    if (!c) throw new NotFoundException('Client not found');
    Object.assign(c, data);
    await c.save();
    return c;
  }

  async remove(userId: string, id: string) {
    const c = await ClientModel.findOneAndDelete({ userId, _id: id }).exec();
    if (!c) throw new NotFoundException('Client not found');
    return c;
  }
}
