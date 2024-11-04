import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Matches } from "class-validator";

export class CreateUserDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName:string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName:string;
    @ApiProperty()
    @IsEmail()
    email: string;
    @ApiProperty()
    @IsString()
    @Length(6, 20)
    password: string;
    @ApiProperty()
    @IsPhoneNumber()
    phoneNumber: string;

    

}