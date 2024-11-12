import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UnauthorizedExceptionDto } from 'src/dto/errors/not-authuorised-exception.dto';
import { REQUEST_USER_KEY } from 'src/constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtservice: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractRequestFromHeader(request);

    if (!token) {
      throw new UnauthorizedException({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'User is not authorized',
      } as UnauthorizedExceptionDto);
    }

    try {
      const payload = await this.jwtservice.verifyAsync(token);
      request[REQUEST_USER_KEY] = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

