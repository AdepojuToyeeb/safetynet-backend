import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/models/users.entity';
import { RequestPhoneDto } from 'src/dto/request-phone.dto';
import { ValidateOtpDto } from 'src/dto/validate-otp-dto';
import { CreateUserDTO } from 'src/dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly hardcodedOtp = '123456'; // OTP for validation
  private tempPhoneNumber: string | null = null; // Temporary storage for the phone number

  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  // Store the phone number temporarily
  async requestPhoneNumber(dto: RequestPhoneDto): Promise<string> {
    //Check if the phone number already exists before otp verification
    const existingUserWithPhone = await this.userRepository. findOne({
      where: {phoneNumber: dto.phoneNumber},
    });
    if (existingUserWithPhone){
      throw new ConflictException('A user with this phone number already exists')
    }
    this.tempPhoneNumber = dto.phoneNumber;
    return `Phone number ${this.tempPhoneNumber} received. Please validate with OTP.`;
  }
  
  // Validate the OTP using the stored phone number
  async validateOtp(dto: ValidateOtpDto): Promise<{message: string}> {
    if (dto.otp !== this.hardcodedOtp || !this.tempPhoneNumber) {
      throw new BadRequestException('Invalid OTP or phone number not provided');
    }
    return {message:'OTP verification successful'};
  }

  // Automatically use the stored phone number during registration
  async registerUser(dto: CreateUserDTO): Promise<Users> {
    if (!this.tempPhoneNumber) {
      throw new BadRequestException('Phone number is missing. Please request and validate the phone number first.');
    }

    //Check if user exists with Email
    const existingUserWithEmail= await this.userRepository.findOne({ where: { email: dto.email},
    });
    if (existingUserWithEmail){
      throw new ConflictException('This email already exists');
    }


    const { firstName, lastName, email, password} = dto;
    const phoneNumber = this.tempPhoneNumber; // Uses the stored phone number


    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      isverified: true, // Sets user is verified to true
    });

    this.tempPhoneNumber = null; // Clear the temporary phone number after registration
    return this.userRepository.save(user);
  }
}
