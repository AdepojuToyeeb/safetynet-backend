import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/models/users.entity';
import { OtpAuth } from 'src/models/otpauth.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Users, OtpAuth])],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
