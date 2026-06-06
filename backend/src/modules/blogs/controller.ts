import { Request, Response } from 'express';
import { blogService } from './service.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { AuthRequest } from '../../middleware/auth.js';

export class BlogController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const blogs = await blogService.getAllPublished();
    res.json({ success: true, data: blogs });
  });
  
  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const blog = await blogService.getBlogById(id);
    
    if (!blog) {
      res.status(404).json({ success: false, error: 'Blog not found' });
      return;
    }
    
    // Increment view count
    await blogService.incrementViewCount(id);
    
    res.json({ success: true, data: blog });
  });
  
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const authorId = req.user?.userId as string;
    const blog = await blogService.createBlog(authorId, req.body);
    res.status(201).json({ success: true, data: blog, message: 'Blog created' });
  });
  
  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.userId;
    
    const existing = await blogService.getBlogById(id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Blog not found' });
      return;
    }
    
    if (existing.authorId !== userId && req.user?.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'Access denied' });
      return;
    }
    
    const blog = await blogService.updateBlog(id, req.body);
    res.json({ success: true, data: blog, message: 'Blog updated' });
  });
  
  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.userId;
    
    const existing = await blogService.getBlogById(id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Blog not found' });
      return;
    }
    
    if (existing.authorId !== userId && req.user?.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'Access denied' });
      return;
    }
    
    await blogService.deleteBlog(id);
    res.json({ success: true, message: 'Blog deleted' });
  });
}

export const blogController = new BlogController();
