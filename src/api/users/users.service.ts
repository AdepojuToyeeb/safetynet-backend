import { Injectable } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../../models/users.entity';
import { CreateUserDTO } from '../../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
constructor(
    @InjectRepository(Users)
     private usersRepository: Repository<Users>,
){}
 async createUser(CreateUserDTO: CreateUserDTO){
    const {email,password} = CreateUserDTO;

    const newUser = this.usersRepository.create({email, password});
    await this.usersRepository.save(newUser);

    return {
      message:"User created successfully"
    }

 }
 async findbyEmail(email: string): Promise<Users | undefined> {
    return this.usersRepository.findOneBy({email});
 }

}