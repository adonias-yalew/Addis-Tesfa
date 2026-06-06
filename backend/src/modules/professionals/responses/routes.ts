import { Router } from 'express';
import { professionalResponseController } from './controller.js';
import { authMiddleware, requireVerifiedProfessional, requireNonAnonymous } from '../../middleware/auth.js';

const router = Router();

// Public routes
router.get('/post/:postId', professionalResponseController.getByPost);

// Protected - verified professionals only, non-anonymous
router.post(
  '/',
  authMiddleware,
  requireNonAnonymous,
  requireVerifiedProfessional,
  professionalResponseController.create
);

// Mark response as helpful (any authenticated user)
router.post('/:id/helpful', authMiddleware, professionalResponseController.markHelpful);

export default router;
