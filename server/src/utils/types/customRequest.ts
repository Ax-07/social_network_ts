import { Request } from 'express';

export interface CustomRequest extends Request {
  auth?: {
    userId: string;
  };
  user?: {
    sub: string;
    email: string;
    given_name: string;
    picture: string;
  };
}
