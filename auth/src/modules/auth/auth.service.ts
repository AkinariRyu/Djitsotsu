import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../core/database/prisma.service';
import { REDIS_CLIENT } from '../../core/database/redis.module';
import { generateTag } from '../../common/utils/generate-tag.util';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async sendOtp(identifier: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `otp:${identifier}`;
    
    await this.redis.set(key, otp, 'EX', 300);
    
    this.logger.log(`OTP for ${identifier}: ${otp}`);

    return { success: true, message: 'Code sent' };
  }

  async verifyOtpAndLogin(identifier: string, code: string, userAgent: string, ip: string) {
    const key = `otp:${identifier}`;
    const storedCode = await this.redis.get(key);

    if (!storedCode || storedCode !== code) {
      throw new BadRequestException('Invalid or expired code');
    }

    await this.redis.del(key);

    let user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (!user) {
      user = await this.registerNewUser(identifier);
    }

    const tokens = await this.createSession(user.id, user.role, userAgent, ip);

    return {
      user,
      ...tokens,
    };
  }

  async validateOAuthLogin(profile: any, userAgent: string, ip: string) {
    let user = await this.prisma.user.findFirst({
      where: { email: profile.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          nickname: profile.firstName || `User_${Math.floor(Math.random() * 1000)}`,
          avatarUrl: profile.picture,
          provider: profile.provider,
          providerId: profile.providerId,
          tag: generateTag(),
          isVerified: true,
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          avatarUrl: profile.picture,
          provider: 'google',
        },
      });
    }

    return this.createSession(user.id, user.role, userAgent, ip);
  }

  private async registerNewUser(identifier: string) {
    const isEmail = identifier.includes('@');
    
    const tempNickname = isEmail ? identifier.split('@')[0] : `User${identifier.slice(-4)}`;
    
    return this.prisma.user.create({
      data: {
        email: isEmail ? identifier : null,
        phone: !isEmail ? identifier : null,
        nickname: tempNickname,
        tag: generateTag(),
        avatarUrl: null,
      },
    });
  }

  private async createSession(userId: string, role: string, userAgent: string, ip: string) {
    const refreshToken = uuidv4(); 
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        userAgent,
        ip,
        expiresAt,
      },
    });

    const accessToken = this.jwtService.sign(
      { sub: userId, role },
      { expiresIn: '15m' }
    );

    return { accessToken, refreshToken };
  }

  async logout(refreshToken: string) {
    return this.prisma.session.delete({
      where: { refreshToken },
    }).catch(() => {
      return { success: true };
    });
  }

  async refreshTokens(refreshToken: string, userAgent: string, ip: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
    });

    if (!session) {
      throw new BadRequestException('Invalid Refresh Token');
    }

    if (new Date() > session.expiresAt) {
      await this.prisma.session.delete({ where: { id: session.id } });
      throw new BadRequestException('Session expired');
    }

    await this.prisma.session.delete({ where: { id: session.id } });

    const user = await this.prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.createSession(user.id, user.role, userAgent, ip);
  }
}