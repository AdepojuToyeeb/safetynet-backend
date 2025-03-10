import{ ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";


export class LoginDto{
    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber()
    phoneNumber: string;

    
    @ApiProperty()
    @IsString()
    @Length(6, 20)
    password: string;





}