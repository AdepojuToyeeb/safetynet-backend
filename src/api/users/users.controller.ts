import { Controller, Post, Body, Param, Get, UseGuards, Req, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './users.service';
import { RequestPhoneDto } from 'src/dto/requests/request-phone.dto';
import { VerifyOtpDto } from 'src/dto/requests/verify-otp-dto';
import { CreateUserDTO } from 'src/dto/requests/create-user.dto';
import { CreateEmergencyContactDto } from 'src/dto/requests/createemergencycontactdto';
import { EmergencyContacts } from 'src/models/emergencycontact.entity';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { Request } from 'express';
import { request } from 'http';
import { UpdateUserNameDto } from 'src/dto/requests/update-user-name.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('verify-user-contact')
  @ApiOperation({ summary: 'Verify user contact' })
  async verifyUserContact(@Body() dto: RequestPhoneDto) {
    return this.userService.verifyUserContact(dto);
  }

  @Post('validate-otp')
  @ApiOperation({ summary: 'Validate OTP' })
  async validateOtp(@Body() dto: VerifyOtpDto) {
    return this.userService.verifyOtp(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  async registerUser(@Body() dto: CreateUserDTO) {
    return this.userService.registerUser(dto);
  }
  // Add emergency contacts
  @Post(':userID/emergency-contacts')
  @ApiOperation({summary: 'Add your Emergency Contact'})
  async addEmergencyContact(
    @Param('userID') userID: number,
    @Body() createEmergencyContactDto: CreateEmergencyContactDto,
  ): Promise<{ message: string }> {
    return this.userService.addEmergencyContact(userID, createEmergencyContactDto);
  }

  
  // Retrieve User emergency contacts after login
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('emergency-contacts')
  @ApiOperation({ summary: 'Retrieve emergency contacts' })
  async getEmergencyContacts(@Req() req: Request): Promise<any> {
    const userId = req.user['id']; // Use req.user to get the authenticated user's ID
    return this.userService.getEmergencyContacts(userId);
  }
  
 // Update User full name
 @ApiBearerAuth()
 @UseGuards(AccessTokenGuard)
 @Patch('update-full-name')
 @ApiOperation({summary: "Update user full name"})
 async updateUserName(@Req() req: Request, @Body() dto: UpdateUserNameDto): Promise<{message: string}>{
  const userID = req.user['id'];
  return this.userService.updateUserName(userID,dto);
 }

  
}





