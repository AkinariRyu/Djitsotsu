import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

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

  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Req() req: any
  ) {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || '127.0.0.1';
    return this.authService.refreshTokens(refreshToken, userAgent, ip);
  }

  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    await this.authService.logout(refreshToken);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return { message: 'This is protected data', user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || '127.0.0.1';

    const tokens = await this.authService.validateOAuthLogin(req.user, userAgent, ip);

    return res.json({ 
      message: 'Google Login Successful',
      user: req.user,
      tokens 
    });
    
    // for real app, you would typically set a cookie or redirect with the token
    // res.redirect(`http://localhost:3000/login/success?token=${tokens.accessToken}`);
  }
}