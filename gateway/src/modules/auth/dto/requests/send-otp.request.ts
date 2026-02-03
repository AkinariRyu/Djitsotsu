import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { IsIdentifier } from 'src/shared/validators/identifier.validator';

export class SendOtpRequest {
  @ApiProperty({ example: 'user@example.com', description: 'Email or Phone identifier' })
  @IsString()
  @IsNotEmpty()
  @IsIdentifier()
  identifier: string;
}