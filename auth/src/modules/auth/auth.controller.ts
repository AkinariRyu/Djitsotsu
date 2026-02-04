import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body('identifier') identifier: string) {
    return this.authService.sendOtp(identifier);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('identifier') identifier: string,
    @Body('code') code: string,
    @Req() req: any, 
  ) {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || '127.0.0.1';

    return this.authService.verifyOtpAndLogin(identifier, code, userAgent, ip);
  }
}