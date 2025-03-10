import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Users } from 'src/models/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpAuth } from 'src/models/otpauth.entity';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { UserService } from '../users/users.service';
import { EmergencyContacts } from 'src/models/emergencycontact.entity';
import { AccessTokenGuard } from './access-token.guard';


@Module({
  imports: [
    TypeOrmModule.forFeature([Users, OtpAuth, EmergencyContacts]),
    ConfigModule.forFeature(jwtConfig)
    ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenGuard, UserService ],
  exports: [AuthService],
})
export class AuthModule { }
