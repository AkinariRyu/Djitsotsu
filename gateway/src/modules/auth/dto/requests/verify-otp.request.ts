import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { IsIdentifier } from '../../../../shared/validators/identifier.validator';

export class VerifyOtpRequest {
  @ApiProperty({ example: 'user@example.com', description: 'Email or Phone identifier' })
  @IsNotEmpty()
  @IsIdentifier()
  identifier: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'Code must be exactly 6 digits' })
  code: string;
}