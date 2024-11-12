import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req, Inject, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/dto/requests/login.dto';
import { AccessTokenGuard } from './access-token.guard';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { UserService } from '../users/users.service';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { request } from 'http';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    // Inject jwtConfiguration
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    // Inject UserService
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify User login' })
  async login(@Body() loginDto: LoginDto): Promise<{ message: string; token: string }> {
    return this.authService.login(loginDto);
  }

}
