import { Router } from 'express';
import { getConfig } from '../../../../shared/config/env.js';
import { authMiddleware, adminMiddleware } from '../../../../shared/middleware/auth.js';
import {
    getAllLearningPaths,
    getLearningPathById,
    getLearningPathBySlug,
    getLearningPathByType,
    createLearningPath,
    updateLearningPath,
    deleteLearningPath,
} from '../controllers/LearningPathController.js';

const config = getConfig('learningPath');
const router = Router();

// Public routes
router.get('/', getAllLearningPaths);
router.get('/:id', getLearningPathById);
router.get('/slug/:slug', getLearningPathBySlug);
router.get('/type/:type', getLearningPathByType);

// Protected routes (Admin only)
router.post('/', authMiddleware(config.jwtSecret, config.userServiceUrl), adminMiddleware, createLearningPath);
router.put('/:id', authMiddleware(config.jwtSecret, config.userServiceUrl), adminMiddleware, updateLearningPath);
router.delete('/:id', authMiddleware(config.jwtSecret, config.userServiceUrl), adminMiddleware, deleteLearningPath);

export default router;

