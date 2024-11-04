import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";
 
 export class VerifyOtpDto{
    @ApiProperty()
    @IsPhoneNumber()
    phoneNumber:string;

    @ApiProperty()
    @IsString()
    otp: string;

 }