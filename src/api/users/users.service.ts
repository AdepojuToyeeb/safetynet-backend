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
 async createUser(CreateUserDTO: CreateUserDTO): Promise<Users>{
    const {email,password} = CreateUserDTO;

    const hashedPassword = await bcrypt.hash(password);
    const newUser = this.usersRepository.create({email, password: hashedPassword});

    return this.usersRepository.save(newUser);

 }
 async findbyEmail(email: string): Promise<Users | undefined> {
    return this.usersRepository.findOneBy({email});
 }

}