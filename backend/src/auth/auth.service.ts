import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { User, AuthMethod } from '@prisma/client'

@Injectable()
export class AuthService {
  public constructor(private readonly userService: UserService) {}

  public async register(dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);

    if (isExists) {
      throw new ConflictException(
        'Registration failed. User with this email already exists. Please use another email or log in.',
      );
    }

    const newUser = await this.userService.create(
        dto.email,
        dto.password,
        dto.name,
        '',
        AuthMethod.CREDENTIALS,
        false
    )
    return this.saveSession(newUser)
  }

  public async login() {}

  public async logout() {}

  private async saveSession(user: User) {
    console.log('Session saved. User: ', user)
  }
}