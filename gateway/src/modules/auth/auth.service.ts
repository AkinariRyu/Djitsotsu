import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { 
  AUTH_SERVICE_NAME, 
  AuthServiceClient, 
  RegisterRequest, 
  LoginRequest,
} from '@contracts/auth/auth.generated';
import { lastValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SocialLoginDto } from './dto/social-login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthServiceClient;

  constructor(@Inject(AUTH_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async register(data: RegisterDto) {
    return lastValueFrom(this.authService.register({
      ...data,
      avatarUrl: data.avatarUrl ?? "", 
    }));
  }

  async login(data: LoginRequest) {
    return lastValueFrom(this.authService.login(data));
  }
  
  async sendOtp(identifier: string) {
    return lastValueFrom(this.authService.sendOtp({ identifier }));
  }

  async verifyOtp(identifier: string, code: string) {
    return lastValueFrom(this.authService.verifyOtp({ identifier, code }));
  }

  async refresh(refreshToken: string) {
    return lastValueFrom(this.authService.refresh({ refreshToken }));
  }

  async logout(refreshToken: string) {
    return lastValueFrom(this.authService.logout({ refreshToken }));
  }

  async socialLogin(data: SocialLoginDto) {
  return lastValueFrom(this.authService.socialLogin({
    email: data.email,
    firstName: data.firstName,
    avatarUrl: data.avatarUrl ?? "",
    provider: data.provider,
    providerId: data.providerId,
  }));
}
}