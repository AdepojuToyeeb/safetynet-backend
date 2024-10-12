import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/dto/create-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
constructor (private readonly UsersService: UsersService){}

@Post('register')
async register(@Body() body:CreateUserDTO){
    return this.UsersService.createUser(body);
}
}

