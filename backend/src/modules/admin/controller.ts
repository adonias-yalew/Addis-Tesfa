import { Request, Response } from 'express';
import { getSupabase } from '../../db/supabaseClient.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { PostStatus } from '../../types/index.js';

export class AdminController {
  // Dashboard stats
  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const supabase = getSupabase();
    
    const [
      { count: usersCount },
      { count: postsCount },
      { count: professionalsCount },
      { count: pendingReports },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('professionals').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
    ]);
    
    res.json({
      success: true,
      data: {
        users: usersCount || 0,
        posts: postsCount || 0,
        professionals: professionalsCount || 0,
        pendingReports: pendingReports || 0,
      },
    });
  });
  
  // User management
  updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { role } = req.body;
    
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select('id, email, role, created_at')
      .single();
    
    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    
    res.json({
      success: true,
      data,
      message: `User role updated to ${role}`,
    });
  });
  
  // Post moderation
  moderatePost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { status, reason } = req.body;
    
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('posts')
      .update({ status, moderation_reason: reason })
      .eq('id', postId)
      .select('*')
      .single();
    
    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }
    
    res.json({
      success: true,
      data,
      message: `Post ${status.toLowerCase()}`,
    });
  });
  
  // Get all posts for moderation
  getPostsForModeration = asyncHandler(async (_req: Request, res: Response) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('posts')
      .select('*, users(email)')
      .in('status', [PostStatus.UNDER_REVIEW, PostStatus.HIDDEN])
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    
    res.json({ success: true, data: data || [] });
  });
}

export const adminController = new AdminController();
