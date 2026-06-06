import { Request, Response } from 'express';
import { postService } from './service.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { AuthRequest } from '../../middleware/auth.js';

export class PostController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const posts = await postService.getAllPosts();
    res.json({ success: true, data: posts });
  });
  
  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const post = await postService.getPostById(id);
    
    if (!post) {
      res.status(404).json({ success: false, error: 'Post not found' });
      return;
    }
    
    res.json({ success: true, data: post });
  });
  
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const authorId = req.user?.userId as string;
    const post = await postService.createPost(authorId, req.body);
    res.status(201).json({ success: true, data: post, message: 'Post created' });
  });
  
  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.userId;
    
    // Check ownership
    const existing = await postService.getPostById(id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Post not found' });
      return;
    }
    
    if (existing.authorId !== userId && req.user?.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'Access denied' });
      return;
    }
    
    const post = await postService.updatePost(id, req.body);
    res.json({ success: true, data: post, message: 'Post updated' });
  });
  
  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.userId;
    
    const existing = await postService.getPostById(id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Post not found' });
      return;
    }
    
    if (existing.authorId !== userId && req.user?.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'Access denied' });
      return;
    }
    
    await postService.deletePost(id);
    res.json({ success: true, message: 'Post deleted' });
  });
}

export const postController = new PostController();
