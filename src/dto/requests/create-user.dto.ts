import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length, Matches, ValidateIf } from "class-validator";

export class CreateUserDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fullName:string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @Length(6, 20)
    password: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsPhoneNumber()
    phoneNumber: string;
}