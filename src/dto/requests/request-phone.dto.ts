// dto/request-otp.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';
import { CHANNEL } from 'src/constants';

export class RequestPhoneDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber()
  @ValidateIf(item=> item.channel == CHANNEL.SMS)
  phoneNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf(item=> item.channel == CHANNEL.EMAIL)
  @IsEmail()
  email: string;

  @ApiProperty({ enum: CHANNEL })
  channel: CHANNEL
}


