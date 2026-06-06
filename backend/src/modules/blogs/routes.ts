import { Router } from 'express';
import { blogController } from './controller.js';
import { authMiddleware, requireVerifiedProfessional } from '../../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', blogController.getAll);
router.get('/:id', blogController.getById);

// Protected - verified professionals/admins only for creation
router.post('/', authMiddleware, requireVerifiedProfessional, blogController.create);
router.put('/:id', authMiddleware, blogController.update);
router.delete('/:id', authMiddleware, blogController.delete);

export default router;
