import { JwtPayload } from 'jsonwebtoken';
import { REQUEST_USER_KEY } from 'src/constants/auth.constants';

declare module 'express' {
  export interface Request {
    [REQUEST_USER_KEY]?: JwtPayload | string;
  }
}
