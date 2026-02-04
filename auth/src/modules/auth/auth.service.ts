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
}