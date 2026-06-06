import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload, UserRole } from '../types';

export const generateToken = (
  userId: string,
  email: string,
  role: UserRole,
  isAnonymous: boolean = false
): string => {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    userId,
    email,
    role,
    isAnonymous,
  };
  
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};
