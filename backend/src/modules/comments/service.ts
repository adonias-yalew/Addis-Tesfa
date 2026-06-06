import { getSupabase } from '../../db/supabaseClient.js';
import { Comment, CreateCommentInput, UpdateCommentInput } from './types.js';

export class CommentService {
  async getCommentsByPost(postId: string): Promise<Comment[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) throw new Error(error.message);
    return (data || []).map(this.mapComment);
  }
  
  async getCommentById(id: string): Promise<Comment | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    return this.mapComment(data);
  }
  
  async createComment(authorId: string, input: CreateCommentInput): Promise<Comment> {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: input.postId,
        author_id: authorId,
        content: input.content,
        is_anonymous: input.isAnonymous || false,
        parent_id: input.parentId || null,
      })
      .select('*')
      .single();
    
    if (error || !data) throw new Error(error?.message || 'Failed to create comment');
    return this.mapComment(data);
  }
  
  async updateComment(id: string, input: UpdateCommentInput): Promise<Comment> {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('comments')
      .update({ content: input.content })
      .eq('id', id)
      .select('*')
      .single();
    
    if (error || !data) throw new Error(error?.message || 'Failed to update comment');
    return this.mapComment(data);
  }
  
  async deleteComment(id: string): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
  
  private mapComment(data: Record<string, unknown>): Comment {
    return {
      id: data.id as string,
      postId: data.post_id as string,
      authorId: data.author_id as string,
      content: data.content as string,
      isAnonymous: data.is_anonymous as boolean,
      parentId: data.parent_id as string | undefined,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    };
  }
}

export const commentService = new CommentService();
