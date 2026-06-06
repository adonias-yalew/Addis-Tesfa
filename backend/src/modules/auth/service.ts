import { getSupabase } from '../../db/supabaseClient.js';
import { generateToken } from '../../utils/jwt.js';
import { UserRole } from '../../types/index.js';
import { AuthUser, LoginInput, RegisterInput, AuthResponse } from './types.js';

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { email, password, role = UserRole.USER, isAnonymous = false } = input;
    
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
    
    // Create user (password stored as plaintext - NOT for production!)
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: password,
        role,
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
    
    // Verify password (plaintext comparison - NOT for production!)
    if (password !== user.password_hash) {
      throw new Error('Invalid credentials');
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
