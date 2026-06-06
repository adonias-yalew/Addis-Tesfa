import { UserRole } from '../../types/index.js';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  role?: UserRole;
  isAnonymous?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  isAnonymous: boolean;
}
