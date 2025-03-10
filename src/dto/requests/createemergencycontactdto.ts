import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsPhoneNumber } from "class-validator";

export class CreateEmergencyContactDto{
    @ApiProperty()
    @IsPhoneNumber()
    phoneNumber: string;
}