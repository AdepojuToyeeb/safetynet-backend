// dto/request-otp.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class RequestPhoneDto{
  @ApiProperty()
  @IsString()
  phoneNumber: string;
}


  