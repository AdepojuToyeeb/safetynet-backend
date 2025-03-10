import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/dto/requests/login.dto';
import { Users } from 'src/models/users.entity';
import { UsersModule } from '../users/users.module';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { UnauthorizedExceptionDto } from 'src/dto/errors/not-authuorised-exception.dto';
import { NotFoundExceptionDto } from 'src/dto/errors/not-found-exception.dto';
import { UserService } from '../users/users.service';
import { FindUserDto } from 'src/dto/requests/find.user.dto';
import jwtConfig from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';



@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        private jwtService: JwtService,
        //Inject jwtConfiguration
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration : ConfigType<typeof jwtConfig>,
        //Inject UserService
        @Inject(forwardRef(() => UserService))
        private readonly usersService: UserService,
    ) { }

    //User login
    async login(logindto: LoginDto): Promise<{ message: string; token: string }> {
        //Include the finduser method from user service to retrieve the user
        const user = await this.usersService.findUser({
            email: logindto.email,
            phoneNumber: logindto.phoneNumber
        });

        if (!user) {
            throw new NotFoundException({
                type: "Not found Exception",
                message: "No User found",
            } as NotFoundExceptionDto);
        }

        // Check if user password is valid
        const isPasswordValid = await Users.comparePassword(logindto.password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException('Incorrect password')
        }

        // Generate a JWT token
        const token = await this.jwtService.signAsync({
            userID: user.id,
            email: user.email,
            phoneNumber: user.phoneNumber,
        },
        {
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
            secret: this.jwtConfiguration.secret,
            expiresIn: this.jwtConfiguration.accessTokenTtl
        },
    );
            
    

        return { message: 'Login successful', token };
    }
}

