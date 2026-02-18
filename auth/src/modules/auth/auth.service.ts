import { BadRequestException, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../core/database/prisma.service';
import { REDIS_CLIENT } from '../../core/database/redis.module';
import { generateTag } from '../../common/utils/generate-tag.util';
import { RegisterRequest, LoginRequest } from '@contracts/auth/auth.generated';
import { InternalServerErrorException } from '@nestjs/common/exceptions/internal-server-error.exception';
import { MailService } from '../../core/mail/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async register(dto: RegisterRequest) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    if (!dto.nickname || dto.nickname.length < 3) {
        throw new BadRequestException('Nickname must be at least 3 chars');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const pendingUser = {
      email: dto.email,
      nickname: dto.nickname,
      password: hashedPassword,
      avatarUrl: dto.avatarUrl || null,
      otp: otp,
    };

    await this.redis.set(`reg:${dto.email}`, JSON.stringify(pendingUser), 'EX', 600);

    try {
      await this.mailService.sendOtpCode(dto.email, otp);
      this.logger.log(`OTP successfully sent to ${dto.email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${dto.email}`, error);
      throw new InternalServerErrorException('Could not send verification email');
    }

    this.logger.debug(`Debug REGISTRATION OTP for ${dto.email}: ${otp}`);

    return { success: true, message: 'Verification code sent' };
  }

  async login(dto: LoginRequest) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createSession(user.id, user.role, 'Unknown', '127.0.0.1');
  }

  async sendOtp(identifier: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `otp:${identifier}`;
    
    await this.redis.set(key, otp, 'EX', 300);

    try {
      await this.mailService.sendOtpCode(identifier, otp);
      this.logger.log(`OTP successfully sent to ${identifier}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${identifier}`, error);
      throw new InternalServerErrorException('Could not send verification email');
    }

    this.logger.debug(`Debug OTP for ${identifier}: ${otp}`);

    return { 
      success: true, 
      message: 'Verification code has been sent to your email' 
    };
  }

  async verifyOtpAndLogin(identifier: string, code: string, ip: string, userAgent: string) {
    const regKey = `reg:${identifier}`;
    const pendingRegStr = await this.redis.get(regKey);

    if (pendingRegStr) {
      const pendingReg = JSON.parse(pendingRegStr);

      if (pendingReg.otp !== code) {
        throw new BadRequestException('Invalid verification code');
      }

      const newUser = await this.prisma.user.create({
        data: {
          email: pendingReg.email,
          password: pendingReg.password,
          nickname: pendingReg.nickname,
          avatarUrl: pendingReg.avatarUrl,
          tag: generateTag(),
          provider: 'local',
          isVerified: true,
        },
      });

      await this.redis.del(regKey);

      const tokens = await this.createSession(newUser.id, newUser.role, userAgent, ip);
      return { user: newUser, ...tokens };
    }

    const loginKey = `otp:${identifier}`;
    const storedCode = await this.redis.get(loginKey);

    if (!storedCode || storedCode !== code) {
      throw new BadRequestException('Invalid or expired code');
    }

    await this.redis.del(loginKey);

    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const tokens = await this.createSession(user.id, user.role, userAgent, ip);
    return { user, ...tokens };
  }

  async socialLogin(data: { email: string; firstName: string; avatarUrl: string; provider: string; providerId: string }, ip: string, userAgent: string) {
    let user = await this.prisma.user.findFirst({ where: { email: data.email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          nickname: data.firstName || `User_${Math.floor(Math.random() * 1000)}`,
          avatarUrl: data.avatarUrl,
          provider: data.provider,
          providerId: data.providerId,
          tag: generateTag(),
          isVerified: true,
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { 
          avatarUrl: data.avatarUrl, 
          provider: data.provider,
          providerId: data.providerId 
        },
      });
    }

    return this.createSession(user.id, user.role, userAgent, ip);
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      return { id: payload.sub };
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshTokens(refreshToken: string, ip: string, userAgent: string) {
    const session = await this.prisma.session.findUnique({ 
      where: { refreshToken },
      include: { user: true } 
    });

    if (!session) {
      this.logger.warn(`Attempt to use non-existent refresh token: ${refreshToken}`);
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    if (session.ip !== ip || session.userAgent !== userAgent) {
      this.logger.error(`Session theft attempt! IP/UA mismatch for user ${session.userId}`);
      await this.prisma.session.deleteMany({ where: { userId: session.userId } });
      throw new UnauthorizedException('Security breach suspected');
    }

    if (new Date() > session.expiresAt) {
      await this.prisma.session.delete({ where: { id: session.id } });
      throw new UnauthorizedException('Session expired');
    }

    await this.prisma.session.delete({ where: { id: session.id } });

    return this.createSession(session.user.id, session.user.role, userAgent, ip);
  }

  async logout(refreshToken: string) {
    try {
      await this.prisma.session.delete({ where: { refreshToken } });
      return { success: true };
    } catch (e) {
      return { success: true };
    }
  }

  private async createSession(userId: string, role: string, userAgent: string, ip: string) {
    const refreshToken = uuidv4(); 
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.session.create({
      data: { userId, refreshToken, userAgent, ip, expiresAt },
    });

    const accessToken = this.jwtService.sign(
      { sub: userId, role },
      { 
        expiresIn: this.config.get('JWT_EXPIRATION'), 
        secret: this.config.get('JWT_SECRET') 
      },
    );

    return { accessToken, refreshToken };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const result = await this.sendOtp(email);
    
    return result;
  }

  async resetPassword(dto: { email: string; code: string; new_password: string }) {
    const key = `otp:${dto.email}`;
    
    const storedCode = await this.redis.get(key);

    if (!storedCode) {
      throw new BadRequestException('Code expired or never requested');
    }

    if (storedCode !== dto.code) {
      throw new BadRequestException('Invalid verification code');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('User no longer exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.new_password, salt);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { 
          password: hashedPassword,
          isVerified: true
        },
      }),
      this.prisma.session.deleteMany({ where: { userId: user.id } }),
    ]);

    await this.redis.del(key);

    this.logger.log(`Password successfully reset for user: ${dto.email}`);

    return this.createSession(user.id, user.role, 'Password Reset Device', '127.0.0.1');
  }
}