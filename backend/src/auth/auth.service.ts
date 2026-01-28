import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { RegisterDto } from './dto/register.dto';
import { User, AuthMethod } from '@prisma/client'
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  public constructor(private readonly userService: UserService, private readonly configService: ConfigService) {}

  public async register(req: Request, dto: RegisterDto) {
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
    return this.saveSession(req, newUser)
  }

  public async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.password) {
        throw new NotFoundException(
            'User not found. Please check your input data.'
        );
    }

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) {
        throw new UnauthorizedException(
            'Invalid password. Please try again or reset your password if you forgot it.'
        );
    }

    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
        req.session.destroy(err => {
            if (err) {
                return reject(
                    new InternalServerErrorException(
                        'Failed to end session. There might be a server issue or the session was already ended.'
                    )
                );
            }

            res.clearCookie(
                this.configService.getOrThrow<string>('SESSION_NAME')
            )

            resolve()
        })
    })
  }

  private async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
        req.session.userId = user.id

        req.session.save(err => {
            if (err) {
                return reject(
                    new InternalServerErrorException(
                        'Failed to save session. Check if session parameters are configured correctly.'
                    )
                );
            }

            resolve({
                user
            });
        });
    });
  }
}