import bcrypt from 'bcrypt';
import { getSupabase } from '../../db/supabaseClient.js';
import { generateToken } from '../../utils/jwt.js';
import { UserRole } from '../../types/index.js';
import { AuthUser, LoginInput, RegisterInput, AuthResponse } from './types.js';

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { email, password, isAnonymous = false } = input;

    if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
      throw new Error('Password must be at least 8 characters and no more than 72 bytes');
    }
    
    const supabase = getSupabase();
    
    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Supabase check error:', checkError);
      throw new Error(checkError?.message || 'Database error checking user');
    }
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const passwordHash = await bcrypt.hash(password, 12);

    // Public registration must never allow a caller to select an elevated role.
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        role: UserRole.USER,
        is_anonymous: isAnonymous,
      })
      .select('id, email, role, is_anonymous, created_at, updated_at')
      .single();
    
    if (error || !user) {
      console.error('Supabase insert error:', error);
      throw new Error(error?.message || error?.details || 'Failed to create user');
    }
    
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      isAnonymous: user.is_anonymous,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
    
    const token = generateToken(authUser.id, authUser.email, authUser.role, authUser.isAnonymous);
    
    return { user: authUser, token };
  }
  
  async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;
    const supabase = getSupabase();
    
    // Get user with password
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, role, is_anonymous, created_at, updated_at')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      throw new Error('Invalid credentials');
    }
    
    const storedHash = user.password_hash as string;
    const isBcryptHash = /^\$2[aby]\$/.test(storedHash);
    const passwordMatches = isBcryptHash
      ? await bcrypt.compare(password, storedHash)
      : password === storedHash;

    if (!passwordMatches) {
      throw new Error('Invalid credentials');
    }

    // Upgrade legacy plaintext credentials after a successful login.
    if (!isBcryptHash) {
      const upgradedHash = await bcrypt.hash(password, 12);
      const { error: upgradeError } = await supabase
        .from('users')
        .update({ password_hash: upgradedHash })
        .eq('id', user.id);
      if (upgradeError) throw new Error('Unable to secure account credentials');
    }
    
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      isAnonymous: user.is_anonymous,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
    
    const token = generateToken(authUser.id, authUser.email, authUser.role, authUser.isAnonymous);
    
    return { user: authUser, token };
  }
  
  async getUserById(userId: string): Promise<AuthUser | null> {
    const supabase = getSupabase();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, is_anonymous, created_at, updated_at')
      .eq('id', userId)
      .single();
    
    if (error || !user) return null;
    
    return {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      isAnonymous: user.is_anonymous,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}

export const authService = new AuthService();
