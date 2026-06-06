import { Router } from 'express';
import { professionalController } from './controller.js';
import { authMiddleware, requireRole, requireVerifiedProfessional } from '../../middleware/auth.js';
import { UserRole } from '../../types/index.js';

const router = Router();

// Public routes
router.get('/', professionalController.getAll);
router.get('/:id', professionalController.getById);

// Protected - non-anonymous only for application
router.post('/apply', authMiddleware, requireNonAnonymous, professionalController.apply);

// Admin only
router.get('/admin/pending', authMiddleware, requireRole(UserRole.ADMIN), professionalController.getPending);
router.put('/:id/verify', authMiddleware, requireRole(UserRole.ADMIN), professionalController.verify);

export default router;

// Import requireNonAnonymous
import { requireNonAnonymous } from '../../middleware/auth.js';
