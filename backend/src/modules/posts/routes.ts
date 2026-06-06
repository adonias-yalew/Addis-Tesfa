import { Router } from 'express';
import { postController } from './controller.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = Router();

router.get('/', postController.getAll);
router.get('/:id', postController.getById);
router.post('/', authMiddleware, postController.create);
router.put('/:id', authMiddleware, postController.update);
router.delete('/:id', authMiddleware, postController.delete);

export default router;
