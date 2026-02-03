import { Injectable } from '@nestjs/common';
import { SendOtpRequest } from './dto/requests/send-otp.request';
import { VerifyOtpRequest } from './dto/requests/verify-otp.request';

@Injectable()
export class AuthService {
  
  async sendOtp(data: SendOtpRequest) {
    return { message: 'Gateway: Request forwarded to Auth Service' };
  }

  async verifyOtp(data: VerifyOtpRequest) {
    return { message: 'Gateway: Request forwarded to Auth Service' };
  }
}