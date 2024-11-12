
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString } from 'class-validator';

export class FindUserDto {
  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
