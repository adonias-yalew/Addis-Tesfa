import { Request, Response } from 'express';
import { professionalResponseService } from './service.js';
import { asyncHandler } from '../../../middleware/errorHandler.js';
import { AuthRequest } from '../../../middleware/auth.js';

export class ProfessionalResponseController {
  getByPost = asyncHandler(async (req: Request, res: Response) => {
    const postId = req.params.postId as string;
    const responses = await professionalResponseService.getResponsesByPost(postId);
    res.json({ success: true, data: responses });
  });
  
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const professionalId = req.user?.userId as string;
    
    // Professionals CANNOT be anonymous - enforced at middleware level too
    if (req.user?.isAnonymous) {
      res.status(403).json({
        success: false,
        error: 'Anonymous users cannot respond as professionals. Please use a verified account.',
      });
      return;
    }
    
    const response = await professionalResponseService.createResponse(professionalId, req.body);
    res.status(201).json({ success: true, data: response, message: 'Response created' });
  });
  
  markHelpful = asyncHandler(async (req: AuthRequest, res: Response) => {
    const responseId = req.params.id as string;
    await professionalResponseService.markAsHelpful(responseId);
    res.json({ success: true, message: 'Response marked as helpful' });
  });
}

export const professionalResponseController = new ProfessionalResponseController();
