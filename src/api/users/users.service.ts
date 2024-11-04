import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/models/users.entity';
import { RequestPhoneDto } from 'src/dto/requests/request-phone.dto';
import { VerifyOtpDto } from 'src/dto/requests/verify-otp-dto';
import { CreateUserDTO } from 'src/dto/requests/create-user.dto';
import { OtpAuth } from 'src/models/otpauth.entity';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(OtpAuth)
    private otpRepository: Repository<OtpAuth>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  // Request for User phone number
  async requestPhoneNumber(RequestPhoneDto: RequestPhoneDto): Promise<{message:string}>{
    // Check if the phone number exists in the user db already
    const existingUserWithPhoneNumber = await this.userRepository.findOne({
      where:{phoneNumber: RequestPhoneDto.phoneNumber},
    })
    if(existingUserWithPhoneNumber){
      throw new BadRequestException('Phone number already exists');
    }

    // We use our hardcoded otp instead of an otp generation
    const hardcodedOtp = '123456';

    const verification = this.otpRepository.create({
      phoneNumber: RequestPhoneDto.phoneNumber,
      otp: hardcodedOtp,

    })
    await this.otpRepository.save(verification);
    return{message: 'Otp sent successfully'};
    
  }
  
  // Verify the otp with the phone number
  async verifyOtp(VerifyOtpDto:VerifyOtpDto): Promise<{message:string}>{
    const verification = await this.otpRepository.findOne({
      where: {phoneNumber: VerifyOtpDto.phoneNumber,otp: VerifyOtpDto.otp},
    });

    if (!verification){
      throw new BadRequestException('Invalid Otp')
    }
    verification.isverified=true;
    await this.otpRepository.save(verification);
    return{message: 'OTP verified successfully'};
  }

  

  // Create a User
  async registerUser(dto: CreateUserDTO): Promise<{message:string}> {
    const verification = await this.otpRepository.findOne({
      where: {phoneNumber: dto.phoneNumber, isverified:true},
    });

    if (!verification){
      throw new BadRequestException ('Phone number not verified');
    }

    //Check if user exists with Email
    const existingUserWithEmail= await this.userRepository.findOne({ where: { email: dto.email},
    });
    if (existingUserWithEmail){
      throw new ConflictException('This email already exists');
    }


    const user = this.userRepository.create({
      ...dto, 
    });
    await this.userRepository.save(user);

    // Clean up verification record
    await this.otpRepository.delete({phoneNumber: dto.phoneNumber});
    return {message: 'User created successfully'};
  }
}
