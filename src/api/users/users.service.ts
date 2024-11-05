import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/models/users.entity';
import { RequestPhoneDto } from 'src/dto/requests/request-phone.dto';
import { VerifyOtpDto } from 'src/dto/requests/verify-otp-dto';
import { CreateUserDTO } from 'src/dto/requests/create-user.dto';
import { OtpAuth } from 'src/models/otpauth.entity';
import { CHANNEL } from 'src/constants';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(OtpAuth)
    private otpRepository: Repository<OtpAuth>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) { }

  // // Request for User phone number
  // async requestPhoneNumber(RequestPhoneDto: RequestPhoneDto): Promise<{ message: string }> {
  //   // Check if the phone number exists in the user db already
  //   const existingUserWithPhoneNumber = await this.userRepository.findOne({
  //     where: { phoneNumber: RequestPhoneDto.phoneNumber },
  //   })
  //   if (existingUserWithPhoneNumber) {
  //     throw new BadRequestException('Phone number already exists');
  //   }

  //   // We use our hardcoded otp instead of an otp generation
  //   const hardcodedOtp = '123456';

  //   const verification = this.otpRepository.create({
  //     phoneNumber: RequestPhoneDto.phoneNumber,
  //     otp: hardcodedOtp,

  //   })
  //   await this.otpRepository.save(verification);
  //   return { message: 'Otp sent successfully' };

  // }

  // Verify user contact
  async verifyUserContact(requestPhoneDto: RequestPhoneDto): Promise<{ message: string }> {
    let dbQuery: {
      phoneNumber?: string,
      email?: string
    } = {}

    if (requestPhoneDto.channel == CHANNEL.EMAIL) {
      dbQuery.email = requestPhoneDto.email
    } else {
      dbQuery.phoneNumber = requestPhoneDto.phoneNumber
    }

    // Check if the phone number exists in the user db already
    const existingUser = await this.userRepository.findOne({
      where: dbQuery,
    })

    if (existingUser) {
      throw new BadRequestException(`${existingUser.email == requestPhoneDto.email ? 'Email' : 'Phone number'} already exists`);
    }

    // We use our hardcoded otp instead of an otp generation
    const hardcodedOtp = '12345';

    const verification = this.otpRepository.create({
      recipient: requestPhoneDto.channel == CHANNEL.EMAIL ? requestPhoneDto.email : requestPhoneDto.phoneNumber,
      channel: requestPhoneDto.channel,
      otp: hardcodedOtp,

    })
    await this.otpRepository.save(verification);
    return { message: 'Otp sent successfully' };
  }



  // Verify the otp with the phone number
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    const verification = await this.otpRepository.findOne({
      where: { recipient: verifyOtpDto.recipient, otp: verifyOtpDto.otp, channel: verifyOtpDto.channel },
    });

    if (!verification) {
      throw new BadRequestException('Invalid Otp')
    }
    if (verification.isverified) {
      throw new BadRequestException('OTP already used')
    }
    verification.isverified = true;
    await this.otpRepository.save(verification);
    return { message: 'OTP verified successfully' };
  }



  // Create a User
  async registerUser(dto: CreateUserDTO): Promise<{ message: string }> {
    let dbQuery: {
      recipient?,
      channel?,
      isverified: boolean
    } = {
      isverified: true
    }
    if (dto.email) {
      dbQuery.recipient = dto.email
      dbQuery.channel = CHANNEL.EMAIL
    } else {
      dbQuery.recipient = dto.phoneNumber
      dbQuery.channel = CHANNEL.SMS
    }
    const verification = await this.otpRepository.findOne({ where: dbQuery });

    if (!verification) {
      throw new BadRequestException('Email/Phone number not verified');
    }

    //Check if user exists with Email
    const existingUserWithEmail = await this.userRepository.findOne({
      where: [{ email: dto.email },{phoneNumber:dto.phoneNumber}],
    });

    if (existingUserWithEmail) {
      throw new ConflictException('This email/phone number already exists');
    }


    const user = this.userRepository.create({
      ...dto,
    });
    await this.userRepository.save(user);

    // Clean up verification record
    // await this.otpRepository.delete({phoneNumber: dto.phoneNumber});
    return { message: 'User created successfully' };
  }
}
