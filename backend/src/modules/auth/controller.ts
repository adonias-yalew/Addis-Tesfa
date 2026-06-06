import { Request, Response } from 'express';
import { authService } from './service.js';
import { asyncHandler } from '../../middleware/errorHandler.js';

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully',
    });
  });
  
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  });
  
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    const user = await authService.getUserById(userId);
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }
    
    res.json({
      success: true,
      data: { user },
    });
  });
}

export const authController = new AuthController();
