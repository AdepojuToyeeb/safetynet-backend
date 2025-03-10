import { PickType } from "@nestjs/swagger";
import { CreateUserDTO } from "./create-user.dto";

export class UpdateUserNameDto extends PickType(CreateUserDTO, ['fullName'] as const) {}