import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpRequest } from './dto/requests/send-otp.request';
import { VerifyOtpRequest } from './dto/requests/verify-otp.request';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP code to email or phone' })
  @ApiResponse({ status: 200, description: 'Code sent successfully' })
  async sendOtp(@Body() payload: SendOtpRequest) {
    return this.authService.sendOtp(payload);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP code and login' })
  @ApiResponse({ status: 200, description: 'Code valid, login successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  async verifyOtp(@Body() payload: VerifyOtpRequest) {
    return this.authService.verifyOtp(payload);
  }
}