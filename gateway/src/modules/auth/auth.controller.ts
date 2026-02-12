import { Body, Controller, HttpCode, HttpStatus, Post, Res, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpRequest } from './dto/requests/send-otp.request';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation Error' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    if (result.refreshToken) {
      this.setRefreshCookie(res, result.refreshToken);
    }
    return { accessToken: result.accessToken, status: result.status };
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to email/phone' })
  async sendOtp(@Body('identifier') identifier: string) {
    return this.authService.sendOtp(identifier);
}

  @Post('verify-otp')
  async verifyOtp(
    @Body('identifier') identifier: string,
    @Body('code') code: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.verifyOtp(identifier, code);
    if (result.refreshToken) {
      this.setRefreshCookie(res, result.refreshToken);
    }
    return { accessToken: result.accessToken, status: result.status };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refreshToken'];
    if (!token) throw new UnauthorizedException('No refresh token');

    const result = await this.authService.refresh(token);
    if (result.refreshToken) {
      this.setRefreshCookie(res, result.refreshToken);
    }
    return { accessToken: result.accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refreshToken'];
    if (token) {
      await this.authService.logout(token);
    }
    res.clearCookie('refreshToken');
    return { success: true };
  }

  @Post('social-login')
@ApiOperation({ summary: 'Login or Register via Social Provider' })
async socialLogin(
  @Body() dto: any,
  @Res({ passthrough: true }) res: Response
) {
  const result = await this.authService.socialLogin(dto);

  if (result.status !== 200) {
    throw new BadRequestException(result.error);
  }

  if (result.refreshToken) {
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  return { 
    accessToken: result.accessToken,
    status: result.status 
  };
}

}