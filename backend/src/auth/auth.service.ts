import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  private accessSecret = process.env.JWT_ACCESS_SECRET || 'access-secret';
  private refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

  async register(email: string, password: string, name?: string) {
    const existing = await UserModel.findOne({ email }).exec();
    if (existing) throw new Error('User already exists');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ email, passwordHash, name });
    const tokens = await this.generateTokens(String(user._id), email);
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    user.refreshTokenHash = refreshHash;
    await user.save();
    return { user, tokens };
  }

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email }).exec();
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.generateTokens(String(user._id), email);
    const refreshHash = await bcrypt.hash(tokens.refreshToken, 10);
    user.refreshTokenHash = refreshHash;
    await user.save();
    return { user, tokens };
  }

  async generateTokens(userId: string, email: string) {
    const accessToken = jwt.sign({ sub: userId, email }, this.accessSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: userId, email }, this.refreshSecret, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload: any = jwt.verify(refreshToken, this.refreshSecret);
      const user = await UserModel.findById(payload.sub).exec();
      if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Invalid token');
      const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
      if (!ok) throw new UnauthorizedException('Invalid token');
      const tokens = await this.generateTokens(String(user._id), user.email);
      user.refreshTokenHash = await bcrypt.hash(tokens.refreshToken, 10);
      await user.save();
      return { tokens };
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(userId: string) {
    const user = await UserModel.findById(userId).exec();
    if (!user) return;
    user.refreshTokenHash = undefined as any;
    await user.save();
  }
}
