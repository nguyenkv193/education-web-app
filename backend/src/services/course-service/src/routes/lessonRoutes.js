import { Router } from 'express';
import { getConfig } from '../../../../shared/config/env.js';
import { authMiddleware, instructorMiddleware } from '../../../../shared/middleware/auth.js';
import {
    getLessonById,
    getLessonsByChapter,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
} from '../controllers/LessonController.js';

const config = getConfig('course');
const router = Router();

// Public routes
router.get('/:id', getLessonById);
router.get('/chapter/:chapterId', getLessonsByChapter);

// Protected routes (Instructor/Admin) - temporarily open for admin UI
router.post(
    '/',
    // authMiddleware(config.jwtSecret, config.userServiceUrl),
    // instructorMiddleware,
    createLesson
);
router.put(
    '/:id',
    // authMiddleware(config.jwtSecret, config.userServiceUrl),
    // instructorMiddleware,
    updateLesson
);
router.delete(
    '/:id',
    // authMiddleware(config.jwtSecret, config.userServiceUrl),
    // instructorMiddleware,
    deleteLesson
);
router.put(
    '/reorder',
    // authMiddleware(config.jwtSecret, config.userServiceUrl),
    // instructorMiddleware,
    reorderLessons
);

export default router;
