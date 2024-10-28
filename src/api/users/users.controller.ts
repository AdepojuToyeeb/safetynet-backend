import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from './users.service';
import { RequestPhoneDto } from 'src/dto/request-phone.dto';
import { ValidateOtpDto } from 'src/dto/validate-otp-dto';
import { CreateUserDTO } from 'src/dto/create-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('request-phone')
  @ApiOperation({ summary: 'Submit phone number for OTP verification' })
  async requestPhoneNumber(@Body() dto: RequestPhoneDto): Promise<string> {
    return this.userService.requestPhoneNumber(dto);
  }

  @Post('validate-otp')
  @ApiOperation({ summary: 'Validate OTP' })
  async validateOtp(@Body() dto: ValidateOtpDto) {
    return this.userService.validateOtp(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  async registerUser(@Body() dto: CreateUserDTO) {
    return this.userService.registerUser(dto);
  }
}




