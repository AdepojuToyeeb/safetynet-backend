import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from "class-validator";
import { CHANNEL } from "src/constants";

export class VerifyOtpDto {
   @ApiProperty()
   recipient: string;

   @ApiProperty()
   @IsString()
   otp: string;

   @ApiProperty({ enum: CHANNEL })
   channel: CHANNEL

}