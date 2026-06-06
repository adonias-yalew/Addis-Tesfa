import { getSupabase } from '../../db/supabaseClient.js';
import { Post, CreatePostInput, UpdatePostInput } from './types.js';
import { PostStatus } from '../../types/index.js';

export class PostService {
  async getAllPosts(): Promise<Post[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', PostStatus.PUBLISHED)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    
    return (data || []).map(this.mapPost);
  }
  
  async getPostById(id: string): Promise<Post | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    return this.mapPost(data);
  }
  
  async getPostsByAuthor(authorId: string): Promise<Post[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return (data || []).map(this.mapPost);
  }
  
  async createPost(authorId: string, input: CreatePostInput): Promise<Post> {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: authorId,
        title: input.title,
        content: input.content,
        is_anonymous: input.isAnonymous || false,
        status: PostStatus.PUBLISHED,
        tags: input.tags || [],
      })
      .select('*')
      .single();
    
    if (error || !data) throw new Error(error?.message || 'Failed to create post');
    return this.mapPost(data);
  }
  
  async updatePost(id: string, input: UpdatePostInput): Promise<Post> {
    const supabase = getSupabase();
    
    const updates: Record<string, unknown> = {};
    if (input.title) updates.title = input.title;
    if (input.content) updates.content = input.content;
    if (input.status) updates.status = input.status;
    if (input.tags) updates.tags = input.tags;
    
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error || !data) throw new Error(error?.message || 'Failed to update post');
    return this.mapPost(data);
  }
  
  async deletePost(id: string): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
  
  private mapPost(data: Record<string, unknown>): Post {
    return {
      id: data.id as string,
      authorId: data.author_id as string,
      title: data.title as string,
      content: data.content as string,
      isAnonymous: data.is_anonymous as boolean,
      status: data.status as PostStatus,
      tags: data.tags as string[] || [],
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    };
  }
}

export const postService = new PostService();
