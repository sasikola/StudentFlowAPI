import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

interface JwtPayload {
  id:    string;
  email: string;
  role:  string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
};