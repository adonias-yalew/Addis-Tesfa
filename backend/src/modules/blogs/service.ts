import { getSupabase } from '../../db/supabaseClient.js';
import { Blog, CreateBlogInput, UpdateBlogInput } from './types.js';

export class BlogService {
  async getAllPublished(): Promise<Blog[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return (data || []).map(this.mapBlog);
  }
  
  async getBlogById(id: string): Promise<Blog | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    return this.mapBlog(data);
  }
  
  async getBlogsByAuthor(authorId: string): Promise<Blog[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return (data || []).map(this.mapBlog);
  }
  
  async createBlog(authorId: string, input: CreateBlogInput): Promise<Blog> {
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('blogs')
      .insert({
        author_id: authorId,
        title: input.title,
        content: input.content,
        excerpt: input.excerpt,
        cover_image: input.coverImage,
        tags: input.tags || [],
        published: input.published || false,
        view_count: 0,
      })
      .select('*')
      .single();
    
    if (error || !data) throw new Error(error?.message || 'Failed to create blog');
    return this.mapBlog(data);
  }
  
  async updateBlog(id: string, input: UpdateBlogInput): Promise<Blog> {
    const supabase = getSupabase();
    
    const updates: Record<string, unknown> = {};
    if (input.title) updates.title = input.title;
    if (input.content) updates.content = input.content;
    if (input.excerpt !== undefined) updates.excerpt = input.excerpt;
    if (input.coverImage !== undefined) updates.cover_image = input.coverImage;
    if (input.tags) updates.tags = input.tags;
    if (input.published !== undefined) updates.published = input.published;
    
    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error || !data) throw new Error(error?.message || 'Failed to update blog');
    return this.mapBlog(data);
  }
  
  async deleteBlog(id: string): Promise<void> {
    const supabase = getSupabase();
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
  
  async incrementViewCount(id: string): Promise<void> {
    const supabase = getSupabase();
    await supabase.rpc('increment_blog_view', { blog_id: id });
  }
  
  private mapBlog(data: Record<string, unknown>): Blog {
    return {
      id: data.id as string,
      authorId: data.author_id as string,
      title: data.title as string,
      content: data.content as string,
      excerpt: data.excerpt as string | undefined,
      coverImage: data.cover_image as string | undefined,
      tags: data.tags as string[] || [],
      published: data.published as boolean,
      viewCount: data.view_count as number,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    };
  }
}

export const blogService = new BlogService();
