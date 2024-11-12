import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/models/users.entity';
import { RequestPhoneDto } from 'src/dto/requests/request-phone.dto';
import { VerifyOtpDto } from 'src/dto/requests/verify-otp-dto';
import { CreateUserDTO } from 'src/dto/requests/create-user.dto';
import { OtpAuth } from 'src/models/otpauth.entity';
import { CHANNEL } from 'src/constants';
import { FindUserDto } from 'src/dto/requests/find.user.dto';
import { find } from 'rxjs';
import { CreateEmergencyContactDto } from 'src/dto/requests/createemergencycontactdto';
import { EmergencyContacts,} from 'src/models/emergencycontact.entity';
import { UpdateUserNameDto } from 'src/dto/requests/update-user-name.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(OtpAuth)
    private otpRepository: Repository<OtpAuth>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(EmergencyContacts)
    private emergencycontactsRepository: Repository<EmergencyContacts>,
  ) { }


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

    //Check if user exists with Email or PhoneNumber
    const existingUserWithEmail = await this.userRepository.findOne({
      where: [{ email: dto.email }, { phoneNumber: dto.phoneNumber }],
    });

    if (existingUserWithEmail) {
      throw new ConflictException('This email/phone number already exists');
    }


    const user = this.userRepository.create({
      ...dto,
    });
    await this.userRepository.save(user);
    return { message: 'User created successfully' };
  }

  //Method to Find user by email or phone number
  async findUser(findUserDto: FindUserDto): Promise<Users | null> {
    // Check if at least one search criterion is provided
    if (!findUserDto.email && !findUserDto.phoneNumber) {
      throw new BadRequestException('Email or phone number must be provided to find a user.');
    }

    // Search for the user by email or phone number
    const user = await this.userRepository.findOne({
      where: [
        { email: findUserDto.email },
        { phoneNumber: findUserDto.phoneNumber },
      ],
      select: ['id', 'email', 'phoneNumber', 'password'],
    });

    return user;
  }

  // Add Emergency Contact
  async addEmergencyContact(
    userID: number, createEmergencyContactdto: CreateEmergencyContactDto,): Promise<{message: string}>{
      // Check if User exists
      const user = await this.userRepository.findOne({
        where: {id: userID},
        relations: ['emergencyContacts'],
      });

      if (!user){
        throw new NotFoundException('User not found');
      
      }
      //Check if an emergency contact with thephone number already exists
      const existingContact = await this.emergencycontactsRepository.findOne({
        where: {user: {id:userID},
      phoneNumber: createEmergencyContactdto.phoneNumber},
      });
      if (existingContact){
        throw new ConflictException('This emergency contact has been added already');
      }

     

      // Create new emergency Contact
      const emergencyContact = this.emergencycontactsRepository.create({
        ...createEmergencyContactdto,
        user: user,
      });
      await this.emergencycontactsRepository.save(emergencyContact)
      return{message: 'Emergency Contact added successfully'};

    }

    //Retrieve emergency contacts
    async getEmergencyContacts(userID:number): Promise<EmergencyContacts[]>{
      const user = await this.userRepository.findOne({
        where: {id:userID},
        relations: ['emergencyContacts'],
      });

      if (!user){
        throw new NotFoundException('User not found');
      }
      return user.emergencyContacts;
    }

    //To Update User's Name
    async updateUserName(userID: number, updateUserNamedto: UpdateUserNameDto): Promise<{message: string}>{
      const user = await this.userRepository.findOne({
        where: {id: userID},
      });
      if (!user){
        throw new NotFoundException('User Not found');
      }

      user.fullName = updateUserNamedto.fullName;
      await this.userRepository.save(user);
      return {message: 'Full name updated successfully'};


    }
  }

  



  
 



