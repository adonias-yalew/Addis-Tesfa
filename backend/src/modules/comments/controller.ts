import { Request, Response } from 'express';
import { commentService } from './service.js';
import { asyncHandler } from '../../middleware/errorHandler.js';
import { AuthRequest } from '../../middleware/auth.js';

export class CommentController {
  getByPost = asyncHandler(async (req: Request, res: Response) => {
    const postId = req.params.postId as string;
    const comments = await commentService.getCommentsByPost(postId);
    res.json({ success: true, data: comments });
  });
  
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const authorId = req.user?.userId as string;
    const comment = await commentService.createComment(authorId, req.body);
    res.status(201).json({ success: true, data: comment, message: 'Comment created' });
  });
  
  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.userId;
    
    const existing = await commentService.getCommentById(id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }
    
    if (existing.authorId !== userId && req.user?.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'Access denied' });
      return;
    }
    
    const comment = await commentService.updateComment(id, req.body);
    res.json({ success: true, data: comment, message: 'Comment updated' });
  });
  
  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const userId = req.user?.userId;
    
    const existing = await commentService.getCommentById(id);
    if (!existing) {
      res.status(404).json({ success: false, error: 'Comment not found' });
      return;
    }
    
    if (existing.authorId !== userId && req.user?.role !== 'ADMIN') {
      res.status(403).json({ success: false, error: 'Access denied' });
      return;
    }
    
    await commentService.deleteComment(id);
    res.json({ success: true, message: 'Comment deleted' });
  });
}

export const commentController = new CommentController();
