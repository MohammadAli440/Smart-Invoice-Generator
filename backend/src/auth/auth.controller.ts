import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { user, tokens } = await this.authService.register(body.email, body.password, body.name);
    return { user: { id: user._id, email: user.email, name: user.name }, tokens };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { user, tokens } = await this.authService.login(body.email, body.password);
    return { user: { id: user._id, email: user.email, name: user.name }, tokens };
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  async logout(@Body('userId') userId: string) {
    await this.authService.logout(userId);
    return { success: true };
  }
}
