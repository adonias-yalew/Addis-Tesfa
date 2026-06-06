import { Router } from 'express';
import { adminController } from './controller.js';
import { authMiddleware, requireRole } from '../../middleware/auth.js';
import { UserRole } from '../../types/index.js';

const router = Router();

// All admin routes require admin role
router.use(authMiddleware, requireRole(UserRole.ADMIN));

router.get('/stats', adminController.getStats);
router.get('/moderation/posts', adminController.getPostsForModeration);
router.put('/users/:userId/role', adminController.updateUserRole);
router.put('/posts/:postId/moderate', adminController.moderatePost);

export default router;
