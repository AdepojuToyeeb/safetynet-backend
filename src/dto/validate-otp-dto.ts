import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";
 
 export class ValidateOtpDto{
    @ApiProperty()
    @IsString()
    otp:string;
 }