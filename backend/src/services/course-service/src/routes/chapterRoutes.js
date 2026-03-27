import { Router } from 'express';
import { getConfig } from '../../../../shared/config/env.js';
import { authMiddleware, instructorMiddleware } from '../../../../shared/middleware/auth.js';
import {
    getChapterById,
    getChaptersByCourse,
    createChapter,
    updateChapter,
    deleteChapter,
    reorderChapters,
} from '../controllers/ChapterController.js';

const config = getConfig('course');
const router = Router();

// Public routes
router.get('/:id', getChapterById);
router.get('/course/:courseId', getChaptersByCourse);

// Protected routes (Instructor/Admin) - temporarily open for admin UI
router.post(
    '/',
    // authMiddleware(config.jwtSecret, config.userServiceUrl),
    // instructorMiddleware,
    createChapter
);
router.put(
    '/:id',
    // authMiddleware(config.jwtSecret, config.userServiceUrl),
    // instructorMiddleware,
    updateChapter
);
router.delete(
    '/:id',
    // authMiddleware(config.jwtSecret, config.userServiceUrl),
    // instructorMiddleware,
    deleteChapter
);
router.put(
    '/reorder',
    // authMiddleware(config.jwtSecret, config.userServiceUrl),
    // instructorMiddleware,
    reorderChapters
);

export default router;
